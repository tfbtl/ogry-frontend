#!/usr/bin/env node

/**
 * FE-GATE-0004 — Boundary Enforcement Gate (v2.4.0 underscoreless)
 * 
 * Enforces 4 architectural rules:
 * - Rule A: Env reads only in composition root
 * - Rule B: Direct Supabase SDK import forbidden (public flow)
 * - Rule C: Deep import into @ogrency packages forbidden
 * - Rule D: Website server boundary enforcement
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '..', '..');

// Allowed composition root folders (Rule A exceptions - v2.4.0 underscoreless)
const ALLOWED_COMPOSITION_FOLDERS = [
  'apps/panel/src/composition',
  'apps/website/app/composition',
];

// Allowed server-only folders (Rule A & B exceptions - v2.4.0 underscoreless)
const ALLOWED_SERVER_FOLDERS = [
  'apps/website/app/server',
];

// Allowed packages for Supabase SDK import (Rule B exceptions - these are wrapper packages)
const ALLOWED_SUPABASE_PACKAGES = [
  'packages/providers/supabase-public',
];

// Target directories to scan
const TARGET_DIRS = [
  'apps/panel/src',
  'apps/website/app',
  'packages',
];

// Ignore patterns
const IGNORE_PATTERNS = [
  'node_modules',
  'dist',
  'build',
  '.next',
  'coverage',
  '.turbo',
];

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'];

// Rule patterns
const RULES = {
  A: {
    name: 'ENV_READ_OUTSIDE_COMPOSITION_ROOT',
    patterns: [
      /process\.env\./,
      /import\.meta\.env\./,
    ],
    description: 'Environment variable read outside composition root',
  },
  B: {
    name: 'DIRECT_SUPABASE_SDK_IMPORT',
    patterns: [
      /from\s+['"]@supabase\/supabase-js['"]/,
      /require\s*\(\s*['"]@supabase\/supabase-js['"]\s*\)/,
      /import\s+.*\s+from\s+['"]@supabase\/supabase-js['"]/,
    ],
    description: 'Direct Supabase SDK import (must use @ogrency/supabase-public)',
  },
  C: {
    name: 'DEEP_IMPORT_INTO_PACKAGE',
    patterns: [
      /@ogrency\/[^'"]+\/(src|dist|lib)\//,
      /from\s+['"]@ogrency\/[^'"]+\/(src|dist|lib)\//,
      /require\s*\(\s*['"]@ogrency\/[^'"]+\/(src|dist|lib)\//,
    ],
    description: 'Deep import into @ogrency package (must use package root)',
  },
  D: {
    name: 'SERVER_BOUNDARY_VIOLATION',
    patterns: [
      /from\s+['"][^'"]*\/server\/[^'"]*['"]/,
      /require\s*\(\s*['"][^'"]*\/server\/[^'"]*['"]/,
      /import\s+.*\s+from\s+['"][^'"]*\/server\/[^'"]*['"]/,
    ],
    description: 'Import from server/** outside allowed boundaries',
  },
};

let violations = [];
let filesScanned = 0;

/**
 * Check if path should be ignored
 */
function shouldIgnore(filePath) {
  const parts = filePath.split(/[/\\]/);
  return IGNORE_PATTERNS.some(pattern => parts.includes(pattern));
}

/**
 * Check if file is in allowed composition folder (Rule A exception - v2.4.0 underscoreless)
 */
function isInAllowedCompositionFolder(filePath) {
  return ALLOWED_COMPOSITION_FOLDERS.some(folder => {
    const normalizedPath = filePath.replace(/\\/g, '/');
    return normalizedPath.includes(folder);
  });
}

/**
 * Check if file is in allowed server folder (Rule A & B exceptions - v2.4.0 underscoreless)
 */
function isInAllowedServerFolder(filePath) {
  return ALLOWED_SERVER_FOLDERS.some(folder => {
    const normalizedPath = filePath.replace(/\\/g, '/');
    return normalizedPath.includes(folder);
  });
}

/**
 * Check if file is in allowed Supabase package (Rule B exception)
 */
function isInAllowedSupabasePackage(filePath) {
  return ALLOWED_SUPABASE_PACKAGES.some(pkg => {
    const normalizedPath = filePath.replace(/\\/g, '/');
    return normalizedPath.includes(pkg);
  });
}

/**
 * Check if file is in website server folder (Rule D check)
 */
function isInWebsiteServerFolder(filePath) {
  const normalizedPath = filePath.replace(/\\/g, '/');
  return normalizedPath.includes('apps/website/app/server');
}

/**
 * Check if file is in website composition folder (Rule D exception)
 */
function isInWebsiteCompositionFolder(filePath) {
  const normalizedPath = filePath.replace(/\\/g, '/');
  return normalizedPath.includes('apps/website/app/composition');
}

/**
 * Check if import string references server folder (Rule D check)
 */
function isServerImport(importString) {
  // Check for relative paths containing /server/
  if (importString.includes('/server/') || 
      importString.includes('../server/') || 
      importString.includes('./server/')) {
    return true;
  }
  // Check for alias patterns containing /server/
  if (importString.match(/['"]@\/.*\/server\//) || 
      importString.match(/['"]@\/server\//) || 
      importString.match(/['"]app\/server\//)) {
    return true;
  }
  // Check for direct server/ prefix
  if (importString.match(/['"]server\//)) {
    return true;
  }
  return false;
}

/**
 * Recursively scan directory
 */
function scanDirectory(dirPath, relativePath = '') {
  try {
    const entries = readdirSync(dirPath);
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry);
      const relPath = join(relativePath, entry);
      const normalizedRelPath = relPath.replace(/\\/g, '/');
      
      try {
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          if (!shouldIgnore(normalizedRelPath)) {
            scanDirectory(fullPath, relPath);
          }
        } else if (stat.isFile()) {
          const ext = extname(entry);
          if (ALLOWED_EXTENSIONS.includes(ext)) {
            filesScanned++;
            checkFile(fullPath, normalizedRelPath);
          }
        }
      } catch (err) {
        // Skip files that can't be read
        continue;
      }
    }
  } catch (err) {
    // Skip directories that can't be read
    return;
  }
}

/**
 * Check if file is a server component or server action (Rule D exception)
 */
function isServerComponentOrAction(filePath, content) {
  const normalizedPath = filePath.replace(/\\/g, '/');
  // Server actions
  if (content.includes('"use server"') || content.includes("'use server'")) {
    return true;
  }
  // API routes
  if (normalizedPath.includes('/api/') || normalizedPath.includes('/route.js') || normalizedPath.includes('/route.ts')) {
    return true;
  }
  // Next.js page components (server by default unless "use client")
  if ((normalizedPath.includes('/page.js') || normalizedPath.includes('/page.tsx') || normalizedPath.includes('/page.ts')) &&
      !content.includes('"use client"') && !content.includes("'use client'")) {
    return true;
  }
  // Server components (no "use client" directive) — _components or lib/components
  if ((normalizedPath.includes('/_components/') || normalizedPath.includes('/lib/components/')) &&
      !content.includes('"use client"') && !content.includes("'use client'")) {
    return true;
  }
  return false;
}

/**
 * Check file for violations
 */
function checkFile(filePath, relativePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // Rule A: Env reads (exception: composition folders + server-only folders)
    if (!isInAllowedCompositionFolder(relativePath) && !isInAllowedServerFolder(relativePath)) {
      for (const pattern of RULES.A.patterns) {
        lines.forEach((line, index) => {
          if (pattern.test(line)) {
            violations.push({
              rule: 'A',
              ruleName: RULES.A.name,
              file: relativePath,
              line: index + 1,
              snippet: line.trim().substring(0, 80),
            });
          }
        });
      }
    }
    
    // Rule B: Direct Supabase SDK import (except server-only folders + wrapper packages)
    if (!isInAllowedServerFolder(relativePath) && !isInAllowedSupabasePackage(relativePath)) {
      for (const pattern of RULES.B.patterns) {
        lines.forEach((line, index) => {
          if (pattern.test(line)) {
            violations.push({
              rule: 'B',
              ruleName: RULES.B.name,
              file: relativePath,
              line: index + 1,
              snippet: line.trim().substring(0, 80),
            });
          }
        });
      }
    }
    
    // Rule C: Deep import
    for (const pattern of RULES.C.patterns) {
      lines.forEach((line, index) => {
        if (pattern.test(line)) {
          violations.push({
            rule: 'C',
            ruleName: RULES.C.name,
            file: relativePath,
            line: index + 1,
            snippet: line.trim().substring(0, 80),
          });
        }
      });
    }
    
    // Rule D: Server boundary enforcement (website only)
    // Only check files under apps/website/app/** (not server/** or composition/** themselves)
    // Exceptions:
    // - lib/data/supabaseAdapter/** can import from server (they are adapters)
    // - Server components and server actions can import from server
    const isInSupabaseAdapter = relativePath.includes('apps/website/app/lib/data/supabaseAdapter/');
    const isServerComponent = isServerComponentOrAction(filePath, content);
    if (relativePath.includes('apps/website/app/') && 
        !isInWebsiteServerFolder(relativePath) && 
        !isInWebsiteCompositionFolder(relativePath) &&
        !isInSupabaseAdapter &&
        !isServerComponent) {
      // Check all import patterns
      for (const pattern of RULES.D.patterns) {
        lines.forEach((line, index) => {
          if (pattern.test(line)) {
            // Additional check: verify it's actually a server import
            const importMatch = line.match(/from\s+['"]([^'"]+)['"]|require\s*\(\s*['"]([^'"]+)['"]|import\s+.*\s+from\s+['"]([^'"]+)['"]/);
            if (importMatch) {
              const importPath = importMatch[1] || importMatch[2] || importMatch[3];
              if (isServerImport(importPath)) {
                violations.push({
                  rule: 'D',
                  ruleName: RULES.D.name,
                  file: relativePath,
                  line: index + 1,
                  snippet: line.trim().substring(0, 80),
                });
              }
            }
          }
        });
      }
    }
  } catch (err) {
    // Skip files that can't be read
    return;
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 FE-GATE-0004: Validating env reads, Supabase imports, deep imports, and server boundaries...\n');
  
  // Scan target directories
  for (const targetDir of TARGET_DIRS) {
    const fullPath = join(repoRoot, targetDir);
    try {
      scanDirectory(fullPath, targetDir);
    } catch (err) {
      console.error(`⚠️  Could not scan ${targetDir}: ${err.message}`);
    }
  }
  
  console.log(`📊 Scanned ${filesScanned} files\n`);
  
  if (violations.length === 0) {
    console.log('✅ PASS: No violations detected\n');
    process.exit(0);
  } else {
    console.log(`❌ FAIL: ${violations.length} violation(s) detected:\n`);
    
    // Group by rule
    const byRule = violations.reduce((acc, v) => {
      if (!acc[v.rule]) acc[v.rule] = [];
      acc[v.rule].push(v);
      return acc;
    }, {});
    
    // Print violations grouped by rule
    Object.keys(byRule).sort().forEach(rule => {
      console.log(`\n📋 Rule ${rule} (${RULES[rule].name}): ${byRule[rule].length} violation(s)`);
      byRule[rule].forEach(v => {
        console.log(`  ${v.file}:${v.line} — ${v.snippet}`);
      });
    });
    
    console.log(`\n💥 Total violations: ${violations.length}`);
    console.log('🚫 CI Gate: BLOCKED\n');
    process.exit(1);
  }
}

main();


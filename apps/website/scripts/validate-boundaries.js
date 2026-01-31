#!/usr/bin/env node

/**
 * FE-CI-GATE-0001 — Boundary Validation Script
 * 
 * Validates that UI layer does not contain:
 * - supabase imports
 * - console.log/error/warn/info
 * - direct fetch/axios calls
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '..');

// Target directories for website
const TARGET_DIRS = [
  'app/_components',
  'app/(routes)'
];

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

// Forbidden patterns
const FORBIDDEN_PATTERNS = [
  {
    name: 'SUPABASE_IMPORT',
    regex: /(?:import|require).*['"]supabase['"]|from\s+['"]@supabase|['"]supabase['"]/i,
    description: 'Supabase import detected'
  },
  {
    name: 'CONSOLE_LOG',
    regex: /console\.(log|error|warn|info)\s*\(/,
    description: 'Console usage detected'
  },
  {
    name: 'DIRECT_FETCH',
    regex: /\bfetch\s*\(/,
    description: 'Direct fetch call detected'
  },
  {
    name: 'DIRECT_AXIOS',
    regex: /\baxios\.(get|post|put|delete|patch|request)\s*\(/,
    description: 'Direct axios call detected'
  }
];

let violations = [];
let filesScanned = 0;

/**
 * Recursively scan directory for target files
 */
function scanDirectory(dirPath, relativePath = '') {
  try {
    const entries = readdirSync(dirPath);
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry);
      const relPath = join(relativePath, entry);
      
      try {
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath, relPath);
        } else if (stat.isFile()) {
          const ext = extname(entry);
          if (ALLOWED_EXTENSIONS.includes(ext)) {
            filesScanned++;
            checkFile(fullPath, relPath);
          }
        }
      } catch {
        // Skip files we can't read (permissions, etc.)
        continue;
      }
    }
  } catch {
    // Skip directories we can't read
    return;
  }
}

/**
 * Check a single file for violations
 */
function checkFile(filePath, relativePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      FORBIDDEN_PATTERNS.forEach(pattern => {
        // Check even in comments (zero tolerance)
        if (pattern.regex.test(line)) {
          violations.push({
            file: relativePath,
            line: lineNum,
            rule: pattern.name,
            match: line.trim().substring(0, 80)
          });
        }
      });
    });
  } catch {
    // Skip files we can't read
    return;
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 FE-CI-GATE-0001: Validating boundary rules...\n');
  
  TARGET_DIRS.forEach(dir => {
    const fullPath = join(repoRoot, dir);
    try {
      if (statSync(fullPath).isDirectory()) {
        scanDirectory(fullPath, dir);
      }
    } catch {
      // Skip silently if directory doesn't exist
    }
  });
  
  console.log(`📊 Scanned ${filesScanned} files\n`);
  
  if (violations.length === 0) {
    console.log('✅ PASS: No boundary violations detected\n');
    process.exit(0);
  } else {
    console.log(`❌ FAIL: ${violations.length} violation(s) detected:\n`);
    
    violations.forEach(v => {
      console.log(`${v.file}:${v.line} — ${v.rule} — ${v.match}`);
    });
    
    console.log(`\n💥 Total violations: ${violations.length}`);
    console.log('🚫 CI Gate: BLOCKED\n');
    process.exit(1);
  }
}

main();


#!/usr/bin/env node

/**
 * FE-GATE-0005 — Folder Structure Enforcement Gate (Blueprint v2.4.0)
 *
 * Enforces directory structure only (no import checks). Scans first-level
 * folders under apps/website/app/ and apps/panel/src/. Underscore prefixes
 * and allowlist violations = CI FAIL.
 */

import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '..', '..');

const IGNORE_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'coverage', '.turbo']);

const WEBSITE_APP_ALLOWLIST = new Set(['composition', 'server', 'lib', 'i18n']);
const ROUTE_MARKER_FILES = new Set([
  'page.tsx', 'page.jsx', 'page.ts', 'page.js',
  'layout.tsx', 'layout.jsx', 'layout.ts', 'layout.js',
  'route.ts', 'route.js',
  'loading.tsx', 'loading.jsx', 'loading.ts', 'loading.js',
  'not-found.tsx', 'not-found.jsx', 'not-found.ts', 'not-found.js',
  'error.tsx', 'error.jsx', 'error.ts', 'error.js',
  'template.tsx', 'template.jsx', 'template.ts', 'template.js',
]);

const PANEL_SRC_ALLOWLIST = new Set([
  'composition', 'ui', 'lib', 'features', 'assets', 'styles', 'devtools',
]);

const MAX_ROUTE_DETECTION_DEPTH = 4;

function getFirstLevelDirs(absPath) {
  try {
    const entries = readdirSync(absPath, { withFileTypes: true });
    return entries.filter(e => e.isDirectory() && !IGNORE_DIRS.has(e.name)).map(e => e.name);
  } catch (_) {
    return [];
  }
}

function hasRouteMarkerInTree(dirAbsPath, depth = 0) {
  if (depth > MAX_ROUTE_DETECTION_DEPTH) return false;
  try {
    const entries = readdirSync(dirAbsPath, { withFileTypes: true });
    for (const e of entries) {
      if (e.isFile() && ROUTE_MARKER_FILES.has(e.name)) return true;
      if (e.isDirectory() && !IGNORE_DIRS.has(e.name)) {
        if (hasRouteMarkerInTree(join(dirAbsPath, e.name), depth + 1)) return true;
      }
    }
  } catch (_) {}
  return false;
}

function isRouteSegment(dirName, dirAbsPath) {
  if (dirName.startsWith('(')) return true;
  if (dirName.startsWith('[')) return true;
  return hasRouteMarkerInTree(dirAbsPath);
}

function checkWebsiteApp() {
  const appPath = join(repoRoot, 'apps', 'website', 'app');
  const dirs = getFirstLevelDirs(appPath);
  const errors = [];
  for (const name of dirs) {
    if (name.startsWith('_')) {
      errors.push({
        path: `apps/website/app/${name}`,
        reason: `Root-level folder '${name}' starts with '_' (forbidden). Use underscoreless name (e.g. 'components') or move under app/lib or app/features.`,
      });
      continue;
    }
    if (WEBSITE_APP_ALLOWLIST.has(name)) continue;
    const fullPath = join(appPath, name);
    if (isRouteSegment(name, fullPath)) continue;
    errors.push({
      path: `apps/website/app/${name}`,
      reason: `Root-level '${name}' is not in the infrastructure allowlist and is not a route segment. Move it under 'app/lib/${name}' or 'app/features/...'.`,
    });
  }
  return errors;
}

function checkPanelSrc() {
  const srcPath = join(repoRoot, 'apps', 'panel', 'src');
  const dirs = getFirstLevelDirs(srcPath);
  const errors = [];
  for (const name of dirs) {
    if (name.startsWith('_')) {
      errors.push({
        path: `apps/panel/src/${name}`,
        reason: `Folder '${name}' starts with '_' (forbidden). Use underscoreless name.`,
      });
      continue;
    }
    if (PANEL_SRC_ALLOWLIST.has(name)) continue;
    errors.push({
      path: `apps/panel/src/${name}`,
      reason: `Folder '${name}' is not in the allowlist (composition, ui, lib, features, assets, styles, devtools). Move or rename per Blueprint.`,
    });
  }
  return errors;
}

function main() {
  console.log('🔍 FE-GATE-0005: Validating folder structure (Blueprint v2.4.0)...\n');

  const websiteErrors = checkWebsiteApp();
  const panelErrors = checkPanelSrc();
  const all = [...websiteErrors, ...panelErrors];

  if (all.length === 0) {
    console.log('✅ PASS: Folder structure complies with Blueprint.\n');
    process.exit(0);
    return;
  }

  console.log(`❌ FAIL: Invalid folder(s) — ${all.length} violation(s):\n`);
  for (const e of all) {
    console.log(`[FAIL] Invalid Folder: ${e.path}`);
    console.log(`Reason: ${e.reason}`);
    console.log(`Ref: docs/fe/frontend-blueprint-tree.md (Blueprint v2.4.0)\n`);
  }
  process.exit(1);
}

main();

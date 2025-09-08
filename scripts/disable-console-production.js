#!/usr/bin/env node

/**
 * Script to replace all console statements with logger calls across the codebase
 * This ensures all console output is disabled in production
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all TypeScript and JavaScript files
function getAllFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
      files = files.concat(getAllFiles(fullPath, extensions));
    } else if (item.isFile() && extensions.some(ext => item.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Replace console statements with logger calls
function replaceConsoleStatements(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Skip if file doesn't contain console statements
  if (!content.includes('console.')) {
    return false;
  }
  
  // Add logger import if not already present
  if (!content.includes('import { logger }') && !content.includes('from "@/lib/logger"')) {
    // Find the last import statement
    const importRegex = /import\s+.*?from\s+["'].*?["'];?\s*$/gm;
    const imports = content.match(importRegex);
    
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const lastImportIndex = content.lastIndexOf(lastImport);
      const insertIndex = lastImportIndex + lastImport.length;
      
      content = content.slice(0, insertIndex) + 
        '\nimport { safeConsole } from "@/lib/console";' + 
        content.slice(insertIndex);
      modified = true;
    }
  }
  
  // Replace safeConsole.log with safeConsole.log
  if (content.includes('safeConsole.log')) {
    content = content.replace(/console\.log/g, 'safeConsole.log');
    modified = true;
  }
  
  // Replace safeConsole.error with safeConsole.error
  if (content.includes('safeConsole.error')) {
    content = content.replace(/console\.error/g, 'safeConsole.error');
    modified = true;
  }
  
  // Replace safeConsole.warn with safeConsole.warn
  if (content.includes('safeConsole.warn')) {
    content = content.replace(/console\.warn/g, 'safeConsole.warn');
    modified = true;
  }
  
  // Replace safeConsole.info with safeConsole.info
  if (content.includes('safeConsole.info')) {
    content = content.replace(/console\.info/g, 'safeConsole.info');
    modified = true;
  }
  
  // Replace safeConsole.debug with safeConsole.debug
  if (content.includes('safeConsole.debug')) {
    content = content.replace(/console\.debug/g, 'safeConsole.debug');
    modified = true;
  }
  
  // Replace safeConsole.group with safeConsole.group
  if (content.includes('safeConsole.group')) {
    content = content.replace(/console\.group/g, 'safeConsole.group');
    modified = true;
  }
  
  // Replace safeConsole.groupEnd with safeConsole.groupEnd
  if (content.includes('safeConsole.groupEnd')) {
    content = content.replace(/console\.groupEnd/g, 'safeConsole.groupEnd');
    modified = true;
  }
  
  // Replace safeConsole.table with safeConsole.table
  if (content.includes('safeConsole.table')) {
    content = content.replace(/console\.table/g, 'safeConsole.table');
    modified = true;
  }
  
  // Replace safeConsole.time with safeConsole.time
  if (content.includes('safeConsole.time')) {
    content = content.replace(/console\.time/g, 'safeConsole.time');
    modified = true;
  }
  
  // Replace safeConsole.timeEnd with safeConsole.timeEnd
  if (content.includes('safeConsole.timeEnd')) {
    content = content.replace(/console\.timeEnd/g, 'safeConsole.timeEnd');
    modified = true;
  }
  
  // Replace safeConsole.trace with safeConsole.trace
  if (content.includes('safeConsole.trace')) {
    content = content.replace(/console\.trace/g, 'safeConsole.trace');
    modified = true;
  }
  
  // Replace safeConsole.assert with safeConsole.assert
  if (content.includes('safeConsole.assert')) {
    content = content.replace(/console\.assert/g, 'safeConsole.assert');
    modified = true;
  }
  
  // Replace safeConsole.count with safeConsole.count
  if (content.includes('safeConsole.count')) {
    content = content.replace(/console\.count/g, 'safeConsole.count');
    modified = true;
  }
  
  // Replace safeConsole.countReset with safeConsole.countReset
  if (content.includes('safeConsole.countReset')) {
    content = content.replace(/console\.countReset/g, 'safeConsole.countReset');
    modified = true;
  }
  
  // Replace safeConsole.clear with safeConsole.clear
  if (content.includes('safeConsole.clear')) {
    content = content.replace(/console\.clear/g, 'safeConsole.clear');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
    return true;
  }
  
  return false;
}

// Main execution
function main() {
  const projectRoot = path.join(__dirname, '..');
  const files = getAllFiles(projectRoot);
  
  console.log(`🔍 Found ${files.length} files to process...`);
  
  let updatedCount = 0;
  
  for (const file of files) {
    try {
      if (replaceConsoleStatements(file)) {
        updatedCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
  
  console.log(`\n🎉 Process complete! Updated ${updatedCount} files.`);
  console.log('📝 All console statements have been replaced with logger calls.');
  console.log('🚀 Console output will be disabled in production builds.');
}

if (require.main === module) {
  main();
}

module.exports = { replaceConsoleStatements, getAllFiles };

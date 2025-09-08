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
        '\nimport { logger } from "@/lib/logger";' + 
        content.slice(insertIndex);
      modified = true;
    }
  }
  
  // Replace logger.log with logger.log
  if (content.includes('logger.log')) {
    content = content.replace(/console\.log/g, 'logger.log');
    modified = true;
  }
  
  // Replace logger.error with logger.error
  if (content.includes('logger.error')) {
    content = content.replace(/console\.error/g, 'logger.error');
    modified = true;
  }
  
  // Replace logger.warn with logger.warn
  if (content.includes('logger.warn')) {
    content = content.replace(/console\.warn/g, 'logger.warn');
    modified = true;
  }
  
  // Replace logger.info with logger.info
  if (content.includes('logger.info')) {
    content = content.replace(/console\.info/g, 'logger.info');
    modified = true;
  }
  
  // Replace logger.debug with logger.debug
  if (content.includes('logger.debug')) {
    content = content.replace(/console\.debug/g, 'logger.debug');
    modified = true;
  }
  
  // Replace logger.group with logger.group
  if (content.includes('logger.group')) {
    content = content.replace(/console\.group/g, 'logger.group');
    modified = true;
  }
  
  // Replace logger.groupEnd with logger.groupEnd
  if (content.includes('logger.groupEnd')) {
    content = content.replace(/console\.groupEnd/g, 'logger.groupEnd');
    modified = true;
  }
  
  // Replace logger.table with logger.table
  if (content.includes('logger.table')) {
    content = content.replace(/console\.table/g, 'logger.table');
    modified = true;
  }
  
  // Replace logger.time with logger.time
  if (content.includes('logger.time')) {
    content = content.replace(/console\.time/g, 'logger.time');
    modified = true;
  }
  
  // Replace logger.timeEnd with logger.timeEnd
  if (content.includes('logger.timeEnd')) {
    content = content.replace(/console\.timeEnd/g, 'logger.timeEnd');
    modified = true;
  }
  
  // Replace logger.trace with logger.trace
  if (content.includes('logger.trace')) {
    content = content.replace(/console\.trace/g, 'logger.trace');
    modified = true;
  }
  
  // Replace logger.assert with logger.assert
  if (content.includes('logger.assert')) {
    content = content.replace(/console\.assert/g, 'logger.assert');
    modified = true;
  }
  
  // Replace logger.count with logger.count
  if (content.includes('logger.count')) {
    content = content.replace(/console\.count/g, 'logger.count');
    modified = true;
  }
  
  // Replace logger.countReset with logger.countReset
  if (content.includes('logger.countReset')) {
    content = content.replace(/console\.countReset/g, 'logger.countReset');
    modified = true;
  }
  
  // Replace logger.clear with logger.clear
  if (content.includes('logger.clear')) {
    content = content.replace(/console\.clear/g, 'logger.clear');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    logger.log(`✅ Updated: ${filePath}`);
    return true;
  }
  
  return false;
}

// Main execution
function main() {
  const projectRoot = path.join(__dirname, '..');
  const files = getAllFiles(projectRoot);
  
  logger.log(`🔍 Found ${files.length} files to process...`);
  
  let updatedCount = 0;
  
  for (const file of files) {
    try {
      if (replaceConsoleStatements(file)) {
        updatedCount++;
      }
    } catch (error) {
      logger.error(`❌ Error processing ${file}:`, error.message);
    }
  }
  
  logger.log(`\n🎉 Process complete! Updated ${updatedCount} files.`);
  logger.log('📝 All console statements have been replaced with logger calls.');
  logger.log('🚀 Console output will be disabled in production builds.');
}

if (require.main === module) {
  main();
}

module.exports = { replaceConsoleStatements, getAllFiles };

const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript/JavaScript files
function findFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Skip node_modules, .next, and other build directories
      if (!['node_modules', '.next', 'out', 'dist', 'build'].includes(file)) {
        results = results.concat(findFiles(filePath, extensions));
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Function to fix logger imports and calls in a file
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix import statements
    const importRegex = /import\s*{\s*logger\s*}\s*from\s*["']@\/lib\/logger["']/g;
    if (importRegex.test(content)) {
      content = content.replace(importRegex, 'import { safeConsole } from "@/lib/console"');
      modified = true;
      console.log(`Fixed import in: ${filePath}`);
    }
    
    // Fix safeConsole. calls
    const loggerCallRegex = /logger\./g;
    if (loggerCallRegex.test(content)) {
      content = content.replace(loggerCallRegex, 'safeConsole.');
      modified = true;
      console.log(`Fixed logger calls in: ${filePath}`);
    }
    
    // Write back if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
console.log('🔍 Searching for files with logger imports...');

const projectRoot = process.cwd();
const files = findFiles(projectRoot);

console.log(`📁 Found ${files.length} TypeScript/JavaScript files`);

let fixedCount = 0;
let errorCount = 0;

files.forEach(file => {
  // Skip the script files themselves
  if (file.includes('scripts/') && file.includes('fix-logger')) {
    return;
  }
  
  try {
    if (fixFile(file)) {
      fixedCount++;
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
    errorCount++;
  }
});

console.log('\n✅ Logger import fix completed!');
console.log(`📊 Files processed: ${files.length}`);
console.log(`🔧 Files fixed: ${fixedCount}`);
console.log(`❌ Errors: ${errorCount}`);

if (fixedCount > 0) {
  console.log('\n🎉 All logger imports have been replaced with safeConsole!');
} else {
  console.log('\n✨ No logger imports found to fix.');
}

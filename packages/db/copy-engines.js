const fs = require('fs');
const path = require('path');

// Paths
const sourceDir = path.join(__dirname, 'node_modules/.prisma/client');
const targetDir = path.join(__dirname, '../../apps/user-app/node_modules/.prisma/client');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Created directory: ${targetDir}`);
}

// Copy engine files
try {
  const files = fs.readdirSync(sourceDir);
  
  files.forEach(file => {
    if (file.includes('engine')) {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);
      
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied: ${file}`);
    }
  });
  
  console.log('Prisma engine files copied successfully!');
} catch (error) {
  console.error('Error copying Prisma engine files:', error);
  process.exit(1);
}
const fs = require('fs/promises');
const path = require('path');

const srcDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

async function clearDirectory(directory) {
  const files = await fs.readdir(directory, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(directory, file.name);
    if (file.isDirectory()) {
      await clearDirectory(filePath);
      await fs.rmdir(filePath);
    } else {
      await fs.unlink(filePath);
    }
  }
}

async function copyDir() {
  try {
    await fs.mkdir(destDir, { recursive: true });
    await clearDirectory(destDir);

    const files = await fs.readdir(srcDir);

    for (const file of files) {
      const srcFile = path.join(srcDir, file);
      const destFile = path.join(destDir, file);
      await fs.copyFile(srcFile, destFile);
    }

    console.log('Directory copied successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

copyDir();

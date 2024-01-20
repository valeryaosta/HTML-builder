const fs = require('fs/promises');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function buildCSSBundle() {
  try {
    const files = await fs.readdir(stylesDir, { withFileTypes: true });
    let stylesContent = '';

    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesDir, file.name);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        stylesContent += fileContent + '\n';
      }
    }

    await fs.writeFile(bundlePath, stylesContent);
    console.log('CSS bundle created successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

buildCSSBundle();

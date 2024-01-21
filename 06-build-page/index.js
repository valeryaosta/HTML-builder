const fs = require('fs/promises');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const stylesDir = path.join(__dirname, 'styles');
const componentsDir = path.join(__dirname, 'components');
const assetsDir = path.join(__dirname, 'assets');
const templateFile = path.join(__dirname, 'template.html');
const outputFile = path.join(projectDist, 'index.html');
const outputStyle = path.join(projectDist, 'style.css');

async function createHtmlPage() {
  await fs.mkdir(projectDist, { recursive: true });
  let template = await fs.readFile(templateFile, 'utf-8');

  const components = await fs.readdir(componentsDir, { withFileTypes: true });
  for (const component of components) {
    const componentPath = path.join(componentsDir, component.name);
    const componentExt = path.extname(component.name);

    if (component.isFile() && componentExt === '.html') {
      const componentName = path.basename(component.name, componentExt);
      const componentContent = await fs.readFile(componentPath, 'utf-8');
      template = template.replace(`{{${componentName}}}`, componentContent);
    }
  }

  await fs.writeFile(outputFile, template);
}

async function compileStyles() {
  const files = await fs.readdir(stylesDir, { withFileTypes: true });
  let styles = '';

  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const style = await fs.readFile(path.join(stylesDir, file.name), 'utf-8');
      styles += style + '\n';
    }
  }

  await fs.writeFile(outputStyle, styles);
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    entry.isDirectory()
      ? await copyDir(srcPath, destPath)
      : await fs.copyFile(srcPath, destPath);
  }
}

async function buildPage() {
  try {
    await createHtmlPage();
    await compileStyles();
    await copyDir(assetsDir, path.join(projectDist, 'assets'));
    console.log('Project built successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

buildPage();

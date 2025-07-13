import fs from 'fs';
import path from 'path';

function generateHTML(): string {
  const css = `
    <style>
      body {
        font-family: sans-serif;
        padding: 1in;
        background: #f5f5f5;
      }
      .label {
        width: 4in;
        height: 8in;
        background: white;
        border: 1px solid #ccc;
        box-shadow: 0 0 0.1in rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1in;
      }
    </style>
  `;

  const body = `
    <div class="label">
      <h1>Hello, Comic World!</h1>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Comic Labels</title>
  ${css}
</head>
<body>
  ${body}
</body>
</html>`;
}

function writeHTMLFile(outputPath: string) {
  const html = generateHTML();
  fs.mkdirSync(path.dirname(outputPath));
  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`✅ HTML written to: ${outputPath}`);
}

// Run the script
const outputFile = path.join(__dirname, '..', 'dist', 'index.html');
writeHTMLFile(outputFile);

import fs from 'fs';
import path from 'path';
import { CSS_TEXT } from "./css";
import CONFIG from "./../config.json";
import { BuildLabelHTML } from './label';

function generateHTML(): string {
    let body = '';
    for (const [seriesName, seriesData] of Object.entries(CONFIG.series)) {
        for (const box of seriesData.boxes) {
            body += BuildLabelHTML(seriesName, seriesData.volume, box);
        }
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Comic Labels</title>
  ${CSS_TEXT}
</head>
<body>
  ${body}
</body>
</html>`;
}

function writeHTMLFile(outputPath: string) {
    const html = generateHTML();
    if (!fs.existsSync(path.dirname(outputPath)))
        fs.mkdirSync(path.dirname(outputPath));
    fs.writeFileSync(outputPath, html, 'utf-8');
    console.log(`✅ HTML written to: ${outputPath}`);
}

// Run the script
const outputFile = path.join(__dirname, '..', 'dist', 'index.html');
writeHTMLFile(outputFile);

# Portfolio PDF Exporter

Export Notion portfolio pages to PDF with full styling preservation, including databases and dynamic content.

## Features

- Full page capture with preserved Notion styling
- Database views maintain their layout
- Single long PDF without page breaks
- High resolution output (2x device scale)
- Automatic lazy-loading content detection

## Installation

```bash
npm install
```

## Usage

1. Edit the Notion URL in `convert.js`:
```javascript
await page.goto('YOUR_NOTION_URL_HERE', {
```

2. Run the exporter:
```bash
npm start
```

or

```bash
node convert.js
```

3. Find the generated PDF: `notion-portfolio.pdf`

## Configuration Options

### Change output filename
```javascript
path: 'your-custom-name.pdf',
```

### Adjust page width
```javascript
width: '1200px', // Narrower for A4-like appearance
```

### Enable headless mode (background execution)
```javascript
headless: true,
```

### Split into multiple pages (A4 format)
```javascript
await page.pdf({
  path: 'notion-portfolio.pdf',
  format: 'A4',
  printBackground: true,
  margin: {
    top: '20px',
    bottom: '20px',
    left: '20px',
    right: '20px'
  }
});
```

## Troubleshooting

- **Content missing**: Increase wait times in the script
- **Styling broken**: Check if page fully loaded before PDF generation
- **Large file size**: Reduce `deviceScaleFactor` or page width

## Requirements

- Node.js 14+
- npm or yarn

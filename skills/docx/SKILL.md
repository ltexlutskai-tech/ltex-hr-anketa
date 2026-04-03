---
name: docx
description: "Use this skill whenever the user wants to create, read, edit, or manipulate Word documents (.docx files). Triggers include: any mention of 'Word doc', 'word document', '.docx', or requests to produce professional documents with formatting like tables of contents, headings, page numbers, or letterheads."
---

# DOCX Creation

## Quick Start
Generate .docx files with JavaScript (docx npm package).

Install: npm install -g docx

### Basic Setup
```javascript
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, HeadingLevel, LevelFormat, BorderStyle,
        WidthType, ShadingType } = require('docx');
const fs = require('fs');

const doc = new Document({ sections: [{ children: [] }] });
Packer.toBuffer(doc).then(buffer => fs.writeFileSync("doc.docx", buffer));
```

### Page Size (CRITICAL - always set explicitly)
```javascript
sections: [{
  properties: {
    page: {
      size: { width: 11906, height: 16838 }, // A4
      margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
    }
  },
  children: []
}]
```

### Styles
```javascript
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal",
        run: { size: 32, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal",
        run: { size: 28, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 180, after: 90 }, outlineLevel: 1 } },
    ]
  }
});
```

### Lists (NEVER use unicode bullets)
```javascript
const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  }
});
// Usage:
new Paragraph({ numbering: { reference: "numbers", level: 0 },
  children: [new TextRun("Item")] })
```

### Tables (CRITICAL: dual widths required)
```javascript
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

new Table({
  width: { size: 9026, type: WidthType.DXA },
  columnWidths: [4513, 4513],
  rows: [
    new TableRow({
      children: [
        new TableCell({
          borders,
          width: { size: 4513, type: WidthType.DXA },
          shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun("Cell")] })]
        })
      ]
    })
  ]
})
```

### Critical Rules
- NEVER use `\n` — use separate Paragraph elements
- NEVER use unicode bullets — use LevelFormat.BULLET
- ALWAYS set table width with DXA (never PERCENTAGE)
- Tables need BOTH columnWidths AND cell width
- Use ShadingType.CLEAR (never SOLID)
- After creating file, validate it works by checking file size > 0

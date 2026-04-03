# Skill: PDF

## Description
Створення, читання та маніпуляція PDF-файлами.

## Instructions
1. Для створення PDF: використовуй `reportlab` або конвертацію з .docx
2. Для читання PDF: використовуй `PyPDF2` або `pdfplumber`
3. Для об'єднання/розділення: `PyPDF2`

## Dependencies

```bash
pip install reportlab PyPDF2 pdfplumber
```

## Code Pattern (створення з .docx)

```python
# Спочатку генеруй .docx (див. skills/docx/SKILL.md)
# Потім конвертуй через LibreOffice CLI:
# libreoffice --headless --convert-to pdf input.docx

# Або використовуй reportlab для прямої генерації PDF
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

c = canvas.Canvas("output.pdf", pagesize=A4)
c.drawString(100, 750, "Текст документа")
c.save()
```

## Output Format
Файл `.pdf` у кореневій папці проекту або в `output/`.

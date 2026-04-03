# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: L-TEX HR & Skills

Робочий простір для HR-документації та інструментів компанії L-TEX — оптовий секонд-хенд (Луцьк, Україна).

## Business Context

Див. `BUSINESS_CONTEXT.md` для повного бізнес-контексту.

- **Компанія:** L-TEX (бренди Secondopt + Bricabrac)
- **Сфера:** Оптовий секонд-хенд та Bric-a-Brac
- **Сайти:** secondopt.com.ua, bricabrac.com.ua
- **Локація:** Піддубці, Луцький р-н, Волинська обл.

## Tech Stack

- **Документи (.docx):** Python + python-docx
- **Інтерактивні форми:** HTML/CSS/JS (vanilla, без фреймворків)
- **Мова контенту:** Українська (UI, документи, анкети)
- **Мова коду:** English (змінні, коментарі)

## Commands

```bash
# Встановлення залежностей
pip install python-docx

# Генерація .docx документів
python generate_doc.py

# Перегляд HTML-анкети — відкрити у браузері
# або через live-server
```

## Available Skills

Перед кожним завданням читай відповідний скіл з `skills/`:

| Скіл | Папка | Призначення |
|------|-------|-------------|
| skill-creator | `skills/skill-creator/` | Створення нових скілів |
| docx | `skills/docx/` | Генерація Word-документів (.docx) |
| frontend-design | `skills/frontend-design/` | HTML/CSS сторінки, форми, анкети |
| pdf | `skills/pdf/` | Створення та обробка PDF |
| hr-ltex | `skills/hr-ltex/` | HR-документи L-TEX (посадові інструкції, анкети, договори) |

## Current Tasks

1. Посадова інструкція менеджера з продажу (.docx)
2. Інтерактивна HTML-анкета для кандидатів
3. SEO оптимізація сайтів
4. AI агенти для автоматизації продажу

## Conventions

- Всі HR-документи генеруються програмно (python-docx), не вручну
- HTML-файли — standalone, без зовнішніх залежностей (CDN допускається для шрифтів/іконок)
- Документи оформлюються згідно українського діловодства
- Назви файлів: snake_case, латиницею (напр. `job_description_sales_manager.docx`)

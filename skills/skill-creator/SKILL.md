---
name: skill-creator
description: Create new skills, modify and improve existing skills. Use when user wants to create a skill from scratch, edit an existing skill, or capture a workflow as a reusable skill.
---

# Skill Creator

## What is a Skill?
A skill is a SKILL.md file that gives Claude persistent, reusable instructions for specific tasks.

## SKILL.md Structure

name: skill-name
description: "When to trigger + what it does. Be specific about trigger phrases."
Skill Title
Overview
What this skill does in 2-3 sentences.
Process / Steps
Step by step instructions...
Code Patterns (if applicable)
Code examples...
Rules & Constraints

Critical rules to always follow
Common mistakes to avoid

Output Format
What the final output looks like

## Creating a New Skill — Process

### Step 1: Understand Intent
Ask:
1. What should this skill enable Claude to do?
2. When should it trigger? (what phrases/contexts)
3. What's the expected output?

### Step 2: Write Draft SKILL.md
- Keep under 300 lines
- Focus on non-obvious instructions (don't state what Claude already knows)
- Include concrete code examples if technical
- Add L-TEX business context if relevant

### Step 3: Test
Run 2-3 test tasks using the skill. Evaluate:
- Does output match expectations?
- Is anything missing or wrong?

### Step 4: Iterate
Improve based on test results. Repeat until satisfied.

## Skill Description Tips (CRITICAL for triggering)
- Include BOTH what the skill does AND when to use it
- Be "pushy" — skills tend to undertrigger
- Include specific phrases that should trigger it
- Example: instead of "Creates HR documents", write:
  "Creates HR documents for L-TEX. Use whenever user mentions
   posadova instruktsiia, job description, anket, HR, staff,
   hiring, KPI for employees, or work regulations."

## File Location
Save skills to: D:\ltex-skills\skills\[skill-name]\SKILL.md

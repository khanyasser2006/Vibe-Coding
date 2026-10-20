# THIS REPO IS NOT FOR USE. THIS REPO WAS ONLY UPLOADED FOR TRIAL PURPOSES
# DPDP Form Auditor
### Swayambhu 2K26 — Vibe Coding Competition

**A browser-based tool for identifying personal data collection and potential data minimization issues in web forms.**

## 1. Overview

Web forms frequently request personal information such as names, email addresses, phone numbers, government identification numbers, and location details. However, not every field is necessary for the purpose for which a form is created.

DPDP Form Auditor helps website owners and developers review their forms, understand the types of personal data being collected, identify fields that may be unnecessary for the stated purpose, and generate a draft consent notice.

The application uses a deterministic, rule-based engine and is designed to analyze inputs locally in the browser without relying on an external AI service.

## 2. Problem Statement

Many forms collect more information than their stated purpose appears to require. Developers may overlook unnecessary fields, especially when field names use inconsistent abbreviations or unconventional naming conventions.

For example, a newsletter signup form may request an email address alongside a phone number, date of birth, Aadhaar number, and medical history.

The auditor helps identify such potential concerns and provides explanations that developers can review before deploying their forms.

## 3. Key Features

### Form Analysis
- Accepts pasted HTML form markup.
- Accepts field names through a separate input mode.
- Extracts field metadata such as names, IDs, labels, input types, and autocomplete attributes where available.

### Personal Data Classification
Classifies detected fields into categories such as:
- Identity
- Contact
- Financial
- Health
- Location
- Children's data
- Other relevant or uncertain categories

### Purpose-Aware Data Minimization
Compares detected fields with the declared collection purpose and assigns one of the following verdicts:

- **Needed:** Reasonably related to the stated purpose.
- **Potentially excess:** Not ordinarily necessary for the stated purpose under the implemented rules.
- **Review:** More context is required.
- **Not personal data:** The field is reasonably identified as non-personal data.

Each finding should include an explanation so that users can understand the reasoning.

### Rule-Based Screening Score
Provides a score from 0 to 100 based on the implemented screening rules. The accompanying explanation identifies relevant findings and limitations.

This is an indicative screening score, not an official legal compliance rating.

### Draft Consent Notice
Generates a draft notice describing the data collected and its purpose, with a mechanism for withdrawing consent represented using appropriate organization-specific details.

The application supports English, Marathi, and Hindi notice generation.

### Report and Results
Provides a structured results table, summary statistics, and report-related controls where implemented.

## 4. Technology Stack

- **React** — User interface and component-based architecture.
- **Vite** — Development server and build tooling.
- **Tailwind CSS** — Styling and responsive layouts.
- **JavaScript** — Rule-based classification, purpose matching, scoring, and notice generation.
- **DOMParser** — Browser-native parsing of pasted HTML as an inert document.
- **Browser APIs** — Support for client-side operations such as copying and downloading reports.

## 5. How to Run the Project

Ensure Node.js and npm are installed.

Clone or open the project directory, then run:

```bash
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

If dependencies have already been installed, the development server can usually be started directly with `npm run dev`.

## 6. How to Use the Application

1. Enter the declared collection purpose, such as `newsletter signup`, `job application`, or `online shopping checkout`.
2. Optionally provide the organization or data-collecting entity's name.
3. Choose **Paste HTML** to supply form markup or **Enter Field Names** to provide a list of fields.
4. Click **Analyze Form**.
5. Review the field classifications, categories, verdicts, and reasons.
6. Examine the screening score and its explanation.
7. Generate and review the draft consent notice.
8. Use the available language, copy, and report controls as required.

## 7. Demonstration Scenario

**Scenario: Newsletter Signup**

Declared purpose:

`newsletter signup`

Example field names:

```text
user_email
mob_no
dob
aadhaar_number
medical_history
gps_location
favorite_topics
```

Expected screening behavior:

- `user_email` would ordinarily be considered necessary for email newsletter delivery.
- `mob_no` may be unnecessary if the form only sends email newsletters.
- `dob`, `aadhaar_number`, `medical_history`, and `gps_location` would ordinarily be flagged as potentially excessive for this purpose.
- `favorite_topics` may be optional if used to personalize newsletter content.

These are illustrative expected outcomes. The actual results depend on the implemented rules and should be verified during the demonstration.

### Suggested Judge Demonstration

1. Load the messy form example or paste the field list.
2. Analyze the form and review the resulting field classifications.
3. Highlight the reasons for potentially excessive fields.
4. Change the purpose to another context, such as `job application`, and analyze it again.
5. Show how purpose-aware rules can produce different assessments.
6. Generate a draft consent notice and explain its intended use.

This demonstrates the complete workflow from form input to actionable screening findings.

## 8. Privacy by Design

The application is designed to perform its analysis entirely in the user's browser.

- No external AI service is required for classification.
- Pasted HTML is treated as input data, not executable application code.
- The tool does not need a backend server or remote database for its core analysis.
- Sensitive form content should not be persisted unnecessarily.

These design intentions should be verified against the running application and its network activity before making production privacy claims.

## 9. Limitations

DPDP Form Auditor is a screening and educational tool, not a complete legal compliance system.

- Rules may not capture every field name, synonym, or industry-specific context.
- Whether a field is necessary depends on the actual purpose and circumstances of processing.
- HTML inspection alone cannot establish how an organization uses, shares, or retains information.
- The screening score is based on application-defined heuristics and has no official legal status.
- Generated consent notices are drafts that require review and organization-specific information before use.

A finding of potential excess should be treated as a recommendation for review, not proof of a legal violation.

## 10. Project Objective

The objective is to make privacy-conscious form design easier to understand and apply during development.

By combining field classification, purpose-aware rules, explainable findings, and draft consent notices in a local browser application, DPDP Form Auditor helps developers identify potential data minimization issues earlier in the design process.

---

**Project:** DPDP Form Auditor  
**Event:** Swayambhu 2K26 — Vibe Coding  
**Core principle:** Collect thoughtfully. Explain clearly. Minimize unnecessary data.

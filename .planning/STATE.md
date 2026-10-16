# Project State: DPDP Form Auditor (Swayambhu 2K26)

**Current Phase:** Implementation & Verification Complete  
**Application Status:** Running live at http://127.0.0.1:5173  
**Vite Build:** Passed (dist created with zero errors)  
**Test Suite:** 30 / 30 Automated tests passed  

## Core Architecture
- **Classifier & Normalizer:** `src/engine/normalizer.js`, `src/engine/categories.js`, `src/engine/classifier.js`
- **Purpose Rules:** `src/engine/purposeRules.js` (Data Minimization & Proportionality under DPDP Sec 6)
- **Parser:** `src/engine/parser.js` (DOMParser inert parsing + field list parsing)
- **Scoring Engine:** `src/engine/scoring.js` (Deterministic explainable 0-100 score)
- **Consent Notice Engine:** `src/engine/noticeGenerator.js` (Multilingual English, Marathi, Hindi)
- **UI & UX:** `taste` and `ui-ux-pro-max` privacy-tech dark SaaS / clean slate aesthetic
- **Execution Script:** `run-app.bat`

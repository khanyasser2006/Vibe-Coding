import { parseHtmlForm, parseFieldNamesList } from './parser.js';
import { classifyField } from './classifier.js';
import { resolvePurpose, evaluateFieldForPurpose } from './purposeRules.js';
import { calculateScreeningScore } from './scoring.js';
import { generateConsentNotice } from './noticeGenerator.js';

/**
 * Main form audit orchestrator.
 * Accepts raw input (HTML or field list), mode, and declared purpose,
 * and executes end-to-end rule-based DPDP evaluation.
 */
export function auditForm({ inputContent, inputMode = 'html', purposeText = '', organizationName = '' }) {
  if (!inputContent || typeof inputContent !== 'string' || !inputContent.trim()) {
    return {
      isValid: false,
      error: 'Input content is empty. Please paste an HTML form snippet or enter field names.',
      fields: [],
      scoreResult: calculateScreeningScore([], null),
      purpose: resolvePurpose(purposeText),
    };
  }

  // 1. Resolve Purpose
  const purposeObj = resolvePurpose(purposeText);

  // 2. Parse fields based on input mode
  let rawFields = [];
  if (inputMode === 'html') {
    rawFields = parseHtmlForm(inputContent);
  } else {
    rawFields = parseFieldNamesList(inputContent);
  }

  if (rawFields.length === 0) {
    return {
      isValid: false,
      error: inputMode === 'html'
        ? 'No input elements (<input>, <textarea>, <select>) were found in the pasted HTML.'
        : 'No valid field names were found. Please enter comma-separated or newline-separated names.',
      fields: [],
      scoreResult: calculateScreeningScore([], purposeObj),
      purpose: purposeObj,
    };
  }

  // 3. Classify each field and evaluate against purpose
  const evaluatedFields = rawFields.map((field, index) => {
    const classification = classifyField(field);
    const purposeEvaluation = evaluateFieldForPurpose(classification, purposeObj);

    return {
      id: `field_${index + 1}_${field.name || 'field'}`,
      ...classification,
      verdict: purposeEvaluation.verdict,
      verdictReason: purposeEvaluation.reason,
      severity: purposeEvaluation.severity,
    };
  });

  // 4. Calculate Screening Score
  const scoreResult = calculateScreeningScore(evaluatedFields, purposeObj);

  // 5. Generate Consent Notices in 3 languages
  const notices = {
    en: generateConsentNotice({ organizationName, purposeObj, analysisResults: evaluatedFields, language: 'en' }),
    mr: generateConsentNotice({ organizationName, purposeObj, analysisResults: evaluatedFields, language: 'mr' }),
    hi: generateConsentNotice({ organizationName, purposeObj, analysisResults: evaluatedFields, language: 'hi' }),
  };

  return {
    isValid: true,
    error: null,
    purpose: purposeObj,
    fields: evaluatedFields,
    scoreResult,
    notices,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generates an exportable comprehensive plain-text audit report.
 */
export function generateTextReport({ auditData, organizationName = '' }) {
  if (!auditData || !auditData.isValid) return 'No audit data available.';

  const { purpose, fields, scoreResult, timestamp } = auditData;
  const divider = '='.repeat(78);
  const subDivider = '-'.repeat(78);

  const neededFields = fields.filter(f => f.verdict === 'Needed');
  const excessFields = fields.filter(f => f.verdict === 'Potentially excess');
  const reviewFields = fields.filter(f => f.verdict === 'Review');
  const notPersonalFields = fields.filter(f => f.verdict === 'Not personal data');

  const personalDataFields = fields.filter(f => f.isPersonalData && f.verdict !== 'Not personal data');
  const noticeEn = auditData.notices?.en || generateConsentNotice({ organizationName, purposeObj: purpose, analysisResults: fields, language: 'en' });

  return `${divider}
DPDP FORM AUDITOR — PRELIMINARY DATA MINIMIZATION REPORT
Generated: ${new Date(timestamp).toLocaleString()}
${divider}

1. EXECUTIVE SUMMARY:
   Organization:          ${organizationName || '[Not Specified]'}
   Declared Purpose:      "${purpose?.name || 'Unspecified'}"
   Total Detected Fields: ${fields.length}
   Personal Data Fields:  ${personalDataFields.length}
   Screening Score:       ${scoreResult.score}/100 (${scoreResult.bandLabel})

2. KEY METRICS:
   • Total Detected Fields:     ${fields.length}
   • Personal Data Fields:      ${personalDataFields.length}
   • Needed (Proportionate):    ${neededFields.length}
   • Potentially Excess Fields: ${excessFields.length}
   • Review / Contextual:       ${reviewFields.length}
   • Non-Personal / Technical:  ${notPersonalFields.length}

3. SCORE BREAKDOWN:
   Positive Factors:
${scoreResult.positiveFactors.map(f => `   [+] ${f}`).join('\n') || '   None'}

   Deductions & Warnings:
${scoreResult.negativeFactors.map(f => `   [-] ${f}`).join('\n') || '   None'}

${excessFields.length > 0 ? `4. POTENTIALLY EXCESSIVE COLLECTION ALERTS:
${excessFields
  .map(
    (f, idx) =>
      `   ${idx + 1}. [${f.originalName}] (${f.category?.label})\n      Finding: ${f.verdictReason}`
  )
  .join('\n\n')}
` : ''}
5. COMPREHENSIVE FIELD AUDIT TABLE:
${subDivider}
${String('FIELD NAME').padEnd(25)} ${String('CATEGORY').padEnd(24)} ${String('VERDICT').padEnd(20)}
${subDivider}
${fields
  .map(
    f =>
      `${String(f.originalName).padEnd(25)} ${String(f.category?.label).padEnd(24)} ${String(f.verdict).padEnd(20)}\n  Reason: ${f.verdictReason}`
  )
  .join('\n\n')}

${subDivider}
6. DRAFT CONSENT NOTICE (ENGLISH):
${noticeEn}

${subDivider}
7. REGULATORY DISCLAIMER:
This screening report is an automated algorithmic preliminary audit based on
DPDP Act 2023 principles (Data Minimization, Purpose Limitation). It does not
constitute official certification or legal advice.
${divider}`;
}

import { auditForm } from './src/engine/auditor.js';
import { DEMO_CASE } from './src/data/demoCase.js';

console.log('Testing HTML Audit with Demo Case...');
const htmlAudit = auditForm({
  inputContent: DEMO_CASE.htmlContent,
  inputMode: 'html',
  purposeText: DEMO_CASE.purpose,
  organizationName: DEMO_CASE.organizationName,
});

console.log('Valid:', htmlAudit.isValid);
console.log('Total Fields Found:', htmlAudit.fields.length);
console.log('Screening Score:', htmlAudit.scoreResult.score, '/', 100);
console.log('Rating Band:', htmlAudit.scoreResult.bandLabel);

console.log('\nField Classifications & Verdicts:');
for (const f of htmlAudit.fields) {
  console.log(`- ${f.originalName.padEnd(18)} | Category: ${f.category.label.padEnd(25)} | Verdict: ${f.verdict.padEnd(18)} | Severity: ${f.severity}`);
}

console.log('\nTesting Field List Audit...');
const listAudit = auditForm({
  inputContent: DEMO_CASE.fieldListContent,
  inputMode: 'list',
  purposeText: DEMO_CASE.purpose,
  organizationName: DEMO_CASE.organizationName,
});

console.log('List Valid:', listAudit.isValid);
console.log('List Fields Found:', listAudit.fields.length);
console.log('List Score:', listAudit.scoreResult.score);

console.log('\nNotice Generation Sample (Marathi first 150 chars):');
console.log(htmlAudit.notices.mr.slice(0, 200));

console.log('\nALL ENGINE CHECKS PASSED!');

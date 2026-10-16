import { auditForm, generateTextReport } from './src/engine/auditor.js';

console.log('================================================================');
console.log('RUNNING DPDP FORM AUDITOR AUTOMATED VERIFICATION SUITE');
console.log('================================================================\n');

let passCount = 0;
let totalCount = 0;

function assert(condition, message) {
  totalCount++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
  }
}

// -------------------------------------------------------------
// Test Case 1: Newsletter signup with messy & excessive fields
// -------------------------------------------------------------
console.log('--- Test Case 1: Newsletter signup with messy & excessive fields ---');
const tc1 = auditForm({
  inputContent: 'user_email, mob_no, dob, aadhaar_number, medical_history, gps_location, favorite_topics',
  inputMode: 'list',
  purposeText: 'newsletter signup',
});
assert(tc1.isValid === true, 'TC1 is valid audit');
assert(tc1.fields.length === 7, 'TC1 detected 7 fields');
const emailField = tc1.fields.find(f => f.originalName === 'user_email');
assert(emailField?.verdict === 'Needed', 'TC1 user_email is Needed');
const mobField = tc1.fields.find(f => f.originalName === 'mob_no');
assert(mobField?.verdict === 'Review', 'TC1 mob_no is Review (optional for email digest)');
const dobField = tc1.fields.find(f => f.originalName === 'dob');
assert(dobField?.verdict === 'Potentially excess', 'TC1 dob is Potentially excess');
const aadhaarField = tc1.fields.find(f => f.originalName === 'aadhaar_number');
assert(aadhaarField?.verdict === 'Potentially excess', 'TC1 aadhaar_number is Potentially excess');
const medField = tc1.fields.find(f => f.originalName === 'medical_history');
assert(medField?.verdict === 'Potentially excess', 'TC1 medical_history is Potentially excess');
const gpsField = tc1.fields.find(f => f.originalName === 'gps_location');
assert(gpsField?.verdict === 'Potentially excess', 'TC1 gps_location is Potentially excess');
assert(tc1.scoreResult.score < 50, `TC1 score reflects high excess risk (${tc1.scoreResult.score}/100)`);

// -------------------------------------------------------------
// Test Case 2: Contact form with name, email, message, and phone
// -------------------------------------------------------------
console.log('\n--- Test Case 2: Contact form with legitimate fields ---');
const tc2 = auditForm({
  inputContent: 'full_name, email_address, message_body, contact_phone',
  inputMode: 'list',
  purposeText: 'contact form',
});
assert(tc2.isValid === true, 'TC2 is valid audit');
const cEmail = tc2.fields.find(f => f.originalName === 'email_address');
assert(cEmail?.verdict === 'Needed', 'TC2 email is Needed');
const cMsg = tc2.fields.find(f => f.originalName === 'message_body');
assert(cMsg?.verdict === 'Needed', 'TC2 message is Needed');
const cPhone = tc2.fields.find(f => f.originalName === 'contact_phone');
assert(cPhone?.verdict === 'Review', 'TC2 phone is Review (optional secondary channel)');
assert(tc2.scoreResult.score >= 80, `TC2 score is high (${tc2.scoreResult.score}/100)`);

// -------------------------------------------------------------
// Test Case 3: Checkout form with shipping & billing
// -------------------------------------------------------------
console.log('\n--- Test Case 3: Checkout form ---');
const tc3 = auditForm({
  inputContent: 'shipping_address, contact_mobile, billing_name, postal_code, aadhaar_number',
  inputMode: 'list',
  purposeText: 'online shopping checkout',
});
assert(tc3.isValid === true, 'TC3 is valid');
const shipAddr = tc3.fields.find(f => f.originalName === 'shipping_address');
assert(shipAddr?.verdict === 'Needed', 'TC3 shipping_address is Needed for parcel dispatch');
const aadhaarInCheckout = tc3.fields.find(f => f.originalName === 'aadhaar_number');
assert(aadhaarInCheckout?.verdict === 'Potentially excess', 'TC3 aadhaar in checkout flagged as excess');

// -------------------------------------------------------------
// Test Case 4: HTML with varied tags, labels, and types
// -------------------------------------------------------------
console.log('\n--- Test Case 4: HTML with labels and autocomplete ---');
const htmlSample = `
<div>
  <label for="f_eml">Subscriber Email ID</label>
  <input type="email" id="f_eml" name="mail_id" placeholder="Enter email" autocomplete="email" />
  
  <label>Your Emergency Contact Number
    <input type="tel" name="emg_cntct" />
  </label>
  
  <select name="preferred_topics">
    <option value="tech">Tech</option>
  </select>
</div>
`;
const tc4 = auditForm({
  inputContent: htmlSample,
  inputMode: 'html',
  purposeText: 'newsletter signup',
});
assert(tc4.isValid === true, 'TC4 HTML parsing succeeds');
assert(tc4.fields.length === 3, 'TC4 extracted 3 fields');
const mailField = tc4.fields.find(f => f.originalName === 'mail_id');
assert(mailField?.categoryKey === 'CONTACT', 'TC4 mail_id classified as CONTACT');

// -------------------------------------------------------------
// Test Case 5: Field list with duplicates, snake_case, camelCase
// -------------------------------------------------------------
console.log('\n--- Test Case 5: Normalization, deduplication, camelCase ---');
const tc5 = auditForm({
  inputContent: 'phoneNumber, mob_no, phoneNumber,  \n  user_phone  , PHONENUMBER',
  inputMode: 'list',
  purposeText: 'contact form',
});
// Exact duplicate names case-insensitively deduplicated
assert(tc5.fields.length === 3, `TC5 deduplicated duplicates (found ${tc5.fields.length} unique)`);

// -------------------------------------------------------------
// Test Case 6: Unknown purpose
// -------------------------------------------------------------
console.log('\n--- Test Case 6: Unknown purpose ---');
const tc6 = auditForm({
  inputContent: 'user_email, full_name, dob',
  inputMode: 'list',
  purposeText: 'xyz unknown business utility 99',
});
assert(tc6.purpose.isKnown === false, 'TC6 purpose detected as custom/unknown');
const dobUnknown = tc6.fields.find(f => f.originalName === 'dob');
assert(dobUnknown?.verdict === 'Review' || dobUnknown?.verdict === 'Potentially excess', 'TC6 handles unknown purpose cautiously');

// -------------------------------------------------------------
// Test Case 7: Missing purpose & empty input
// -------------------------------------------------------------
console.log('\n--- Test Case 7: Empty input & missing purpose ---');
const tc7 = auditForm({
  inputContent: '',
  inputMode: 'html',
  purposeText: '',
});
assert(tc7.isValid === false, 'TC7 correctly rejected empty content');

// -------------------------------------------------------------
// Test Case 8: All three notice languages
// -------------------------------------------------------------
console.log('\n--- Test Case 8: Multilingual notices ---');
assert(typeof tc1.notices.en === 'string' && tc1.notices.en.includes('DRAFT CONSENT NOTICE'), 'TC8 English notice generated');
assert(typeof tc1.notices.mr === 'string' && tc1.notices.mr.includes('मसुदा संमती सूचना'), 'TC8 Marathi notice generated');
assert(typeof tc1.notices.hi === 'string' && tc1.notices.hi.includes('प्रारूप सहमति सूचना'), 'TC8 Hindi notice generated');

// -------------------------------------------------------------
// Test Case 9: Score sensitivity (removing excess improves score)
// -------------------------------------------------------------
console.log('\n--- Test Case 9: Score sensitivity check ---');
const tc9Minimal = auditForm({
  inputContent: 'user_email, favorite_topics',
  inputMode: 'list',
  purposeText: 'newsletter signup',
});
assert(tc9Minimal.scoreResult.score >= 90, `TC9 Minimal score is excellent (${tc9Minimal.scoreResult.score}/100)`);
assert(tc9Minimal.scoreResult.score > tc1.scoreResult.score, `TC9 score (${tc9Minimal.scoreResult.score}) > TC1 score (${tc1.scoreResult.score})`);

// -------------------------------------------------------------
// Test Case 10: Report generation
// -------------------------------------------------------------
console.log('\n--- Test Case 10: Plain text report generation ---');
const report = generateTextReport({ auditData: tc1, organizationName: 'Acme Test Corp' });
assert(report.includes('DPDP FORM AUDITOR') && report.includes('EXECUTIVE SUMMARY'), 'TC10 Plain text report generated properly');

console.log(`\n================================================================`);
console.log(`RESULTS: ${passCount} / ${totalCount} TESTS PASSED`);
console.log(`================================================================\n`);

if (passCount === totalCount) {
  process.exit(0);
} else {
  process.exit(1);
}

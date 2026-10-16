import { parseHtmlForm } from './src/engine/parser.js';
import { auditForm } from './src/engine/auditor.js';
import { DEMO_CASE } from './src/data/demoCase.js';

console.log('Testing parseHtmlForm with mock DOMParser in browser-like environment...');

// Mock browser DOMParser
class MockElement {
  constructor(tag, attrs = {}) {
    this.tagName = tag.toUpperCase();
    this.attrs = attrs;
  }
  getAttribute(name) {
    return this.attrs[name] || null;
  }
  closest() {
    return null;
  }
}

class MockDocument {
  constructor(html) {
    this.html = html;
  }
  querySelectorAll(selector) {
    // Return sample mock inputs
    return [
      new MockElement('input', { type: 'email', name: 'user_email', placeholder: 'name@domain.com', autocomplete: 'email' }),
      new MockElement('input', { type: 'tel', name: 'mob_no', placeholder: '9876543210' }),
      new MockElement('input', { type: 'text', name: 'aadhaar_number' }),
      new MockElement('textarea', { name: 'medical_history' }),
      new MockElement('input', { type: 'text', name: 'gps_location' }),
      new MockElement('input', { type: 'text', name: 'favorite_topics' }),
    ];
  }
  querySelector() {
    return null;
  }
}

class MockDOMParser {
  constructor() {
    this.instantiated = true;
  }
  parseFromString(str, type) {
    return new MockDocument(str);
  }
}

// Inject DOMParser into global scope to simulate browser environment
globalThis.DOMParser = MockDOMParser;

const fields = parseHtmlForm(DEMO_CASE.htmlContent);
console.log('Extracted fields count:', fields.length);
if (fields.length !== 6) {
  console.error('Expected 6 fields, got', fields.length);
  process.exit(1);
}

const audit = auditForm({
  inputContent: DEMO_CASE.htmlContent,
  inputMode: 'html',
  purposeText: 'newsletter signup',
});

console.log('Audit valid:', audit.isValid);
console.log('Audit score:', audit.scoreResult.score);
console.log('Audit fields:', audit.fields.map(f => `${f.originalName} -> ${f.verdict}`).join(', '));

if (!audit.isValid || audit.scoreResult.score === 0) {
  console.error('Audit failed!');
  process.exit(1);
}

console.log('ALL BROWSER DOMPARSER SIMULATION TESTS PASSED!');

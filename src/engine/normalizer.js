/**
 * Normalizes field names, labels, and placeholders to extract semantic tokens.
 * Handles camelCase, snake_case, kebab-case, dots, and common abbreviations.
 */

const ABBREVIATIONS = {
  dob: 'date of birth',
  bday: 'date of birth',
  bdate: 'date of birth',
  mob: 'mobile phone',
  mno: 'mobile number',
  ph: 'phone',
  tel: 'telephone',
  cntct: 'contact',
  no: 'number',
  num: 'number',
  nbr: 'number',
  mail: 'email',
  eml: 'email',
  addr: 'address',
  add: 'address',
  curr: 'current',
  perm: 'permanent',
  ac: 'account',
  acc: 'account',
  acct: 'account',
  ifsc: 'ifsc bank code',
  pan: 'pan income tax number',
  panno: 'pan number',
  aadhaar: 'aadhaar national id',
  aadhar: 'aadhaar national id',
  uidai: 'aadhaar uidai id',
  uid: 'unique id aadhaar',
  voter: 'voter identity card',
  epic: 'voter id epic number',
  loc: 'location',
  gps: 'gps precise coordinates',
  lat: 'latitude location',
  lng: 'longitude location',
  lon: 'longitude location',
  coord: 'coordinates location',
  geo: 'geolocation location',
  fname: 'first name',
  lname: 'last name',
  mname: 'middle name',
  pwd: 'password',
  pass: 'password',
  emg: 'emergency',
  emer: 'emergency',
  alt: 'alternate',
  msg: 'message',
  pref: 'preference',
  fav: 'favorite',
  qual: 'qualification',
  edu: 'education',
  exp: 'experience',
  med: 'medical health',
  hist: 'history',
  diag: 'diagnosis medical',
  rx: 'prescription medication',
  bg: 'blood group',
  bgroup: 'blood group',
  comm: 'communication',
  org: 'organization',
  dept: 'department',
  desig: 'designation',
  sal: 'salary financial',
  inc: 'income financial',
  chkout: 'checkout',
  ship: 'shipping delivery',
  deliv: 'delivery',
  bill: 'billing',
};

export function normalizeFieldName(rawName) {
  if (!rawName || typeof rawName !== 'string') return '';

  let cleaned = rawName.trim();

  // 1. Expand camelCase (e.g. phoneNumber -> phone Number, birthDate -> birth Date)
  cleaned = cleaned.replace(/([a-z0-9])([A-Z])/g, '$1 $2');

  // 2. Replace separators (snake_case, kebab-case, dots, brackets) with spaces
  cleaned = cleaned.replace(/[_.\-\[\]\/\\:]+/g, ' ');

  // 3. Lowercase
  cleaned = cleaned.toLowerCase();

  // 4. Split into words and expand known abbreviations
  const words = cleaned.split(/\s+/).filter(Boolean);
  const expandedWords = words.map(word => ABBREVIATIONS[word] || word);

  return expandedWords.join(' ').trim();
}

/**
 * Extracts all signals from an HTML element or raw field definition.
 */
export function extractSignals(fieldData) {
  const { name = '', id = '', label = '', placeholder = '', type = '', autocomplete = '' } = fieldData;

  const combinedNormalized = [
    normalizeFieldName(name),
    normalizeFieldName(id),
    normalizeFieldName(label),
    normalizeFieldName(placeholder),
    autocomplete ? autocomplete.toLowerCase() : '',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    rawName: name || id || label || 'unnamed_field',
    name,
    id,
    label,
    placeholder,
    type: (type || 'text').toLowerCase(),
    autocomplete: (autocomplete || '').toLowerCase(),
    normalizedString: combinedNormalized,
    tokens: Array.from(new Set(combinedNormalized.split(/\s+/).filter(Boolean))),
  };
}

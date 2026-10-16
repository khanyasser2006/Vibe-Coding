import { extractSignals } from './normalizer.js';
import { CATEGORIES, CATEGORY_PATTERNS } from './categories.js';

/**
 * Classifies a single form field into its semantic personal data category.
 * Conservative principle: Unknown fields are categorized as UNKNOWN and flagged for review,
 * never presumed non-personal without explicit signal evidence.
 */
export function classifyField(fieldInput) {
  // If passed a simple string, convert to object
  const fieldData = typeof fieldInput === 'string'
    ? { name: fieldInput }
    : fieldInput;

  const signals = extractSignals(fieldData);
  const { rawName, name, id, label, placeholder, type, autocomplete, normalizedString, tokens } = signals;

  // 1. Check exact names against patterns
  for (const pattern of CATEGORY_PATTERNS) {
    if (pattern.exactNames) {
      for (const exact of pattern.exactNames) {
        const exactNorm = exact.toLowerCase();
        if (
          name.toLowerCase() === exactNorm ||
          id.toLowerCase() === exactNorm ||
          rawName.toLowerCase() === exactNorm
        ) {
          const cat = CATEGORIES[pattern.category];
          return {
            originalName: rawName,
            normalizedName: normalizedString,
            categoryKey: pattern.category,
            category: cat,
            isPersonalData: cat.isPersonalData,
            confidence: 'HIGH',
            reason: pattern.reason,
            signals,
          };
        }
      }
    }
  }

  // 2. Check HTML autocomplete tokens
  if (autocomplete) {
    for (const pattern of CATEGORY_PATTERNS) {
      if (pattern.autocompleteTokens && pattern.autocompleteTokens.includes(autocomplete)) {
        const cat = CATEGORIES[pattern.category];
        return {
          originalName: rawName,
          normalizedName: normalizedString,
          categoryKey: pattern.category,
          category: cat,
          isPersonalData: cat.isPersonalData,
          confidence: 'HIGH',
          reason: `Matched standard HTML autocomplete token "${autocomplete}". ${pattern.reason}`,
          signals,
        };
      }
    }
  }

  // 3. Check HTML input types where definitive (e.g. type="email", type="tel", type="password")
  if (type === 'email') {
    const cat = CATEGORIES.CONTACT;
    return {
      originalName: rawName,
      normalizedName: normalizedString,
      categoryKey: 'CONTACT',
      category: cat,
      isPersonalData: true,
      confidence: 'HIGH',
      reason: 'HTML input type="email" designates an electronic mail contact channel.',
      signals,
    };
  }

  if (type === 'tel') {
    const cat = CATEGORIES.CONTACT;
    return {
      originalName: rawName,
      normalizedName: normalizedString,
      categoryKey: 'CONTACT',
      category: cat,
      isPersonalData: true,
      confidence: 'HIGH',
      reason: 'HTML input type="tel" designates a telephonic/mobile contact number.',
      signals,
    };
  }

  if (type === 'password') {
    const cat = CATEGORIES.AUTH;
    return {
      originalName: rawName,
      normalizedName: normalizedString,
      categoryKey: 'AUTH',
      category: cat,
      isPersonalData: true,
      confidence: 'HIGH',
      reason: 'HTML input type="password" captures an authentication credential.',
      signals,
    };
  }

  // 4. Keyword and Token Substring Matching
  for (const pattern of CATEGORY_PATTERNS) {
    for (const kw of pattern.keywords) {
      const kwNorm = kw.toLowerCase();
      // Test either exact token or whole-phrase match in normalized string
      if (
        tokens.includes(kwNorm) ||
        normalizedString.includes(kwNorm) ||
        (kwNorm.includes(' ') && normalizedString.includes(kwNorm))
      ) {
        const cat = CATEGORIES[pattern.category];
        return {
          originalName: rawName,
          normalizedName: normalizedString,
          categoryKey: pattern.category,
          category: cat,
          isPersonalData: cat.isPersonalData,
          confidence: pattern.confidence,
          reason: `Matched keyword "${kw}". ${pattern.reason}`,
          signals,
        };
      }
    }
  }

  // 5. Ambiguous HTML types (e.g. type="date" without a label/name)
  if (type === 'date') {
    const cat = CATEGORIES.IDENTITY;
    return {
      originalName: rawName,
      normalizedName: normalizedString || 'calendar_date',
      categoryKey: 'IDENTITY',
      category: cat,
      isPersonalData: true,
      confidence: 'MEDIUM',
      reason: 'HTML input type="date" detected. Typically associated with Date of Birth or appointment date.',
      signals,
    };
  }

  // 6. Unknown / Unclassified
  // Under DPDP Act, unfamiliar fields should NOT be presumed non-personal.
  return {
    originalName: rawName,
    normalizedName: normalizedString || rawName,
    categoryKey: 'UNKNOWN',
    category: CATEGORIES.UNKNOWN,
    isPersonalData: true, // conservative stance: unknown data requires review
    confidence: 'LOW',
    reason: 'Field could not be matched against standard personal data dictionaries. Requires manual data governance review.',
    signals,
  };
}

/**
 * Classifies an array of fields.
 */
export function classifyAllFields(fields) {
  return fields.map(classifyField);
}

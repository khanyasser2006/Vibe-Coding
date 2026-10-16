/**
 * Safe, browser-native parser for HTML forms and raw field-name lists.
 * Uses inert DOMParser - never executes or inserts pasted markup into the live document.
 */

/**
 * Parses raw text containing field names separated by commas, newlines, semicolons, or tabs.
 */
export function parseFieldNamesList(rawText) {
  if (!rawText || typeof rawText !== 'string') return [];

  // Split on commas, newlines, semicolons
  const lines = rawText.split(/[\r\n,;]+/);
  const seen = new Set();
  const fields = [];

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Deduplicate case-insensitively
    const lower = trimmed.toLowerCase();
    if (seen.has(lower)) continue;
    seen.add(lower);

    fields.push({
      name: trimmed,
      id: trimmed,
      label: trimmed,
      placeholder: '',
      type: 'text',
      autocomplete: '',
      source: 'field_list',
    });
  }

  return fields;
}

/**
 * Parses an HTML form snippet safely using the browser-native DOMParser.
 */
export function parseHtmlForm(htmlString) {
  if (!htmlString || typeof htmlString !== 'string') return [];

  const trimmed = htmlString.trim();
  if (!trimmed) return [];

  if (typeof DOMParser === 'undefined') {
    // Regex fallback for non-browser / test environments
    const inputMatches = trimmed.matchAll(/<(input|select|textarea)([^>]*)>/gi);
    const fields = [];
    const seen = new Set();
    for (const match of inputMatches) {
      const tag = match[1].toLowerCase();
      const attrs = match[2];
      const getAttr = (name) => {
        const m = attrs.match(new RegExp(`${name}=["']([^"']*)["']`, 'i'));
        return m ? m[1] : '';
      };
      const name = getAttr('name');
      const id = getAttr('id');
      const placeholder = getAttr('placeholder');
      const type = getAttr('type') || (tag === 'textarea' ? 'textarea' : tag === 'select' ? 'select' : 'text');
      const autocomplete = getAttr('autocomplete');
      if (type === 'submit' || type === 'reset') continue;
      const identifier = name || id || `field_${fields.length + 1}`;
      if (seen.has(identifier.toLowerCase())) continue;
      seen.add(identifier.toLowerCase());
      fields.push({
        name: identifier,
        id,
        label: identifier,
        placeholder,
        type: type.toLowerCase(),
        autocomplete: autocomplete.toLowerCase(),
        source: 'html_parser_fallback',
      });
    }
    return fields;
  }

  // Create an isolated, inert DOM document in browser
  const parser = new DOMParser();
  const doc = parser.parseFromString(trimmed, 'text/html');

  // Query all form controls: input, select, textarea
  const elements = doc.querySelectorAll('input, select, textarea');
  const fields = [];
  const seen = new Set();

  elements.forEach((el, index) => {
    const tagName = el.tagName.toLowerCase();
    const type = (el.getAttribute('type') || (tagName === 'textarea' ? 'textarea' : tagName === 'select' ? 'select' : 'text')).toLowerCase();
    const name = (el.getAttribute('name') || '').trim();
    const id = (el.getAttribute('id') || '').trim();
    const placeholder = (el.getAttribute('placeholder') || '').trim();
    const autocomplete = (el.getAttribute('autocomplete') || '').trim();
    const ariaLabel = (el.getAttribute('aria-label') || '').trim();

    // Skip submit and reset buttons if they don't carry personal data
    if (type === 'submit' || type === 'reset') return;

    // Resolve associated label:
    // 1. label[for="id"]
    // 2. Enclosing <label> parent
    // 3. aria-label or placeholder
    let labelText = ariaLabel || placeholder;

    if (id) {
      const explicitLabel = doc.querySelector(`label[for="${CSS.escape ? CSS.escape(id) : id}"]`);
      if (explicitLabel && explicitLabel.textContent) {
        labelText = explicitLabel.textContent.trim();
      }
    }

    if (!labelText) {
      const parentLabel = el.closest('label');
      if (parentLabel && parentLabel.textContent) {
        // Strip text of the input itself
        labelText = parentLabel.textContent.replace(el.value || '', '').trim();
      }
    }

    // Determine representative field identifier
    const identifier = name || id || labelText || `field_${index + 1}`;
    const dedupeKey = `${identifier.toLowerCase()}|${type}`;

    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);

    fields.push({
      name: name || identifier,
      id: id || '',
      label: labelText || '',
      placeholder,
      type,
      autocomplete,
      source: 'html_parser',
    });
  });

  return fields;
}

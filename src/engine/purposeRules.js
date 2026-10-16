/**
 * Purpose-Aware Excess Collection Rules Engine.
 * Evaluates classified fields against stated business purposes according to
 * the DPDP Act 2023 principles: Data Minimization, Proportionality, and Purpose Limitation.
 */

export const KNOWN_PURPOSES = [
  {
    id: 'newsletter',
    name: 'Newsletter Signup',
    synonyms: ['newsletter', 'newsletter signup', 'email subscription', 'subscribe', 'blog updates', 'mailing list'],
    description: 'Sending periodic email digests, updates, or educational articles.',
  },
  {
    id: 'contact_form',
    name: 'Contact Form',
    synonyms: ['contact', 'contact form', 'contact us', 'enquiry', 'inquiry', 'reach out', 'support request'],
    description: 'Responding to customer queries, support tickets, or sales inquiries.',
  },
  {
    id: 'account_registration',
    name: 'Account Registration',
    synonyms: ['account', 'account registration', 'signup', 'register', 'create account', 'user registration'],
    description: 'Creating an authenticated customer profile or membership account.',
  },
  {
    id: 'login',
    name: 'Login / Authentication',
    synonyms: ['login', 'sign in', 'authenticate', 'user login', 'log in', 'access account'],
    description: 'Authenticating an existing user into their account.',
  },
  {
    id: 'checkout',
    name: 'Online Shopping Checkout',
    synonyms: ['checkout', 'online checkout', 'shopping checkout', 'e-commerce purchase', 'buy online', 'order placement'],
    description: 'Fulfilling physical merchandise orders, processing payment, and shipping parcels.',
  },
  {
    id: 'delivery',
    name: 'Delivery Information',
    synonyms: ['delivery', 'delivery information', 'shipping details', 'dispatch', 'courier delivery', 'parcel tracking'],
    description: 'Shipping goods, parcels, or physical documents to a recipient.',
  },
  {
    id: 'job_application',
    name: 'Job Application',
    synonyms: ['job application', 'career', 'job', 'employment', 'hiring', 'recruitment', 'work with us', 'apply for job'],
    description: 'Screening and evaluating candidate qualifications for employment.',
  },
  {
    id: 'student_registration',
    name: 'Student Registration',
    synonyms: ['student registration', 'school admission', 'college admission', 'course enrollment', 'education signup'],
    description: 'Enrolling a student or participant in an educational course, school, or university.',
  },
  {
    id: 'event_registration',
    name: 'Event Registration',
    synonyms: ['event registration', 'webinar', 'conference', 'workshop', 'seminar registration', 'ticket booking'],
    description: 'Reserving access passes or tickets for a conference, webinar, or public gathering.',
  },
  {
    id: 'customer_feedback',
    name: 'Customer Feedback',
    synonyms: ['customer feedback', 'survey', 'feedback', 'user review', 'nps', 'satisfaction survey'],
    description: 'Gathering qualitative feedback, ratings, and customer satisfaction metrics.',
  },
  {
    id: 'appointment_booking',
    name: 'Appointment Booking',
    synonyms: ['appointment booking', 'appointment', 'consultation', 'doctor appointment', 'service booking', 'schedule meeting'],
    description: 'Scheduling an in-person or virtual consultation with a professional.',
  },
  {
    id: 'general_submission',
    name: 'General Form Submission',
    synonyms: ['general', 'general form', 'submission', 'form submission', 'default'],
    description: 'Unspecified or general data capture form.',
  },
];

export function resolvePurpose(purposeInput) {
  if (!purposeInput || typeof purposeInput !== 'string') {
    return {
      id: 'unknown',
      name: 'Unspecified Purpose',
      userPurpose: 'Unspecified Purpose',
      isKnown: false,
    };
  }

  const trimmed = purposeInput.trim();
  const cleaned = trimmed.toLowerCase();

  // 1. Check exact matches
  for (const purpose of KNOWN_PURPOSES) {
    if (purpose.id === cleaned || purpose.name.toLowerCase() === cleaned) {
      return {
        ...purpose,
        name: trimmed,
        userPurpose: trimmed,
        matchedCategory: purpose.name,
        isKnown: true,
      };
    }
  }

  // 2. Check synonym and substring matches
  for (const purpose of KNOWN_PURPOSES) {
    for (const syn of purpose.synonyms) {
      if (cleaned === syn || cleaned.includes(syn) || syn.includes(cleaned)) {
        return {
          ...purpose,
          name: trimmed,
          userPurpose: trimmed,
          matchedCategory: purpose.name,
          isKnown: true,
        };
      }
    }
  }

  // 3. User-defined custom purpose
  return {
    id: 'custom',
    name: trimmed,
    userPurpose: trimmed,
    matchedCategory: 'Custom Purpose',
    description: `User-defined purpose: "${trimmed}". Evaluated using conservative data minimization heuristics.`,
    isKnown: false,
  };
}

/**
 * Evaluates a single classified field against the resolved purpose.
 * Returns: { verdict: 'Needed' | 'Potentially excess' | 'Review' | 'Not personal data', reason: string, severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE' }
 */
export function evaluateFieldForPurpose(classifiedField, purposeObj) {
  const { categoryKey, isPersonalData, signals, originalName } = classifiedField;
  const tokens = signals?.tokens || [];
  const normalizedStr = signals?.normalizedString || '';

  // 1. Non-personal operational fields (CSRF, submit buttons, etc.)
  if (categoryKey === 'OPERATIONAL' || (!isPersonalData && categoryKey !== 'PREFERENCES')) {
    return {
      verdict: 'Not personal data',
      severity: 'NONE',
      reason: 'Technical or non-personal form element (e.g., CSRF token, submit action) outside the regulatory scope of DPDP personal data.',
    };
  }

  // 2. If purpose is unknown or empty -> Conservative review for all personal data
  if (!purposeObj || purposeObj.id === 'unknown') {
    return {
      verdict: 'Review',
      severity: 'MEDIUM',
      reason: 'No specific purpose provided. Under DPDP Act Section 6, consent is only valid for specified, lawful purposes. Define the purpose to evaluate necessity.',
    };
  }

  const pid = purposeObj.id;

  // -------------------------------------------------------------
  // SPECIFIC PURPOSE MATRIX
  // -------------------------------------------------------------

  // --- A. Newsletter Signup ---
  if (pid === 'newsletter') {
    if (tokens.includes('email') || tokens.includes('mail') || categoryKey === 'CONTACT' && normalizedStr.includes('email')) {
      return {
        verdict: 'Needed',
        severity: 'NONE',
        reason: 'Email address is directly necessary to transmit the requested newsletter issues.',
      };
    }
    if (categoryKey === 'PREFERENCES' || normalizedStr.includes('topic') || normalizedStr.includes('interest')) {
      return {
        verdict: 'Needed',
        severity: 'NONE',
        reason: 'Topic preferences allow subscriber customization for relevant content delivery.',
      };
    }
    if (normalizedStr.includes('first name') || normalizedStr.includes('fname') || normalizedStr.includes('name') && !normalizedStr.includes('father')) {
      return {
        verdict: 'Review',
        severity: 'LOW',
        reason: 'First name is optional. Helpful for email salutation personalization, but not strictly mandatory to dispatch a newsletter.',
      };
    }
    if (tokens.includes('mobile') || tokens.includes('phone') || tokens.includes('tel')) {
      return {
        verdict: 'Review',
        severity: 'MEDIUM',
        reason: 'Mobile number is generally excessive for email newsletters unless SMS-based dispatch was explicitly requested.',
      };
    }
    if (categoryKey === 'IDENTITY' && (normalizedStr.includes('aadhaar') || normalizedStr.includes('pan') || normalizedStr.includes('passport') || normalizedStr.includes('dob') || normalizedStr.includes('birth'))) {
      return {
        verdict: 'Potentially excess',
        severity: 'HIGH',
        reason: 'Government identification (Aadhaar/PAN) or Date of Birth is disproportionate and unnecessary for a newsletter subscription under DPDP Section 6.',
      };
    }
    if (categoryKey === 'HEALTH') {
      return {
        verdict: 'Potentially excess',
        severity: 'HIGH',
        reason: 'Medical history and health information are sensitive and completely disproportionate to an informational newsletter signup.',
      };
    }
    if (categoryKey === 'FINANCIAL') {
      return {
        verdict: 'Potentially excess',
        severity: 'HIGH',
        reason: 'Bank account and payment details are unnecessary for a free newsletter. Paid newsletters should process subscriptions through an external gateway.',
      };
    }
    if (categoryKey === 'LOCATION') {
      return {
        verdict: 'Potentially excess',
        severity: 'HIGH',
        reason: 'Precise GPS geolocation coordinates are intrusive and unrelated to delivering digital newsletter publications.',
      };
    }
    if (categoryKey === 'CHILDREN') {
      return {
        verdict: 'Potentially excess',
        severity: 'HIGH',
        reason: "Collecting minors' data requires verifiable parental consent under DPDP Section 9; unnecessary for general newsletter delivery.",
      };
    }
  }

  // --- B. Contact Form ---
  if (pid === 'contact_form') {
    if (normalizedStr.includes('name') || normalizedStr.includes('email') || normalizedStr.includes('message') || normalizedStr.includes('query') || categoryKey === 'PREFERENCES') {
      return {
        verdict: 'Needed',
        severity: 'NONE',
        reason: 'Name, email, and inquiry message are essential to understand the request and reply to the sender.',
      };
    }
    if (tokens.includes('phone') || tokens.includes('mobile')) {
      return {
        verdict: 'Review',
        severity: 'LOW',
        reason: 'Phone number provides an alternative callback channel, but should remain optional if email is supplied.',
      };
    }
    if (categoryKey === 'IDENTITY' && (normalizedStr.includes('aadhaar') || normalizedStr.includes('pan') || normalizedStr.includes('dob'))) {
      return {
        verdict: 'Potentially excess',
        severity: 'HIGH',
        reason: 'National ID numbers and Date of Birth are excessive for general website inquiries.',
      };
    }
    if (categoryKey === 'FINANCIAL' || categoryKey === 'HEALTH' || categoryKey === 'LOCATION') {
      return {
        verdict: 'Potentially excess',
        severity: 'HIGH',
        reason: `${classifiedField.category.label} is disproportionate for an initial contact/inquiry form.`,
      };
    }
  }

  // --- C. Online Checkout / Shopping ---
  if (pid === 'checkout' || pid === 'delivery') {
    if (normalizedStr.includes('name') || normalizedStr.includes('address') || normalizedStr.includes('pincode') || normalizedStr.includes('city') || normalizedStr.includes('phone') || normalizedStr.includes('mobile') || normalizedStr.includes('email')) {
      return {
        verdict: 'Needed',
        severity: 'NONE',
        reason: 'Recipient name, physical delivery address, contact mobile, and email are strictly needed for courier logistics and order dispatch.',
      };
    }
    if (categoryKey === 'FINANCIAL') {
      if (normalizedStr.includes('card number') || normalizedStr.includes('cvv')) {
        return {
          verdict: 'Review',
          severity: 'MEDIUM',
          reason: 'Raw card details should be handled via PCI-DSS compliant payment gateway tokenization rather than collected directly into form fields.',
        };
      }
      return {
        verdict: 'Needed',
        severity: 'NONE',
        reason: 'Payment transaction references are necessary to settle commercial e-commerce transactions.',
      };
    }
    if (categoryKey === 'IDENTITY' && (normalizedStr.includes('aadhaar') || normalizedStr.includes('dob'))) {
      return {
        verdict: 'Potentially excess',
        severity: 'HIGH',
        reason: 'Aadhaar or Date of Birth is unnecessary for standard retail merchandise delivery.',
      };
    }
    if (categoryKey === 'HEALTH') {
      return {
        verdict: 'Potentially excess',
        severity: 'HIGH',
        reason: 'Medical history is excessive for standard retail purchases unless purchasing specialized prescription pharmaceutical goods.',
      };
    }
  }

  // --- D. Job Application ---
  if (pid === 'job_application') {
    if (normalizedStr.includes('name') || normalizedStr.includes('email') || normalizedStr.includes('phone') || categoryKey === 'EMPLOYMENT_EDUCATION' || normalizedStr.includes('resume') || normalizedStr.includes('cv') || normalizedStr.includes('city')) {
      return {
        verdict: 'Needed',
        severity: 'NONE',
        reason: 'Candidate name, contact channels, CV/resume, and professional credentials are valid for hiring assessment.',
      };
    }
    if (categoryKey === 'IDENTITY' && normalizedStr.includes('pan')) {
      return {
        verdict: 'Review',
        severity: 'LOW',
        reason: 'PAN may be required for tax compliance upon hiring, but is typically premature at the initial application stage.',
      };
    }
    if (categoryKey === 'IDENTITY' && (normalizedStr.includes('aadhaar') || normalizedStr.includes('passport'))) {
      return {
        verdict: 'Review',
        severity: 'MEDIUM',
        reason: 'Government identification is typically collected post-selection during background verification, not in a public application form.',
      };
    }
    if (categoryKey === 'FINANCIAL' && (normalizedStr.includes('bank') || normalizedStr.includes('account') || normalizedStr.includes('ifsc'))) {
      return {
        verdict: 'Potentially excess',
        severity: 'HIGH',
        reason: 'Bank account and IFSC details are excessive at the initial recruitment stage. Required only post-hire for salary payroll processing.',
      };
    }
    if (categoryKey === 'HEALTH' || categoryKey === 'LOCATION') {
      return {
        verdict: 'Potentially excess',
        severity: 'HIGH',
        reason: 'Detailed medical history or live GPS tracking is disproportionate for candidate evaluation.',
      };
    }
  }

  // --- E. Appointment Booking ---
  if (pid === 'appointment_booking') {
    if (normalizedStr.includes('name') || normalizedStr.includes('email') || normalizedStr.includes('phone') || normalizedStr.includes('date') || normalizedStr.includes('time')) {
      return {
        verdict: 'Needed',
        severity: 'NONE',
        reason: 'Booking party name, contact channels, and appointment schedule date/time are essential to coordinate the slot.',
      };
    }
    if (categoryKey === 'HEALTH') {
      return {
        verdict: 'Review',
        severity: 'MEDIUM',
        reason: 'Health information is appropriate only if booking a specialized clinical/medical consultation. Excessive for non-medical services.',
      };
    }
    if (categoryKey === 'IDENTITY' && (normalizedStr.includes('aadhaar') || normalizedStr.includes('pan'))) {
      return {
        verdict: 'Potentially excess',
        severity: 'HIGH',
        reason: 'National identity numbers are generally excessive for general appointment reservations.',
      };
    }
  }

  // --- F. Account Registration & Login ---
  if (pid === 'account_registration' || pid === 'login') {
    if (categoryKey === 'AUTH' || normalizedStr.includes('email') || normalizedStr.includes('username') || normalizedStr.includes('name')) {
      return {
        verdict: 'Needed',
        severity: 'NONE',
        reason: 'Username, email, and authentication credentials are required to establish and access a secure user profile.',
      };
    }
    if (categoryKey === 'IDENTITY' && (normalizedStr.includes('aadhaar') || normalizedStr.includes('pan'))) {
      return {
        verdict: 'Potentially excess',
        severity: 'HIGH',
        reason: 'Collecting national ID credentials for general account creation violates DPDP data minimization unless required by statutory KYC regulations.',
      };
    }
    if (categoryKey === 'HEALTH' || categoryKey === 'LOCATION') {
      return {
        verdict: 'Potentially excess',
        severity: 'HIGH',
        reason: `${classifiedField.category.label} is excessive for basic platform profile registration.`,
      };
    }
  }

  // -------------------------------------------------------------
  // FALLBACK / GENERAL / CUSTOM PURPOSE HEURISTICS
  // -------------------------------------------------------------

  // High-risk categories in general contexts
  if (categoryKey === 'CHILDREN') {
    return {
      verdict: 'Potentially excess',
      severity: 'HIGH',
      reason: "Processing of children's data imposes strict statutory duties under DPDP Act Section 9. Requires verifiable parental consent and justified necessity.",
    };
  }

  if (categoryKey === 'HEALTH') {
    return {
      verdict: 'Potentially excess',
      severity: 'HIGH',
      reason: 'Health and medical records are highly sensitive personal data. Collection without a specific medical care context violates data minimization.',
    };
  }

  if (categoryKey === 'LOCATION' && (normalizedStr.includes('gps') || normalizedStr.includes('coord') || normalizedStr.includes('precise'))) {
    return {
      verdict: 'Potentially excess',
      severity: 'HIGH',
      reason: 'Precise GPS telemetry tracking is disproportionate unless the declared service fundamentally depends on real-time navigation or geofencing.',
    };
  }

  if (categoryKey === 'FINANCIAL' && (normalizedStr.includes('bank') || normalizedStr.includes('account') || normalizedStr.includes('card'))) {
    return {
      verdict: 'Review',
      severity: 'MEDIUM',
      reason: 'Financial account collection should be reviewed to confirm whether payment processing or statutory KYC mandates this data.',
    };
  }

  if (categoryKey === 'IDENTITY' && (normalizedStr.includes('aadhaar') || normalizedStr.includes('pan'))) {
    return {
      verdict: 'Potentially excess',
      severity: 'HIGH',
      reason: 'Aadhaar or PAN collection without a specific legal obligation (e.g. Income Tax Act or PMLA) violates DPDP Section 6 minimization principles.',
    };
  }

  if (categoryKey === 'UNKNOWN') {
    return {
      verdict: 'Review',
      severity: 'LOW',
      reason: 'Ambiguous field name. Audit data governance inventory to document exact data elements and lawful purpose.',
    };
  }

  // Default conservative verdict for other personal data
  return {
    verdict: 'Review',
    severity: 'LOW',
    reason: `Field "${originalName}" is classified as ${classifiedField.category.label}. Confirm whether this specific item is strictly necessary for "${purposeObj.name}".`,
  };
}

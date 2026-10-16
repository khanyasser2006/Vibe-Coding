/**
 * Categorization definitions for personal data according to DPDP Act 2023 principles.
 */

export const CATEGORIES = {
  CHILDREN: {
    id: 'CHILDREN',
    label: "Children's Data",
    description: "Personal data relating to minors/children. DPDP Section 9 imposes strict parental consent obligations.",
    isPersonalData: true,
    sensitivity: 'CRITICAL',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  HEALTH: {
    id: 'HEALTH',
    label: 'Health & Medical Data',
    description: 'Medical history, diagnosis, physical/mental health condition, prescription, or biometric information.',
    isPersonalData: true,
    sensitivity: 'CRITICAL',
    badgeClass: 'bg-red-100 text-red-800 border-red-200',
  },
  FINANCIAL: {
    id: 'FINANCIAL',
    label: 'Financial Information',
    description: 'Bank account, IFSC, UPI VPA, card numbers, salary, tax, or payment credentials.',
    isPersonalData: true,
    sensitivity: 'HIGH',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  IDENTITY: {
    id: 'IDENTITY',
    label: 'Government & Personal Identity',
    description: 'Official IDs (Aadhaar, PAN, Passport), full name, date of birth, age, photo, and official records.',
    isPersonalData: true,
    sensitivity: 'HIGH',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  LOCATION: {
    id: 'LOCATION',
    label: 'Precise Location Data',
    description: 'GPS coordinates, precise geolocation, live tracking coordinates, or physical latitude/longitude.',
    isPersonalData: true,
    sensitivity: 'HIGH',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  CONTACT: {
    id: 'CONTACT',
    label: 'Contact Information',
    description: 'Email address, phone number, mobile, delivery address, postal PIN code, and communication channels.',
    isPersonalData: true,
    sensitivity: 'MEDIUM',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-200',
  },
  AUTH: {
    id: 'AUTH',
    label: 'Authentication & Security',
    description: 'Passwords, PINs, OTP codes, and security credentials used for user verification.',
    isPersonalData: true,
    sensitivity: 'HIGH',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  EMPLOYMENT_EDUCATION: {
    id: 'EMPLOYMENT_EDUCATION',
    label: 'Education & Employment',
    description: 'Resumes, degrees, work history, employer details, certifications, and educational records.',
    isPersonalData: true,
    sensitivity: 'LOW',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  PREFERENCES: {
    id: 'PREFERENCES',
    label: 'Preferences & Feedback',
    description: 'Interests, survey ratings, feedback text, content categories, or user interface settings.',
    isPersonalData: false,
    sensitivity: 'LOW',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  OPERATIONAL: {
    id: 'OPERATIONAL',
    label: 'Operational & Non-Personal Data',
    description: 'Technical form controls, CSRF tokens, captcha, form submission buttons, and state indicators.',
    isPersonalData: false,
    sensitivity: 'NONE',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  UNKNOWN: {
    id: 'UNKNOWN',
    label: 'Ambiguous / Unclassified',
    description: 'Field semantics could not be determined with high confidence; requires manual data mapping review.',
    isPersonalData: true, // conservative stance: do not assume non-personal
    sensitivity: 'UNKNOWN',
    badgeClass: 'bg-gray-100 text-gray-800 border-gray-300',
  },
};

/**
 * Signal matching patterns for category detection.
 * Evaluated in order of precedence: Critical/Specific -> Generic.
 */
export const CATEGORY_PATTERNS = [
  // 1. Children's Data (Critical priority)
  {
    category: 'CHILDREN',
    exactNames: ['child_name', 'childname', 'child_dob', 'child_age', 'guardian_name', 'minor_name', 'ward_name', 'parent_guardian'],
    keywords: ['child', 'minor', 'kid', 'guardian', 'parental', 'ward', 'school student', 'baby', 'pediatric'],
    reason: "Identifies personal data pertaining to a child or minor under DPDP Act 2023 Section 9.",
    confidence: 'HIGH',
  },

  // 2. Health & Medical Data (Critical priority)
  {
    category: 'HEALTH',
    exactNames: ['medical_history', 'blood_group', 'bgroup', 'blood_type', 'health_condition', 'prescription', 'disability_details', 'covid_vaccine', 'medical_report'],
    keywords: ['medical', 'diagnosis', 'prescription', 'medication', 'disease', 'condition', 'disability', 'blood group', 'doctor', 'hospital', 'clinical', 'health history', 'allergy', 'vaccin'],
    reason: "Pertains to physical, physiological, mental health, medical history, or physiological parameters.",
    confidence: 'HIGH',
  },

  // 3. Location (Precise GPS / Geo)
  {
    category: 'LOCATION',
    exactNames: ['gps_location', 'gps_coord', 'latitude', 'longitude', 'lat_lng', 'precise_location', 'current_coords', 'geo_location', 'live_location'],
    keywords: ['gps', 'latitude', 'longitude', 'coordinates', 'geolocation', 'precise location', 'live location', 'device location'],
    reason: "Pertains to real-time physical telemetry, GPS coordinates, or high-precision geolocation.",
    confidence: 'HIGH',
  },

  // 4. Financial (High sensitivity)
  {
    category: 'FINANCIAL',
    exactNames: ['bank_ac', 'bank_account', 'account_no', 'bank_acc', 'ifsc', 'ifsc_code', 'upi_id', 'upi_vpa', 'vpa', 'credit_card', 'debit_card', 'card_number', 'cvv', 'card_expiry', 'salary', 'income', 'monthly_income', 'annual_income'],
    keywords: ['bank account', 'ifsc', 'upi', 'vpa', 'credit card', 'debit card', 'card number', 'cvv', 'net banking', 'salary', 'income', 'taxable income', 'routing number', 'bank branch', 'swift code', 'payment card'],
    autocompleteTokens: ['cc-number', 'cc-exp', 'cc-csc', 'cc-type', 'transaction-amount'],
    reason: "Captures sensitive banking, payment credentials, UPI identifiers, or financial asset information.",
    confidence: 'HIGH',
  },

  // 5. Identity (Official IDs & Personhood)
  {
    category: 'IDENTITY',
    exactNames: ['aadhaar_number', 'aadhaar_no', 'aadhaar', 'aadhar', 'pan_no', 'pan_number', 'panno', 'passport_no', 'passport_number', 'voter_id', 'epic_no', 'driving_license', 'dl_number', 'dob', 'birth_date', 'birthdate', 'date_of_birth', 'full_name', 'fullname', 'first_name', 'firstname', 'last_name', 'lastname', 'fname', 'lname', 'user_name', 'username'],
    keywords: ['aadhaar', 'aadhar', 'uidai', 'pan number', 'passport', 'voter id', 'driving license', 'date of birth', 'birth date', 'full name', 'first name', 'last name', 'middle name', 'father name', 'mother name', 'spouse name', 'gender', 'marital status', 'photo', 'avatar', 'profile picture', 'age'],
    autocompleteTokens: ['name', 'given-name', 'family-name', 'nickname', 'bday', 'bday-day', 'bday-month', 'bday-year', 'sex'],
    types: ['date'],
    reason: "Direct personal identifier establishing natural personhood or government-issued unique identification.",
    confidence: 'HIGH',
  },

  // 6. Authentication & Security
  {
    category: 'AUTH',
    exactNames: ['password', 'pwd', 'passcode', 'user_password', 'current_password', 'new_password', 'confirm_password', 'otp', 'security_pin', 'security_answer'],
    keywords: ['password', 'passcode', 'security pin', 'otp', 'one time password', 'secret question', 'security question'],
    types: ['password'],
    autocompleteTokens: ['current-password', 'new-password', 'one-time-code'],
    reason: "Security credential or authentication secret utilized for identity verification.",
    confidence: 'HIGH',
  },

  // 7. Contact Information
  {
    category: 'CONTACT',
    exactNames: ['user_email', 'mail_id', 'email_address', 'contact_email', 'mob_no', 'user_phone', 'phoneNumber', 'contact_mobile', 'mobile_no', 'phone_number', 'telephone', 'alt_phone', 'alternate_mobile', 'shipping_address', 'delivery_address', 'billing_address', 'postal_address', 'residential_address', 'street_address', 'pincode', 'pin_code', 'zip_code', 'emergency_contact'],
    keywords: ['email', 'mail', 'mobile', 'phone', 'telephone', 'whatsapp', 'shipping address', 'delivery address', 'billing address', 'residential address', 'street address', 'postal address', 'pincode', 'pin code', 'zip code', 'city', 'state', 'country', 'flat no', 'apartment', 'house no', 'landmark'],
    types: ['email', 'tel'],
    autocompleteTokens: ['email', 'tel', 'tel-national', 'tel-country-code', 'address-line1', 'address-line2', 'postal-code', 'country-name'],
    reason: "Communication and address coordinates allowing direct contact or physical parcel delivery to the data principal.",
    confidence: 'HIGH',
  },

  // 8. Employment & Education
  {
    category: 'EMPLOYMENT_EDUCATION',
    exactNames: ['resume', 'cv', 'cover_letter', 'qualification', 'highest_qualification', 'degree', 'university', 'college', 'school_name', 'work_experience', 'years_experience', 'current_employer', 'current_company', 'designation', 'job_title', 'portfolio_url', 'github_profile', 'linkedin_profile'],
    keywords: ['resume', 'curriculum vitae', 'qualification', 'degree', 'education', 'university', 'college', 'institute', 'work experience', 'employer', 'company name', 'job title', 'designation', 'marks', 'percentage', 'cgpa', 'portfolio', 'linkedin', 'github'],
    reason: "Professional credentials, educational track record, or vocational background information.",
    confidence: 'MEDIUM',
  },

  // 9. Preferences & General Feedback
  {
    category: 'PREFERENCES',
    exactNames: ['favorite_topics', 'interests', 'newsletter_topics', 'preferred_language', 'feedback', 'comments', 'feedback_message', 'rating', 'review_text', 'query', 'enquiry_message', 'message_body'],
    keywords: ['favorite topic', 'interest', 'topic', 'preference', 'feedback', 'suggestion', 'comment', 'review', 'rating', 'enquiry', 'query message', 'message', 'newsletter preference', 'language preference'],
    reason: "Qualitative feedback, communication content, or opt-in topic choices for customization.",
    confidence: 'MEDIUM',
  },

  // 10. Operational / Technical
  {
    category: 'OPERATIONAL',
    exactNames: ['csrf', '_csrf', 'csrf_token', '_token', 'authenticity_token', 'submit', 'btn_submit', 'form_action', 'recaptcha', 'g-recaptcha-response', 'h-captcha-response', 'timestamp', 'utm_source', 'utm_medium', 'utm_campaign', 'honeypot'],
    keywords: ['csrf token', 'recaptcha', 'captcha', 'submit button', 'honeypot', 'utm source', 'utm campaign', 'form id'],
    types: ['submit', 'button', 'hidden', 'reset'],
    reason: "Technical infrastructure, CSRF verification token, or non-personal operational control.",
    confidence: 'HIGH',
  },
];

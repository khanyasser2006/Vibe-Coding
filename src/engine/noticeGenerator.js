/**
 * Multilingual Draft Consent Notice Generator under DPDP Act 2023 Section 6.
 * Generates legally structured draft notices in English, Marathi, and Hindi.
 */

export function generateConsentNotice({
  organizationName = '[Your Organization Name]',
  grievanceEmail = 'grievance.officer@yourdomain.com',
  dpoName = '[Data Protection Officer / Grievance Officer Name]',
  withdrawalUrl = 'https://yourdomain.com/privacy/consent-withdrawal',
  purposeObj,
  analysisResults,
  language = 'en',
}) {
  const org = organizationName.trim() || '[Your Organization Name]';
  const purposeName = purposeObj?.name || 'Form Submission';

  // Group detected fields by category
  const personalFields = analysisResults.filter(f => f.isPersonalData && f.verdict !== 'Not personal data');
  const neededFields = personalFields.filter(f => f.verdict === 'Needed');
  const reviewFields = personalFields.filter(f => f.verdict === 'Review');
  const excessFields = personalFields.filter(f => f.verdict === 'Potentially excess');

  // Categories list
  const categoriesCollected = Array.from(
    new Set(personalFields.map(f => f.category?.label).filter(Boolean))
  );

  const neededFieldNames = neededFields.map(f => f.originalName);
  const reviewFieldNames = reviewFields.map(f => f.originalName);
  const excessFieldNames = excessFields.map(f => f.originalName);

  if (language === 'mr') {
    // -------------------------------------------------------------
    // MARATHI (मराठी) NOTICE TEMPLATE
    // -------------------------------------------------------------
    return `// ============================================================================
// मसुदा संमती सूचना — वापरण्यापूर्वी कायदेशीर पडताळणी आवश्यक
// DRAFT CONSENT NOTICE — REVIEW BEFORE USE (DPDP Act, 2023 Section 6)
// ============================================================================

संमती सूचना (डिजिटल वैयक्तिक डेटा संरक्षण कायदा, २०२३ च्या कलम ६ अंतर्गत)

१. डेटा फिडुशियरी (संस्थेची ओळख):
   संस्थेचे नाव: ${org}
   पत्ता/नोंदणीकृत कार्यालय: [नोंदणीकृत कार्यालयाचा पत्ता येथे टाका]
   संपर्क ईमेल: [contact@yourdomain.com]

२. गोळा केल्या जाणाऱ्या वैयक्तिक डेटाचे प्रकार:
   आम्ही खालील श्रेणींमधील वैयक्तिक डेटा गोळा करत आहोत:
   ${categoriesCollected.map(c => `• ${c}`).join('\n   ')}

३. डेटा संकलनाचा उद्देश (Declared Purpose):
   हा डेटा केवळ खालील उद्देशासाठी वापरला जाईल:
   "${purposeName}"
   आणि या प्रक्रियेस थेट पूरक असणाऱ्या कायदेशीर बाबींसाठी.

४. डेटाचा वापर आणि प्रक्रिया (Intended Use):
   • गोळा केलेल्या माहितीचा वापर विनंती केलेली सेवा, संप्रेषण किंवा व्यवहार पूर्ण करण्यासाठी केला जाईल.
   • कायद्याने अनिवार्य केल्याशिवाय किंवा स्पष्ट संमती दिल्याशिवाय हा डेटा कोणत्याही तृतीय पक्षाला विकला किंवा सामायिक केला जाणार नाही.
   • उद्देश पूर्ण झाल्यानंतर किंवा संमती मागे घेतल्यावर डेटा आमच्या संरक्षण धोरणानुसार सुरक्षितपणे नष्ट केला जाईल.

५. आवश्यक आणि पर्यायी डेटा तपशील:
   • आवश्यक डेटा घटक: ${neededFieldNames.length > 0 ? neededFieldNames.join(', ') : 'काही नाही'}
   ${reviewFieldNames.length > 0 ? `• पर्यायी / पुनरावलोकन आवश्यक घटक: ${reviewFieldNames.join(', ')} (वापरकर्त्याच्या इच्छेनुसार)` : ''}

${excessFieldNames.length > 0 ? `⚠️ विशेष सूचना — संभाव्य अतिरिक्त डेटा (Data Minimization Alert):
   खालील फील्ड्स घोषित उद्देशासाठी ("${purposeName}") संभाव्यतः अनावश्यक / अतिरिक्त मानली गेली आहेत:
   [ ${excessFieldNames.join(', ')} ]
   शिफारस: डेटा कमी करण्याच्या तत्त्वानुसार ही माहिती गोळा करणे टाळावे किंवा ती पूर्णपणे ऐच्छिक करावी.
` : ''}
६. संमती मागे घेण्याचा अधिकार (Withdrawal of Consent):
   डिजिटल वैयक्तिक डेटा संरक्षण कायदा, २०२३ अंतर्गत तुम्हाला तुमची संमती कोणत्याही वेळी मागे घेण्याचा पूर्ण अधिकार आहे. संमती मागे घेतल्याने मागील प्रक्रियेच्या वैधतेवर परिणाम होणार नाही.
   संमती मागे घेण्यासाठी लिंक: ${withdrawalUrl}
   किंवा खालील पत्त्यावर ईमेल पाठवा: ${grievanceEmail}

७. तक्रार निवारण अधिकारी (Grievance Redressal Officer):
   अधिकारी नाव: ${dpoName}
   ईमेल: ${grievanceEmail}
   तक्रार निवारण कालावधी: कायद्यानुसार विहित मुदतीत निवारण केले जाईल.

----------------------------------------------------------------------------
अस्वीकरण (Disclaimer):
ही संमती सूचना संगणकीय विश्लेषण नियमांवर आधारित तयार केलेला प्राथमिक मसुदा आहे. हा कोणताही अधिकृत कायदेशीर सल्ला नाही. उत्पादन वातावरणात लागू करण्यापूर्वी कृपया आपल्या कायदेशीर सल्लागाराकडून प्रमाणित करून घ्या.`;
  }

  if (language === 'hi') {
    // -------------------------------------------------------------
    // HINDI (हिन्दी) NOTICE TEMPLATE
    // -------------------------------------------------------------
    return `// ============================================================================
// प्रारूप सहमति सूचना — उपयोग से पूर्व समीक्षा अनिवार्य
// DRAFT CONSENT NOTICE — REVIEW BEFORE USE (DPDP Act, 2023 Section 6)
// ============================================================================

सहमति सूचना (डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 की धारा 6 के अंतर्गत)

1. डेटा फिडुशरी (संगठन की पहचान):
   संगठन का नाम: ${org}
   पंजीकृत कार्यालय का पता: [पंजीकृत कार्यालय का पता यहाँ दर्ज करें]
   आधिकारिक संपर्क ईमेल: [contact@yourdomain.com]

2. एकत्रित किए जाने वाले व्यक्तिगत डेटा की श्रेणियां:
   हम आपके द्वारा निम्नलिखित श्रेणियों का डेटा एकत्र कर रहे हैं:
   ${categoriesCollected.map(c => `• ${c}`).join('\n   ')}

3. डेटा एकत्र करने का विशिष्ट उद्देश्य (Specified Purpose):
   यह डेटा विशेष रूप से केवल निम्नलिखित उद्देश्य के लिए संसाधित किया जाएगा:
   "${purposeName}"
   तथा इस उद्देश्य की पूर्ति हेतु प्रत्यक्ष रूप से जुड़े वैध कार्यों के लिए।

4. व्यक्तिगत डेटा का उपयोग (Intended Use of Data):
   • एकत्रित डेटा का उपयोग केवल अनुरोधित सेवा, संवाद या लेनदेन को संपन्न करने के लिए किया जाएगा।
   • कानूनी बाध्यता अथवा आपकी स्पष्ट सहमति के बिना यह डेटा किसी भी तृतीय पक्ष को बेचा या हस्तांतरित नहीं किया जाएगा।
   • उद्देश्य पूर्ण होने अथवा सहमति वापस लिए जाने पर डेटा को सुरक्षित रीति से नष्ट/हटा दिया जाएगा।

5. आवश्यक एवं वैकल्पिक फ़ील्ड विवरण:
   • आवश्यक डेटा बिंदु: ${neededFieldNames.length > 0 ? neededFieldNames.join(', ') : 'कोई नहीं'}
   ${reviewFieldNames.length > 0 ? `• वैकल्पिक / समीक्षाधीन फ़ील्ड्स: ${reviewFieldNames.join(', ')} (वैकल्पिक रूप से प्रदान किया जा सकता है)` : ''}

${excessFieldNames.length > 0 ? `⚠️ विशेष सतर्कता सूचना — संभावित रूप से अत्यधिक डेटा (Excess Collection Warning):
   निम्नलिखित फ़ील्ड्स घोषित उद्देश्य ("${purposeName}") के लिए संभावित रूप से अनावश्यक या अत्यधिक पाई गई हैं:
   [ ${excessFieldNames.join(', ')} ]
   सिफ़ारिश: डेटा न्यूनतमकरण (Data Minimization) सिद्धांत के तहत इन फ़ील्ड्स को फ़ॉर्म से हटा दें अथवा इन्हें अनिवार्य न बनाएं।
` : ''}
6. सहमति वापस लेने का अधिकार (Right to Withdraw Consent):
   डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 के तहत आपको किसी भी समय अपनी सहमति वापस लेने का पूरा अधिकार है। सहमति वापसी पूर्व में किए गए वैध प्रसंस्करण को प्रभावित नहीं करेगी।
   सहमति वापसी पोर्टल: ${withdrawalUrl}
   अथवा ईमेल द्वारा अनुरोध भेजें: ${grievanceEmail}

7. शिकायत निवारण अधिकारी (Data Protection / Grievance Officer):
   अधिकारी का नाम: ${dpoName}
   संपर्क ईमेल: ${grievanceEmail}
   निवारण समय-सीमा: नियमानुसार निर्धारित समय-सीमा के भीतर शिकायत का निस्तारण किया जाएगा।

----------------------------------------------------------------------------
अस्वीकरण (Disclaimer):
यह सहमति सूचना नियम-आधारित स्वचालित जांच द्वारा उत्पन्न एक प्रारंभिक मसौदा है। यह कोई आधिकारिक कानूनी परामर्श या नियामक प्रमाणन नहीं है। इसे लाइव वेबसाइट पर लागू करने से पूर्व अपने विधिक परामर्शदाता से समीक्षा करवाएं।`;
  }

  // -------------------------------------------------------------
  // ENGLISH NOTICE TEMPLATE (DEFAULT)
  // -------------------------------------------------------------
  return `// ============================================================================
// DRAFT CONSENT NOTICE — REVIEW BEFORE USE
// Under Section 6 of the Digital Personal Data Protection (DPDP) Act, 2023
// ============================================================================

NOTICE OF INTENT TO COLLECT & PROCESS PERSONAL DATA

1. DATA FIDUCIARY IDENTITY:
   Entity Name: ${org}
   Registered Office: [Insert Complete Business Address]
   Contact Channel: [Insert Contact Email / Phone]

2. CATEGORIES OF PERSONAL DATA COLLECTED:
   The following categories of personal data are identified for collection:
   ${categoriesCollected.map(c => `• ${c}`).join('\n   ')}

3. SPECIFIED PURPOSE OF COLLECTION:
   Your personal data is requested strictly and solely for the following specified purpose:
   "${purposeName}"
   and for activities directly incidental to fulfilling this primary objective.

4. INTENDED USE & PROCESSING:
   • To deliver, coordinate, and fulfill the requested interaction or service.
   • To maintain necessary operational and transactional audit records as mandated by applicable law.
   • We do not sell, rent, or transfer your personal data to unauthorized third parties.
   • Data will be retained only as long as necessary to satisfy the declared purpose, after which it will be irreversibly erased.

5. DATA FIELD BREAKDOWN:
   • Necessary Fields: ${neededFieldNames.length > 0 ? neededFieldNames.join(', ') : 'None identified'}
   ${reviewFieldNames.length > 0 ? `• Optional / Contextual Fields: ${reviewFieldNames.join(', ')} (May be provided optionally)` : ''}

${excessFieldNames.length > 0 ? `⚠️ PRIVACY WARNING — POTENTIALLY EXCESSIVE DATA COLLECTION:
   The following fields appear disproportionate or excessive for "${purposeName}" under DPDP Section 6 minimization rules:
   [ ${excessFieldNames.join(', ')} ]
   Action Recommended: Do not mark these fields as mandatory. Consider removing them entirely unless a separate statutory mandate applies.
` : ''}
6. RIGHT TO WITHDRAW CONSENT:
   Under Section 6(4) of the DPDP Act 2023, you have the right to withdraw your consent at any time with the same ease with which it was given. Withdrawal will not affect the lawfulness of processing undertaken prior to such withdrawal.
   Withdrawal Portal: ${withdrawalUrl}
   Email Request: ${grievanceEmail}

7. GRIEVANCE REDRESSAL MECHANISM:
   If you have inquiries, complaints, or wish to exercise your rights as a Data Principal, please contact our Grievance Officer:
   Grievance Officer: ${dpoName}
   Email: ${grievanceEmail}
   Response Timetable: Grievances will be redressed within the statutory period prescribed under DPDP Rules.

----------------------------------------------------------------------------
LEGAL DISCLAIMER:
This document is an automated draft notice generated via rule-based heuristic screening. It serves as an drafting accelerator and does not constitute formal legal advice, certification, or an official guarantee of regulatory compliance. Organizations must consult qualified privacy counsel prior to deployment.`;
}

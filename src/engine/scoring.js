/**
 * Deterministic, explainable screening score calculator (0-100).
 * Evaluates compliance risk under DPDP Act 2023 principles (Data Minimization, Purpose Limitation).
 */

export function calculateScreeningScore(analysisResults, purposeObj) {
  if (!analysisResults || analysisResults.length === 0) {
    return {
      score: 0,
      band: 'EMPTY',
      bandLabel: 'No Fields Analyzed',
      bandColor: 'text-slate-500 bg-slate-100',
      positiveFactors: [],
      negativeFactors: ['No valid form fields were detected to calculate a screening score.'],
      deductionItems: [],
      reviewItems: [],
      breakdown: {
        totalFields: 0,
        personalData: 0,
        needed: 0,
        excess: 0,
        review: 0,
        notPersonal: 0,
      },
      limitations: 'Calculations are based strictly on rule-based heuristic screening against DPDP Act 2023 principles.',
    };
  }

  let baseScore = 100;
  const positiveFactors = [];
  const negativeFactors = [];
  const deductionItems = [];
  const reviewItems = [];

  let neededCount = 0;
  let excessCount = 0;
  let reviewCount = 0;
  let notPersonalCount = 0;
  let personalDataCount = 0;

  for (const item of analysisResults) {
    if (item.isPersonalData && item.verdict !== 'Not personal data') {
      personalDataCount++;
    }
    const verdict = item.verdict;
    const severity = item.severity;
    const fieldName = item.originalName;
    const category = item.category?.label || 'Unknown';

    if (verdict === 'Needed') {
      neededCount++;
    } else if (verdict === 'Potentially excess') {
      excessCount++;
      let penalty = 18;
      if (severity === 'HIGH') penalty = 22;
      else if (severity === 'MEDIUM') penalty = 15;

      baseScore -= penalty;
      deductionItems.push({
        field: fieldName,
        category,
        penalty,
        reason: item.verdictReason || item.reason,
      });
    } else if (verdict === 'Review') {
      reviewCount++;
      let penalty = 6;
      if (severity === 'MEDIUM') penalty = 8;
      else if (severity === 'LOW') penalty = 5;

      baseScore -= penalty;
      reviewItems.push({
        field: fieldName,
        category,
        penalty,
        reason: item.verdictReason || item.reason,
      });
    } else if (verdict === 'Not personal data') {
      notPersonalCount++;
    }
  }

  // Purpose-level adjustments
  if (!purposeObj || !purposeObj.isKnown) {
    baseScore -= 10;
    const purposeName = purposeObj?.name || 'Unspecified';
    negativeFactors.push(`Custom or unlisted purpose "${purposeName}" prevents strict necessity evaluation under DPDP Section 6 (-10 pts).`);
  } else {
    positiveFactors.push(`Declared business purpose "${purposeObj.name}" establishes clear operational boundaries.`);
  }

  if (excessCount === 0) {
    positiveFactors.push('Zero overtly excessive or intrusive data fields detected for this purpose.');
  } else {
    negativeFactors.push(`${excessCount} field(s) flagged as potentially excessive under data minimization principles.`);
  }

  if (neededCount > 0) {
    positiveFactors.push(`${neededCount} field(s) directly correspond to necessary operational requirements.`);
  }

  if (reviewCount > 0) {
    negativeFactors.push(`${reviewCount} field(s) require manual verification or optional opt-in designation.`);
  }

  // Clamp score between 0 and 100
  const finalScore = Math.max(0, Math.min(100, Math.round(baseScore)));

  // Determine Rating Band
  let band = 'EXCELLENT';
  let bandLabel = 'Low Risk (Well Minimized)';
  let bandColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let badgeColor = 'bg-emerald-600';

  if (finalScore < 50) {
    band = 'HIGH_RISK';
    bandLabel = 'High Excess Risk';
    bandColor = 'text-rose-700 bg-rose-50 border-rose-200';
    badgeColor = 'bg-rose-600';
  } else if (finalScore < 75) {
    band = 'NEEDS_ATTENTION';
    bandLabel = 'Moderate Excess Risk';
    bandColor = 'text-amber-700 bg-amber-50 border-amber-200';
    badgeColor = 'bg-amber-600';
  } else if (finalScore < 90) {
    band = 'GOOD';
    bandLabel = 'Satisfactory Minimization';
    bandColor = 'text-teal-700 bg-teal-50 border-teal-200';
    badgeColor = 'bg-teal-600';
  }

  return {
    score: finalScore,
    band,
    bandLabel,
    bandColor,
    badgeColor,
    positiveFactors,
    negativeFactors,
    deductionItems,
    reviewItems,
    breakdown: {
      totalFields: analysisResults.length,
      personalData: personalDataCount,
      needed: neededCount,
      excess: excessCount,
      review: reviewCount,
      notPersonal: notPersonalCount,
    },
    limitations:
      'This screening score is an automated algorithmic heuristic based on standard DPDP Act 2023 data minimization guidelines. It does not certify official legal compliance or replace counsel review.',
  };
}

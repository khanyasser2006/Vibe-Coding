import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';

export default function ScoreCard({ scoreResult, purpose }) {
  const [showDetailedExplanation, setShowDetailedExplanation] = useState(false);

  if (!scoreResult) return null;

  const {
    score,
    band,
    bandLabel,
    bandColor,
    positiveFactors = [],
    negativeFactors = [],
    deductionItems = [],
    reviewItems = [],
    breakdown = {},
    limitations,
  } = scoreResult;

  // Determine circle circumference for SVG progress ring
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#0D9488'; // teal default
  if (score < 50) strokeColor = '#E11D48'; // rose
  else if (score < 75) strokeColor = '#D97706'; // amber

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
      
      {/* Top Title & Stated Purpose */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-slate-900">
              Rule-Based Screening Score
            </h2>
            <span className={`text-xs px-2.5 py-0.5 rounded-md font-semibold border ${bandColor}`}>
              {bandLabel}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data minimization & proportionality evaluated against: <strong className="text-slate-900 font-semibold">"{purpose?.name || 'Unspecified'}"</strong>
          </p>
        </div>
      </div>

      {/* Main Score & Cohesive Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center my-5">
        
        {/* Score Ring Display */}
        <div className="lg:col-span-4 flex items-center justify-center sm:justify-start space-x-4">
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#F1F5F9"
                strokeWidth="7"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={strokeColor}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {score}
              </span>
              <span className="text-[10px] text-slate-400 font-medium -mt-1">/ 100</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Screening Rating</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{bandLabel}</div>
            <p className="text-xs text-slate-500 mt-1 max-w-[190px] leading-snug">
              {score >= 75 ? 'Field collection is well-proportioned to the declared purpose.' : 'Contains unnecessary or excessive personal data collection.'}
            </p>
          </div>
        </div>

        {/* Cohesive Information Section (Integrated Metrics Strip) */}
        <div className="lg:col-span-8 bg-slate-50 border border-slate-200/80 rounded-xl p-3 sm:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 gap-y-3 sm:gap-y-0">
            
            {/* Total Fields */}
            <div className="text-center px-2 py-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Fields</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">{breakdown.totalFields ?? 0}</span>
            </div>

            {/* Personal Data Fields */}
            <div className="text-center px-2 py-1">
              <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block">Personal Data</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">{breakdown.personalData ?? 0}</span>
            </div>

            {/* Needed */}
            <div className="text-center px-2 py-1">
              <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block flex items-center justify-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>Needed</span>
              </span>
              <span className="text-2xl font-bold text-emerald-800 mt-1 block">{breakdown.needed ?? 0}</span>
            </div>

            {/* Potentially Excess */}
            <div className="text-center px-2 py-1">
              <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block flex items-center justify-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block"></span>
                <span>Excess</span>
              </span>
              <span className="text-2xl font-bold text-rose-800 mt-1 block">{breakdown.excess ?? 0}</span>
            </div>

            {/* Review */}
            <div className="text-center px-2 py-1">
              <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block flex items-center justify-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
                <span>Review</span>
              </span>
              <span className="text-2xl font-bold text-amber-800 mt-1 block">{breakdown.review ?? 0}</span>
            </div>

          </div>
        </div>

      </div>

      {/* Accordion / Expandable Calculation Details */}
      <div className="border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={() => setShowDetailedExplanation(!showDetailedExplanation)}
          className="w-full flex items-center justify-between text-xs font-semibold text-teal-800 hover:text-teal-900 py-1 cursor-pointer"
        >
          <span className="flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-teal-600" />
            <span>View Score Calculation & Deduction Breakdown</span>
          </span>
          {showDetailedExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDetailedExplanation && (
          <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
            <div>
              <span className="font-semibold text-slate-800 block mb-1">Calculation Methodology:</span>
              <p className="text-slate-600 leading-relaxed">
                Starting from a base score of 100, the algorithm evaluates each classified field against DPDP Act 2023 Section 6 purpose minimization principles.
                High-severity excessive fields (e.g. Aadhaar, Health, or GPS for low-risk purposes) incur a 22-point deduction. Ambiguous or optional fields without clear necessity incur a 6-to-8 point deduction.
              </p>
            </div>

            {/* Positive Factors */}
            {positiveFactors.length > 0 && (
              <div>
                <span className="font-semibold text-emerald-800 block mb-1">Positive Factors:</span>
                <ul className="space-y-1">
                  {positiveFactors.map((f, i) => (
                    <li key={i} className="text-emerald-700 flex items-start space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Deductions Breakdown */}
            {deductionItems.length > 0 && (
              <div>
                <span className="font-semibold text-rose-800 block mb-1">Deductions Applied:</span>
                <div className="space-y-1.5">
                  {deductionItems.map((item, i) => (
                    <div key={i} className="flex items-start justify-between bg-white p-2 rounded-lg border border-rose-100">
                      <div>
                        <strong className="text-slate-900">{item.field}</strong>
                        <span className="text-[11px] text-slate-500 ml-1.5">({item.category})</span>
                        <p className="text-[11px] text-slate-600 mt-0.5">{item.reason}</p>
                      </div>
                      <span className="font-mono font-bold text-rose-700 text-xs shrink-0 ml-2">
                        -{item.penalty} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regulatory Disclaimer */}
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 italic">
              <strong>Limitations & Legal Notice:</strong> {limitations}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

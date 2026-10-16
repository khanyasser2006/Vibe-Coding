import React from 'react';
import { AlertOctagon, CheckCircle, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function ExcessAlerts({ excessFields = [], purpose }) {
  if (excessFields.length === 0) {
    return (
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4.5 sm:p-5 flex items-start space-x-3 text-emerald-900 shadow-xs">
        <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
        <div>
          <h3 className="text-sm font-bold text-emerald-950">
            Data Minimization Principle Observed
          </h3>
          <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
            No overtly excessive or disproportionate personal data collection was detected for the declared purpose: <strong className="font-semibold text-emerald-950">"{purpose?.name || 'General'}"</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-5 sm:p-6 shadow-xs">
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <AlertOctagon className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-rose-950 flex items-center space-x-2">
            <span>Potentially Excessive Collection Warnings</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-200/70 text-rose-900 font-bold">
              {excessFields.length} {excessFields.length === 1 ? 'Field' : 'Fields'} Flagged
            </span>
          </h3>
          <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
            Under Section 6 of India's DPDP Act 2023, personal data must be limited strictly to what is necessary for the specified purpose. The following fields exceed reasonable necessity for <strong>"{purpose?.name || 'this purpose'}"</strong>:
          </p>
        </div>
      </div>

      {/* Grid of excessive items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {excessFields.map((field) => (
          <div
            key={field.id}
            className="bg-white p-3.5 rounded-xl border border-rose-200/90 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {field.originalName}
                </span>
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {field.category?.label}
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                {field.verdictReason}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-medium text-rose-600 flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 inline" />
                <span>Recommendation:</span>
              </span>
              <span className="text-slate-600">Remove or make strictly optional</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

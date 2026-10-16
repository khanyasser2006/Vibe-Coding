import React from 'react';
import { ShieldCheck, Lock, FileCheck2, Sparkles, RefreshCw } from 'lucide-react';

export default function Header({ onLoadDemo, onReset, isAnalyzed }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-teal-700 flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 font-sans leading-none">
                DPDP <span className="text-teal-700">Form Auditor</span>
              </h1>
              <p className="text-xs text-slate-500 font-normal mt-1">
                Data Minimization & Statutory Consent Screening
              </p>
            </div>
          </div>

          {/* Controls & Privacy Badge */}
          <div className="flex items-center flex-wrap gap-2.5 sm:self-center">
            {/* Subtle Client-Side Indicator */}
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Client-Side Analysis</span>
            </div>

            {/* Quick Demo Button */}
            <button
              type="button"
              onClick={onLoadDemo}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white transition-colors cursor-pointer"
              title="Load realistic demo form with excessive fields"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Demo Case</span>
            </button>

            {/* Reset Button */}
            {isAnalyzed && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                title="Reset form"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

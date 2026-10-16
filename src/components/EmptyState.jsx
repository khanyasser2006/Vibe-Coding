import React from 'react';
import { ShieldCheck, Sparkles, Scale, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ADDITIONAL_DEMOS } from '../data/demoCase';

export default function EmptyState({ onLoadDemo, onSelectPreset }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center shadow-xs">
      
      {/* Icon Badge */}
      <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200/80 text-teal-700 flex items-center justify-center mx-auto mb-4 shadow-xs">
        <Scale className="w-8 h-8 stroke-[2]" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
        Ready to Audit Your Web Form
      </h3>
      <p className="text-sm text-slate-500 max-w-lg mx-auto mt-1.5 leading-relaxed">
        Declare your collection purpose above, paste an HTML form or list of field names, and click <strong>Analyze Form</strong> to detect personal data, flag excess collection, and generate draft statutory consent notices.
      </p>

      {/* Primary Demo CTA */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onLoadDemo}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm transition-all active:scale-98 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Load Messy Demo & Run Audit</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Benchmark Presets Bar */}
      <div className="mt-8 pt-6 border-t border-slate-100 max-w-2xl mx-auto">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
          Or audit pre-configured benchmarks:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {ADDITIONAL_DEMOS.map((demo) => (
            <button
              key={demo.id}
              type="button"
              onClick={() => onSelectPreset(demo)}
              className="text-xs font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              {demo.name}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

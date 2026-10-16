import React, { useState } from 'react';
import { Code, ListOrdered, Play, Sparkles, Building2, HelpCircle, AlertCircle, RefreshCw, X } from 'lucide-react';
import { KNOWN_PURPOSES } from '../engine/purposeRules';
import { ADDITIONAL_DEMOS } from '../data/demoCase';

export default function InputSection({
  purpose,
  setPurpose,
  onPurposeSelect,
  inputMode,
  setInputMode,
  inputContent,
  setInputContent,
  organizationName,
  setOrganizationName,
  onAnalyze,
  onLoadDemo,
  onSelectPreset,
  onReset,
  error,
  isAnalyzing,
  isAnalyzed,
}) {
  const [showPurposeHelper, setShowPurposeHelper] = useState(false);

  const sampleHtmlHint = `<form action="/submit" method="POST">
  <label for="usr_eml">Email Address *</label>
  <input type="email" id="usr_eml" name="user_email" required autocomplete="email" />

  <label for="mob">Mobile Number</label>
  <input type="tel" id="mob" name="mob_no" autocomplete="tel" />

  <label for="uid">Aadhaar Number</label>
  <input type="text" id="uid" name="aadhaar_number" />
</form>`;

  const sampleListHint = `user_email
mob_no
dob
aadhaar_number
medical_history
gps_location
favorite_topics`;

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
      
      {/* Purpose & Organization Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        
        {/* Purpose Input */}
        <div className="md:col-span-8">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="purposeInput" className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
              Declared Purpose *
            </label>
            <button
              type="button"
              onClick={() => setShowPurposeHelper(!showPurposeHelper)}
              className="text-[11px] text-teal-700 hover:text-teal-800 flex items-center space-x-1 cursor-pointer font-medium"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Suggested Purposes ({KNOWN_PURPOSES.length})</span>
            </button>
          </div>

          <div className="relative">
            <input
              id="purposeInput"
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. newsletter signup, contact form, checkout, job application"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-700 transition-all font-medium text-slate-900 placeholder:text-slate-400"
            />
            {purpose && (
              <button
                type="button"
                onClick={() => setPurpose('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Clear purpose"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Preset Purpose Pills */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {KNOWN_PURPOSES.slice(0, 6).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onPurposeSelect ? onPurposeSelect(p.name.toLowerCase()) : setPurpose(p.name.toLowerCase())}
                className={`text-[11px] px-2.5 py-0.5 rounded-md border transition-all cursor-pointer ${
                  purpose.toLowerCase() === p.name.toLowerCase()
                    ? 'bg-teal-50 text-teal-800 border-teal-300 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {showPurposeHelper && (
            <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
              <p className="font-semibold text-slate-800 mb-1">Purpose Limitation under DPDP Section 6:</p>
              <p className="mb-2 leading-relaxed text-slate-500">
                Personal data collection must be limited strictly to specified lawful purposes:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 pt-1">
                {KNOWN_PURPOSES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      if (onPurposeSelect) onPurposeSelect(p.name.toLowerCase());
                      else setPurpose(p.name.toLowerCase());
                      setShowPurposeHelper(false);
                    }}
                    className="text-left p-1 rounded hover:bg-teal-50 text-slate-700 hover:text-teal-900 transition-colors cursor-pointer text-[11px]"
                  >
                    • {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Organization Name Input */}
        <div className="md:col-span-4">
          <label htmlFor="orgInput" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400 inline" />
            <span>Data Fiduciary (Company)</span>
          </label>
          <input
            id="orgInput"
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="e.g. Acme Tech Solutions Ltd."
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-700 transition-all text-slate-900 placeholder:text-slate-400"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Populates legal fiduciary in consent notices
          </p>
        </div>

      </div>

      {/* Input Mode Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2 mb-2.5 gap-2">
        <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setInputMode('html')}
            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              inputMode === 'html'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Paste HTML</span>
          </button>
          <button
            type="button"
            onClick={() => setInputMode('list')}
            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              inputMode === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Enter Field Names</span>
          </button>
        </div>

        {/* Benchmark presets */}
        <div className="flex items-center space-x-1.5 text-xs">
          <span className="text-slate-400 text-[11px]">Presets:</span>
          {ADDITIONAL_DEMOS.map((demo) => (
            <button
              key={demo.id}
              type="button"
              onClick={() => onSelectPreset(demo)}
              className="text-[11px] text-slate-600 hover:text-teal-800 bg-slate-50 hover:bg-teal-50 border border-slate-200 px-2 py-0.5 rounded transition-colors cursor-pointer"
            >
              {demo.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Textarea — Obvious Focal Point */}
      <div className="relative">
        <textarea
          rows={7}
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          placeholder={inputMode === 'html' ? sampleHtmlHint : sampleListHint}
          className="w-full font-mono text-xs sm:text-[13px] leading-relaxed p-4 bg-slate-900 text-slate-100 rounded-lg border border-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-600 transition-all placeholder:text-slate-600 shadow-inner resize-y"
        />

        {inputContent && (
          <div className="absolute right-2.5 bottom-2.5">
            <button
              type="button"
              onClick={() => setInputContent('')}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded transition-colors cursor-pointer"
            >
              Clear Editor
            </button>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-2 text-rose-800 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Actions Bar — High Visual Clarity */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="text-xs text-slate-400">
          <span>Shortcuts: Press <kbd className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-600 border border-slate-200">Ctrl</kbd> + <kbd className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-600 border border-slate-200">Enter</kbd> to analyze</span>
        </div>

        <div className="flex items-center flex-wrap gap-2 sm:self-center">
          
          {/* Reset Button */}
          {isAnalyzed && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium transition-colors cursor-pointer"
              title="Reset form"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset</span>
            </button>
          )}

          {/* Load Messy Demo Button */}
          <button
            type="button"
            onClick={onLoadDemo}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>Load Messy Demo</span>
          </button>

          {/* Analyze Form Primary Button — Obvious Focal Point */}
          <button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-98 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Form'}</span>
          </button>

        </div>
      </div>

    </section>
  );
}

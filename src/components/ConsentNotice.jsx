import React, { useState } from 'react';
import { FileText, Copy, Check, Globe, AlertTriangle, ShieldCheck, Download } from 'lucide-react';
import { generateConsentNotice } from '../engine/noticeGenerator';

export default function ConsentNotice({
  purpose,
  fields = [],
  organizationName = '',
  setOrganizationName,
}) {
  const [activeLang, setActiveLang] = useState('en');
  const [copied, setCopied] = useState(false);
  const [grievanceEmail, setGrievanceEmail] = useState('grievance.officer@example.com');
  const [dpoName, setDpoName] = useState('Data Protection Officer');

  // Regenerate notice dynamically based on current configuration
  const noticeText = generateConsentNotice({
    organizationName,
    grievanceEmail,
    dpoName,
    purposeObj: purpose,
    analysisResults: fields,
    language: activeLang,
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(noticeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = noticeText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadNotice = () => {
    const blob = new Blob([noticeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DPDP_Consent_Notice_${activeLang.toUpperCase()}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
      
      {/* Header and Language Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-teal-600" />
              <span>Draft Consent Notice</span>
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              DPDP Act 2023 Sec 6 Draft
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-generated notice specifying data categories, declared purpose, and withdrawal mechanism.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveLang('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeLang === 'en'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('mr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeLang === 'mr'
                ? 'bg-white text-teal-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            मराठी (Marathi)
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('hi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeLang === 'hi'
                ? 'bg-white text-teal-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            हिन्दी (Hindi)
          </button>
        </div>
      </div>

      {/* Customizable Parameters */}
      <div className="my-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
            Data Fiduciary / Company Name:
          </label>
          <input
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="e.g. Acme Corp India"
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-800"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
            Grievance Redressal Officer Email:
          </label>
          <input
            type="email"
            value={grievanceEmail}
            onChange={(e) => setGrievanceEmail(e.target.value)}
            placeholder="grievance.officer@domain.com"
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-800"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
            Officer Designation / Name:
          </label>
          <input
            type="text"
            value={dpoName}
            onChange={(e) => setDpoName(e.target.value)}
            placeholder="Data Protection Officer"
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-800"
          />
        </div>
      </div>

      {/* Notice Viewer Container */}
      <div className="relative">
        <div className="flex items-center justify-between bg-slate-800 text-slate-300 px-4 py-2 rounded-t-xl text-xs font-mono">
          <span className="font-semibold text-teal-300">
            DRAFT CONSENT NOTICE — REVIEW BEFORE USE [{activeLang.toUpperCase()}]
          </span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleDownloadNotice}
              className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 transition-colors cursor-pointer"
              title="Download text file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .txt</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center space-x-1 px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded font-medium transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Notice</span>
                </>
              )}
            </button>
          </div>
        </div>

        <pre className="p-4 sm:p-5 bg-slate-900 text-slate-100 rounded-b-xl text-xs sm:text-[13px] font-mono leading-relaxed overflow-x-auto max-h-[420px] whitespace-pre-wrap selection:bg-teal-800 border-x border-b border-slate-800">
          {noticeText}
        </pre>
      </div>

      {/* Legal & Regulatory Notice Banner */}
      <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start space-x-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Mandatory Notice:</strong> This generated text is an algorithmically produced starting draft. It does not certify official DPDP compliance or constitute formal legal counsel. Prior to production publishing, organizations must review data retention policies, third-party sub-processor disclosures, and verify parental consent workflows for minors under DPDP Section 9.
        </p>
      </div>

    </div>
  );
}

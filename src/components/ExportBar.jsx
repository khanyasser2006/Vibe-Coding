import React, { useState } from 'react';
import { Download, Copy, Printer, Check, FileDown, ShieldCheck } from 'lucide-react';
import { generateTextReport } from '../engine/auditor';

export default function ExportBar({ auditData, organizationName }) {
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!auditData || !auditData.isValid) return null;

  const handleCopySummary = async () => {
    const reportText = generateTextReport({ auditData, organizationName });
    try {
      await navigator.clipboard.writeText(reportText);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = reportText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    }
  };

  const handleDownloadReport = () => {
    const reportText = generateTextReport({ auditData, organizationName });
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DPDP_Form_Audit_Report_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
      <div>
        <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
          <FileDown className="w-4 h-4 text-teal-600" />
          <span>Audit Report & Documentation Export</span>
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Export full classification tables, deduction logs, and DPDP consent notices.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        
        {/* Copy Full Audit Summary */}
        <button
          type="button"
          onClick={handleCopySummary}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
        >
          {copiedSummary ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">Summary Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-500" />
              <span>Copy Full Report</span>
            </>
          )}
        </button>

        {/* Download Plain-Text Report */}
        <button
          type="button"
          onClick={handleDownloadReport}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100/80 text-teal-900 border border-teal-200/80 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-teal-700" />
          <span>Download .txt Report</span>
        </button>

        {/* Print / Save as PDF */}
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>

      </div>
    </div>
  );
}

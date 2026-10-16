import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ScoreCard from './components/ScoreCard';
import ExcessAlerts from './components/ExcessAlerts';
import FieldTable from './components/FieldTable';
import ConsentNotice from './components/ConsentNotice';
import ExportBar from './components/ExportBar';
import EmptyState from './components/EmptyState';
import { auditForm } from './engine/auditor';
import { generateConsentNotice } from './engine/noticeGenerator';
import { DEMO_CASE } from './data/demoCase';

export default function App() {
  const [purpose, setPurpose] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [inputMode, setInputMode] = useState('html');
  const [htmlInput, setHtmlInput] = useState('');
  const [listInput, setListInput] = useState('');
  const [auditResult, setAuditResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  // Active input content based on selected mode
  const currentInput = inputMode === 'html' ? htmlInput : listInput;
  const setInputContent = (val) => {
    if (inputMode === 'html') {
      setHtmlInput(val);
    } else {
      setListInput(val);
    }
  };

  /**
   * Centralized audit execution function.
   * Runs the real rule-based classification and scoring engine.
   */
  const executeAudit = (content, mode, pText, orgName) => {
    setError(null);
    setIsAnalyzing(true);

    try {
      if (!pText || !pText.trim()) {
        setError('Please declare a collection purpose before auditing (e.g. "newsletter signup", "contact form", "checkout", "job application").');
        setIsAnalyzing(false);
        return;
      }

      if (!content || !content.trim()) {
        setError(
          mode === 'html'
            ? 'Pasted HTML is empty. Paste an HTML form snippet or switch to "Enter Field Names".'
            : 'Field list is empty. Enter comma- or newline-separated field names.'
        );
        setIsAnalyzing(false);
        return;
      }

      const result = auditForm({
        inputContent: content,
        inputMode: mode,
        purposeText: pText,
        organizationName: orgName,
      });

      if (!result.isValid) {
        setError(result.error);
        setAuditResult(null);
      } else {
        setAuditResult(result);
        setError(null);
      }
    } catch (err) {
      console.error('Audit execution error:', err);
      setError(`An unexpected error occurred during analysis: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Primary action: Analyze Form
  const handleAnalyze = () => {
    executeAudit(currentInput, inputMode, purpose, organizationName);
  };

  // Load Messy Demo Case
  const handleLoadDemo = () => {
    setPurpose(DEMO_CASE.purpose);
    setOrganizationName(DEMO_CASE.organizationName);
    setHtmlInput(DEMO_CASE.htmlContent);
    setListInput(DEMO_CASE.fieldListContent);
    setInputMode('html');
    executeAudit(DEMO_CASE.htmlContent, 'html', DEMO_CASE.purpose, DEMO_CASE.organizationName);
  };

  // Load a benchmark case
  const handleSelectPreset = (preset) => {
    setPurpose(preset.purpose);
    setOrganizationName(preset.organizationName);
    setListInput(preset.fieldListContent);
    setInputMode('list');
    executeAudit(preset.fieldListContent, 'list', preset.purpose, preset.organizationName);
  };

  // Selecting a suggested purpose updates purpose and re-analyzes if active
  const handlePurposeSelect = (newPurpose) => {
    setPurpose(newPurpose);
    if (currentInput && currentInput.trim()) {
      executeAudit(currentInput, inputMode, newPurpose, organizationName);
    }
  };

  // Updating organization name dynamically updates notices
  const handleOrganizationChange = (newOrg) => {
    setOrganizationName(newOrg);
    if (auditResult && auditResult.isValid) {
      const updatedNotices = {
        en: generateConsentNotice({ organizationName: newOrg, purposeObj: auditResult.purpose, analysisResults: auditResult.fields, language: 'en' }),
        mr: generateConsentNotice({ organizationName: newOrg, purposeObj: auditResult.purpose, analysisResults: auditResult.fields, language: 'mr' }),
        hi: generateConsentNotice({ organizationName: newOrg, purposeObj: auditResult.purpose, analysisResults: auditResult.fields, language: 'hi' }),
      };
      setAuditResult({
        ...auditResult,
        notices: updatedNotices,
      });
    }
  };

  // Reset all state to clean initial workspace
  const handleReset = () => {
    setPurpose('');
    setOrganizationName('');
    setHtmlInput('');
    setListInput('');
    setAuditResult(null);
    setError(null);
  };

  // Keyboard shortcut Ctrl+Enter or Cmd+Enter to trigger Analyze
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleAnalyze();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentInput, inputMode, purpose, organizationName]);

  const excessFields = useMemo(() => {
    return auditResult?.fields?.filter((f) => f.verdict === 'Potentially excess') || [];
  }, [auditResult]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Header */}
      <Header
        onLoadDemo={handleLoadDemo}
        onReset={handleReset}
        isAnalyzed={Boolean(auditResult)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Input Section */}
        <InputSection
          purpose={purpose}
          setPurpose={setPurpose}
          onPurposeSelect={handlePurposeSelect}
          inputMode={inputMode}
          setInputMode={setInputMode}
          inputContent={currentInput}
          setInputContent={setInputContent}
          organizationName={organizationName}
          setOrganizationName={handleOrganizationChange}
          onAnalyze={handleAnalyze}
          onLoadDemo={handleLoadDemo}
          onSelectPreset={handleSelectPreset}
          onReset={handleReset}
          error={error}
          isAnalyzing={isAnalyzing}
          isAnalyzed={Boolean(auditResult)}
        />

        {/* Audit Results Section */}
        {auditResult && auditResult.isValid ? (
          <div className="space-y-6 animate-fadeIn">
            
            {/* 1. Screening Score Card */}
            <ScoreCard
              scoreResult={auditResult.scoreResult}
              purpose={auditResult.purpose}
            />

            {/* 2. Potentially Excessive Collection Warning Banner */}
            <ExcessAlerts
              excessFields={excessFields}
              purpose={auditResult.purpose}
            />

            {/* 3. Interactive Classification & Findings Table */}
            <FieldTable
              fields={auditResult.fields}
            />

            {/* 4. Multilingual Draft Consent Notice Generator */}
            <ConsentNotice
              purpose={auditResult.purpose}
              fields={auditResult.fields}
              organizationName={organizationName}
              setOrganizationName={handleOrganizationChange}
            />

            {/* 5. Report Copy & Download Controls */}
            <ExportBar
              auditData={auditResult}
              organizationName={organizationName}
            />

          </div>
        ) : (
          /* Empty Initial State */
          <EmptyState
            onLoadDemo={handleLoadDemo}
            onSelectPreset={handleSelectPreset}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">DPDP Form Auditor</span>
            <span>•</span>
            <span>Swayambhu 2K26 Vibe Coding</span>
          </div>
          <div className="text-slate-400">
            Powered by local deterministic rules • Data Minimization under DPDP Act 2023 (Sec 6)
          </div>
        </div>
      </footer>

    </div>
  );
}

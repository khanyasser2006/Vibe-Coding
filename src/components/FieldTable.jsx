import React, { useState, useMemo } from 'react';
import { Search, Filter, CheckCircle2, AlertTriangle, XCircle, HelpCircle, Layers, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES } from '../engine/categories';

export default function FieldTable({ fields = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedVerdict, setSelectedVerdict] = useState('ALL');

  // Filter logic
  const filteredFields = useMemo(() => {
    return fields.filter((f) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = f.originalName?.toLowerCase().includes(query);
        const matchCategory = f.category?.label?.toLowerCase().includes(query);
        const matchReason = f.verdictReason?.toLowerCase().includes(query) || f.reason?.toLowerCase().includes(query);
        if (!matchName && !matchCategory && !matchReason) return false;
      }

      // 2. Category Filter
      if (selectedCategory !== 'ALL' && f.categoryKey !== selectedCategory) {
        return false;
      }

      // 3. Verdict Filter
      if (selectedVerdict !== 'ALL' && f.verdict !== selectedVerdict) {
        return false;
      }

      return true;
    });
  }, [fields, searchQuery, selectedCategory, selectedVerdict]);

  // Unique categories in current results
  const availableCategories = useMemo(() => {
    const set = new Set(fields.map((f) => f.categoryKey).filter(Boolean));
    return Array.from(set);
  }, [fields]);

  const renderVerdictBadge = (verdict) => {
    switch (verdict) {
      case 'Needed':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Needed</span>
          </span>
        );
      case 'Potentially excess':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Potentially excess</span>
          </span>
        );
      case 'Review':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Review</span>
          </span>
        );
      case 'Not personal data':
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Not personal data</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      
      {/* Header & Filter Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <span>Classified Fields & Findings</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                {filteredFields.length} of {fields.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review personal data categories, necessity verdicts, and regulatory reasoning.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search field, category, reason..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-slate-800"
            />
          </div>
        </div>

        {/* Verdict and Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
          
          {/* Verdict Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase mr-1">Verdict:</span>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'Needed', label: 'Needed' },
              { id: 'Potentially excess', label: 'Potentially Excess' },
              { id: 'Review', label: 'Review' },
              { id: 'Not personal data', label: 'Not Personal' },
            ].map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVerdict(v.id)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  selectedVerdict === v.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center space-x-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 cursor-pointer"
            >
              <option value="ALL">All Categories ({fields.length})</option>
              {availableCategories.map((key) => {
                const cat = CATEGORIES[key];
                const count = fields.filter((f) => f.categoryKey === key).length;
                return (
                  <option key={key} value={key}>
                    {cat?.label || key} ({count})
                  </option>
                );
              })}
            </select>
          </div>

        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4 w-1/4">Field Identifier</th>
              <th className="py-3 px-3 w-1/12 text-center">Personal Data?</th>
              <th className="py-3 px-3 w-1/5">Category</th>
              <th className="py-3 px-3 w-1/6">Verdict</th>
              <th className="py-3 px-4 w-1/3">Minimization Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredFields.length > 0 ? (
              filteredFields.map((field) => (
                <tr key={field.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Field Column */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="flex flex-col">
                      <span className="font-mono font-bold text-slate-900 break-all text-xs">
                        {field.originalName}
                      </span>
                      {field.signals?.type && (
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          type="{field.signals.type}" {field.signals.autocomplete ? `• autocomplete="${field.signals.autocomplete}"` : ''}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Personal Data Column */}
                  <td className="py-3.5 px-3 align-top text-center">
                    {field.isPersonalData ? (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                        No
                      </span>
                    )}
                  </td>

                  {/* Category Column */}
                  <td className="py-3.5 px-3 align-top">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                        field.category?.badgeClass || 'bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      {field.category?.label || 'Unclassified'}
                    </span>
                    {field.category?.sensitivity && field.category.sensitivity !== 'NONE' && (
                      <span className="block text-[10px] text-slate-400 mt-1 uppercase font-medium">
                        Sensitivity: {field.category.sensitivity}
                      </span>
                    )}
                  </td>

                  {/* Verdict Column */}
                  <td className="py-3.5 px-3 align-top">
                    {renderVerdictBadge(field.verdict)}
                  </td>

                  {/* Reason Column */}
                  <td className="py-3.5 px-4 align-top">
                    <p className="text-slate-700 leading-relaxed font-normal">
                      {field.verdictReason || field.reason}
                    </p>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <HelpCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-600">No matching fields found</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try adjusting your search query or reset the verdict/category filters.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('ALL');
                      setSelectedVerdict('ALL');
                    }}
                    className="mt-3 inline-flex items-center text-xs font-semibold text-teal-700 hover:text-teal-800 underline cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

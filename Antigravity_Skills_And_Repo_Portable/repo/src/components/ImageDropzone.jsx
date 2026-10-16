import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, RefreshCw, Link as LinkIcon, Check } from 'lucide-react';

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export default function ImageDropzone({
  value = '',
  onChange,
  label = 'Visual Image Asset',
  helperText = 'Drop an image here (PNG, JPG, WebP) or click to browse files',
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const fileInputRef = useRef(null);

  // Helper to read file and compress if needed so localStorage doesn't hit quota
  const processImageFile = (file) => {
    if (!file || !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert('Please upload a valid image file (PNG, JPG, or WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;

      // If image is large (> 400KB), downscale on canvas for smooth localStorage storage
      if (file.size > 400 * 1024) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          onChange(compressed);
        };
        img.src = dataUrl;
      } else {
        onChange(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target?.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleApplyUrl = (e) => {
    e.preventDefault();
    const url = urlDraft.trim();
    if (!url) return;
    const isSafe = /^https?:\/\//i.test(url) || url.startsWith('/');
    if (!isSafe) {
      alert('Only secure HTTPS URLs or local paths are permitted.');
      return;
    }
    onChange(url);
    setUrlDraft('');
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block uppercase tracking-wider font-bold text-terracotta text-xs">
          {label} *
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-tangerine-700 hover:text-tangerine-deep font-semibold flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide URL input' : 'Or paste URL'}</span>
        </button>
      </div>

      {/* Manual URL paste drawer */}
      {showUrlInput && (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-peach-50 border border-tangerine/30 animate-fadeIn">
          <input
            type="text"
            placeholder="Paste image URL (e.g. /assets/... or https://...)"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs bg-transparent text-terracotta focus:outline-none"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-1 rounded-lg bg-tangerine hover:bg-tangerine-deep text-white text-xs font-bold transition-colors"
          >
            Apply
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {value ? (
        /* Image Preview State */
        <div className="relative rounded-2xl overflow-hidden border-2 border-tangerine/40 bg-peach-light/80 p-3 flex flex-col sm:flex-row items-center gap-4 group">
          <div className="w-full sm:w-36 h-28 rounded-xl overflow-hidden border border-tangerine/30 bg-peach-50 relative shrink-0 shadow-sm">
            <img
              src={value}
              alt="Asset Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/assets/cine-cone-hero.png';
              }}
            />
          </div>

          <div className="flex-1 w-full flex flex-col justify-between gap-3 text-xs">
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-tangerine/15 text-tangerine-800 border border-tangerine/30 mb-1.5">
                <Check className="w-3 h-3 text-tangerine-700" />
                Active Visual Asset
              </span>
              <p className="font-mono text-[11px] text-terracotta/70 truncate max-w-xs sm:max-w-sm">
                {value.startsWith('data:') ? 'Custom Uploaded Local Image' : value}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-peach-200 hover:bg-peach-300 text-terracotta font-bold text-xs transition-colors"
              >
                <RefreshCw className="w-3 h-3 text-tangerine" />
                <span>Replace Image</span>
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Drag & Drop Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-6 flex flex-col items-center justify-center gap-3 text-center select-none ${
            isDragging
              ? 'border-tangerine bg-peach-200/80 shadow-glow-tangerine scale-[1.01]'
              : 'border-tangerine/40 bg-peach-50/80 hover:bg-peach-100/70 hover:border-tangerine'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-peach-200 flex items-center justify-center text-tangerine shadow-sm group-hover:scale-105 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-terracotta">
              <span className="text-tangerine-700 underline">Click to upload</span> or drag and drop
            </p>
            <p className="text-[11px] text-terracotta/70 font-medium">
              {helperText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

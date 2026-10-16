import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  brandStory as defaultBrand,
  flavorList as defaultFlavors,
  boutiques as defaultBoutiques,
  galleryPhotos as defaultGalleryPhotos,
  processSteps as defaultProcessSteps,
} from '../data/iceCreamData';

const CMS_STORAGE_KEY = 'cine_cms_data';

// Default page hero content (extracted from each page's hardcoded JSX)
const defaultPageContent = {
  flavors: {
    badge: 'Summer Harvest 2026 Collection',
    title: 'Tree-Ripened •',
    titleAccent: 'Our Fresh Flavors.',
    description:
      'Every scoop begins in sunlit French peach orchards and Valencian citrus groves. We never use artificial syrups or dyes—only pure fruit, fresh farm cream, and slow, artisanal churning.',
  },
  howItsMade: {
    badge: 'Artisanal Atelier Process',
    title: 'Pure Craft •',
    titleAccent: "How It's Made.",
    description:
      'From the dawn orchards of Provence to the chilled copper churners of our workshop atelier, explore the four slow stages that give Ciné its rich velvet density and bright fruit flavor.',
  },
  photos: {
    badge: 'Mediterranean Visual Journal',
    title: 'Our Story •',
    titleAccent: 'In Photos.',
    description:
      'A curated collection of moments from our orchards, our workshops, and our boutiques across the Mediterranean and beyond.',
  },
  shops: {
    badge: 'Global Flagship Ateliers',
    title: 'Sunlit Spaces •',
    titleAccent: 'Our Boutiques.',
    description:
      'Step inside our sunlit flagship boutiques where fresh scoops are churned daily and the warm, fruity aromas welcome you from the doorstep.',
  },
};

// Build the complete default data set
const buildDefaults = () => ({
  brand: { ...defaultBrand },
  flavors: defaultFlavors.map((f) => ({ ...f })),
  boutiques: defaultBoutiques.map((b) => ({ ...b })),
  galleryPhotos: defaultGalleryPhotos.map((p) => ({ ...p })),
  processSteps: defaultProcessSteps.map((s) => ({ ...s })),
  pageContent: JSON.parse(JSON.stringify(defaultPageContent)),
});

// Read from localStorage, falling back to defaults
const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults to fill any missing keys from future updates
      const defaults = buildDefaults();
      return {
        brand: { ...defaults.brand, ...parsed.brand },
        flavors: parsed.flavors || defaults.flavors,
        boutiques: parsed.boutiques || defaults.boutiques,
        galleryPhotos: parsed.galleryPhotos || defaults.galleryPhotos,
        processSteps: parsed.processSteps || defaults.processSteps,
        pageContent: {
          flavors: { ...defaults.pageContent.flavors, ...parsed.pageContent?.flavors },
          howItsMade: { ...defaults.pageContent.howItsMade, ...parsed.pageContent?.howItsMade },
          photos: { ...defaults.pageContent.photos, ...parsed.pageContent?.photos },
          shops: { ...defaults.pageContent.shops, ...parsed.pageContent?.shops },
        },
      };
    }
  } catch {
    // Ignore parse errors
  }
  return buildDefaults();
};

// Save to localStorage
const saveToStorage = (data) => {
  try {
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('[Ciné CMS] Storage quota exceeded. Some changes may not persist.', err.message);
  }
};

// Generate a unique ID
const generateId = (prefix = 'item') =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// Context
const CmsContext = createContext(null);

export function CmsProvider({ children }) {
  const [data, setData] = useState(loadFromStorage);

  // Persist to localStorage on every change
  useEffect(() => {
    saveToStorage(data);
  }, [data]);

  // ─── Brand ───
  const updateBrand = useCallback((updates) => {
    setData((prev) => ({ ...prev, brand: { ...prev.brand, ...updates } }));
  }, []);

  // ─── Flavors CRUD ───
  const addFlavor = useCallback((flavor) => {
    const newFlavor = { ...flavor, id: flavor.id || generateId('flavor') };
    setData((prev) => ({ ...prev, flavors: [...prev.flavors, newFlavor] }));
    return newFlavor;
  }, []);

  const updateFlavor = useCallback((id, updates) => {
    setData((prev) => ({
      ...prev,
      flavors: prev.flavors.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    }));
  }, []);

  const deleteFlavor = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      flavors: prev.flavors.filter((f) => f.id !== id),
    }));
  }, []);

  // ─── Boutiques CRUD ───
  const addBoutique = useCallback((boutique) => {
    const newBoutique = { ...boutique, id: boutique.id || generateId('boutique') };
    setData((prev) => ({ ...prev, boutiques: [...prev.boutiques, newBoutique] }));
    return newBoutique;
  }, []);

  const updateBoutique = useCallback((id, updates) => {
    setData((prev) => ({
      ...prev,
      boutiques: prev.boutiques.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
  }, []);

  const deleteBoutique = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      boutiques: prev.boutiques.filter((b) => b.id !== id),
    }));
  }, []);

  // ─── Gallery Photos CRUD ───
  const addPhoto = useCallback((photo) => {
    const newPhoto = { ...photo, id: photo.id || generateId('photo') };
    setData((prev) => ({ ...prev, galleryPhotos: [...prev.galleryPhotos, newPhoto] }));
    return newPhoto;
  }, []);

  const updatePhoto = useCallback((id, updates) => {
    setData((prev) => ({
      ...prev,
      galleryPhotos: prev.galleryPhotos.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  }, []);

  const deletePhoto = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      galleryPhotos: prev.galleryPhotos.filter((p) => p.id !== id),
    }));
  }, []);

  // ─── Process Steps CRUD ───
  const addProcessStep = useCallback((step) => {
    setData((prev) => ({
      ...prev,
      processSteps: [...prev.processSteps, { ...step }],
    }));
  }, []);

  const updateProcessStep = useCallback((index, updates) => {
    setData((prev) => ({
      ...prev,
      processSteps: prev.processSteps.map((s, i) => (i === index ? { ...s, ...updates } : s)),
    }));
  }, []);

  const deleteProcessStep = useCallback((index) => {
    setData((prev) => ({
      ...prev,
      processSteps: prev.processSteps.filter((_, i) => i !== index),
    }));
  }, []);

  // ─── Page Content ───
  const updatePageContent = useCallback((pageKey, updates) => {
    setData((prev) => ({
      ...prev,
      pageContent: {
        ...prev.pageContent,
        [pageKey]: { ...prev.pageContent[pageKey], ...updates },
      },
    }));
  }, []);

  // ─── Reset ───
  const resetToDefaults = useCallback(() => {
    const defaults = buildDefaults();
    setData(defaults);
    saveToStorage(defaults);
  }, []);

  // ─── Export / Import ───
  const exportData = useCallback(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  const importData = useCallback((jsonString) => {
    try {
      const raw = JSON.parse(jsonString);
      // Sanitize: strip prototype pollution keys
      const sanitized = JSON.parse(JSON.stringify(raw, (key, value) => {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') return undefined;
        return value;
      }));
      // Validate basic schema
      if (sanitized && typeof sanitized === 'object' && !Array.isArray(sanitized)) {
        setData(sanitized);
        return { success: true };
      }
      return { success: false, error: 'Invalid data format: expected an object.' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const value = {
    // Data
    brand: data.brand,
    flavors: data.flavors,
    boutiques: data.boutiques,
    galleryPhotos: data.galleryPhotos,
    processSteps: data.processSteps,
    pageContent: data.pageContent,
    // Brand
    updateBrand,
    // Flavors
    addFlavor,
    updateFlavor,
    deleteFlavor,
    // Boutiques
    addBoutique,
    updateBoutique,
    deleteBoutique,
    // Gallery Photos
    addPhoto,
    updatePhoto,
    deletePhoto,
    // Process Steps
    addProcessStep,
    updateProcessStep,
    deleteProcessStep,
    // Page Content
    updatePageContent,
    // Utilities
    resetToDefaults,
    exportData,
    importData,
  };

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
}

export default CmsContext;

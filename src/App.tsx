// App.tsx
import React, { useState } from 'react';
import LocationRequest from './pages/LocationRequest';
import LocationAnalysis from './pages/LocationAnalysis';
import type { AnalysisTab, LocationAnalysis as LocationAnalysisType } from './types';
import { mockAnalysis } from './data/mockData';

type AppState = 'request' | 'analysis';

// Extend your tab to optionally hold the transformed analysis
type AnalysisTabWithData = AnalysisTab & {
  analysis?: LocationAnalysisType | null;
  loading?: boolean;
  error?: string | null;
  businessScale?: string | null; // ★ NEW – keep the chosen scale with the tab
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppState>('request');
  const [analysisTabs, setAnalysisTabs] = useState<AnalysisTabWithData[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  // ★ NEW – accept businessScale from LocationRequest
  const handleLocationSubmit = async (
    location: string,
    businessType: string,
    businessScale: string // "SME" | "Corporate" | "Franchise"
  ) => {
    const newTab: AnalysisTabWithData = {
      id: Date.now().toString(),
      label: `Analysis ${analysisTabs.length + 1}`,
      location,
      businessType,
      businessScale, // ★ NEW
      isActive: true,
      createdAt: new Date(),
      analysis: null,
      loading: true,
      error: null,
    };

    const updatedInactive = analysisTabs.map(t => ({ ...t, isActive: false }));
    setAnalysisTabs([...updatedInactive, newTab]);
    setActiveTabId(newTab.id);
    setCurrentPage('analysis');

    // fetch transformed analysis from backend
    try {
      const res = await fetch('/api/analyze-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // ★ NEW – include scale if your backend wants it (safe to leave if unused)
        body: JSON.stringify({ location, businessType, businessScale }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as LocationAnalysisType;

      setAnalysisTabs(tabs =>
        tabs.map(t =>
          t.id === newTab.id
            ? { ...t, analysis: data, loading: false, error: null }
            : t
        )
      );
    } catch (e: any) {
      console.warn('Analyze failed, using mock fallback:', e?.message || e);
      const fallback: LocationAnalysisType = {
        ...mockAnalysis,
        location: { ...mockAnalysis.location, address: location },
        businessType,
      };
      setAnalysisTabs(tabs =>
        tabs.map(t =>
          t.id === newTab.id
            ? { ...t, analysis: fallback, loading: false, error: 'Using fallback data' }
            : t
        )
      );
    }
  };

  // ★ NEW – Back should reset cache/data
  const handleBackToRequest = () => {
    try {
      // clear any session flags we set (LocationRequest stores this)
      sessionStorage.removeItem('lastScale');
      // if you store more, clear here:
      // sessionStorage.removeItem('lastLocation');
      // sessionStorage.removeItem('lastBusinessType');
    } catch {}
    // reset in-memory state to a clean slate
    setAnalysisTabs([]);
    setActiveTabId(null);
    setCurrentPage('request');
  };

  const handleTabSwitch = (tabId: string) => {
    setAnalysisTabs(tabs => tabs.map(t => ({ ...t, isActive: t.id === tabId })));
    setActiveTabId(tabId);
    setCurrentPage('analysis');
  };

  const handleTabClose = (tabId: string) => {
    const remaining = analysisTabs.filter(t => t.id !== tabId);

    // if we closed the active tab, pick a new one or go back
    if (activeTabId === tabId) {
      if (remaining.length > 0) {
        remaining[0].isActive = true;
        setActiveTabId(remaining[0].id);
        setCurrentPage('analysis');
      } else {
        setActiveTabId(null);
        setCurrentPage('request');
      }
    }
    setAnalysisTabs(remaining);
  };

  const handleNewComparison = () => {
    setCurrentPage('request');
  };

  const activeTab = analysisTabs.find(t => t.id === activeTabId) || null;

  return (
    <div className="App">
      {currentPage === 'request' && (
        // ★ NEW – LocationRequest already calls onSubmit(location, type, scale)
        <LocationRequest onSubmit={handleLocationSubmit} />
      )}

      {currentPage === 'analysis' && activeTab && (
        <LocationAnalysis
          location={activeTab.location}
          businessType={activeTab.businessType}
          onBack={handleBackToRequest}
          tabs={analysisTabs}
          activeTabId={activeTabId}
          onTabSwitch={handleTabSwitch}
          onTabClose={handleTabClose}
          onNewComparison={handleNewComparison}
          // pass transformed analysis (or mock while loading)
          analysis={
            activeTab.analysis ??
            { ...mockAnalysis, location: { ...mockAnalysis.location, address: activeTab.location }, businessType: activeTab.businessType }
          }
          // ★ NEW – pass the chosen scale down so the score updates
          businessScale={activeTab.businessScale || undefined}
        />
      )}
    </div>
  );
}

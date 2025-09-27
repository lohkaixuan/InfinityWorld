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
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppState>('request');
  const [analysisTabs, setAnalysisTabs] = useState<AnalysisTabWithData[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  // Submit from LocationRequest: create a tab and fetch analysis for it
  const handleLocationSubmit = async (location: string, businessType: string) => {
    const newTab: AnalysisTabWithData = {
      id: Date.now().toString(),
      label: `Analysis ${analysisTabs.length + 1}`,
      location,
      businessType,
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
        body: JSON.stringify({ location, businessType }),
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

  const handleBackToRequest = () => {
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
        />
      )}
    </div>
  );
}

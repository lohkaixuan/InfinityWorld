import React, { useState, useEffect, useRef,useMemo } from "react";
import { Menu, X, MessageCircle, Download, ArrowLeft } from "lucide-react";
import TabNavigation from "../components/TabNavigation";
import GoogleMap from "../components/GoogleMap";
import SeasonalDemandChart from "../components/charts/SeasonalDemandChart";
import DemographicChart from "../components/charts/DemographicChart";
import CompetitorChart from "../components/charts/CompetitorChart";
import LocationProfileChart from "../components/charts/LocationProfileChart";
import CompetitionDensityChart from "../components/charts/CompetitionDensityChart";
import SuccessScoreChart from "../components/charts/SuccessScoreChart";
import BusinessCard from "../components/BusinessCard";
import BusinessDetail from "../components/BusinessDetail";
import AIAssistant from "../components/AIAssistant";
import KPICards from "../components/KPICards";
import RentLocationContent from "../components/RentLocationContent";
import {
  LocationAnalysis as LocationAnalysisType,
  Business,
  AnalysisTab,
  Location,
} from "../types";

import { geocodeLocation } from "../utils/geocoding";
import { findNearbyBusinesses } from "../utils/placesService";
import { useGoogleMaps } from "../hooks/useGoogleMaps";
import jsPDF from "jspdf";

import html2canvas from "html2canvas";
import NDVIDashboard from "../components/ndvi/NDVIDashboard";
import { Ndvi } from "../data/NDVI";

interface LocationAnalysisProps {
  location: string;
  businessType: string;
  onBack: () => void;
  tabs: AnalysisTab[];
  activeTabId: string | null;
  onTabSwitch: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewComparison: () => void;

  analysis: LocationAnalysisType;

  // NEW: receive scale from request page
  businessScale?: string; // "SME" | "Corporate" | "Franchise"
}

const LocationAnalysis: React.FC<LocationAnalysisProps> = ({
  location,
  businessType,
  onBack,
  tabs,
  activeTabId,
  onTabSwitch,
  onTabClose,
  onNewComparison,
  analysis,
  businessScale, // NEW
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "businesses" | "rent">("overview");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // map helpers
  const [actualLocation, setActualLocation] = useState<Location | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const { isLoaded } = useGoogleMaps();

  // page view
  const [view, setView] = useState<"dashboard" | "map" | "ndvi">("dashboard");

  useEffect(() => {
    setIsPanelOpen(view === "dashboard");
  }, [view]);

  // NEW: resolve scale (prop → sessionStorage → default)
  type Scale = "sme" | "corporate" | "franchise";
  const normalize = (s: string) => s.trim().toLowerCase() as Scale;
  const [resolvedScale, setResolvedScale] = useState<Scale>(() => {
    const fromProp = businessScale?.trim();
    const fromStore = sessionStorage.getItem("lastScale") || "";
    const raw = (fromProp || fromStore || "SME").toLowerCase();
    return (["sme", "corporate", "franchise"].includes(raw) ? raw : "sme") as Scale;
  });

  useEffect(() => {
    if (businessScale) {
      setResolvedScale(normalize(businessScale));
      sessionStorage.setItem("lastScale", businessScale);
    }
  }, [businessScale]);

 // --- after resolvedScale is set ---

    // map score per scale
    const scoreByScale: Record<Scale, number> = {
      sme: 45,
      corporate: 60,
      franchise: 87,
    };

    // ✅ compute score first (memoized)
    const computedScore = useMemo(
      () => scoreByScale[resolvedScale] ?? analysis.successScore,
      [resolvedScale, analysis.successScore]
    );

    // KPIs typing + per-scale values
    type KPIs = LocationAnalysisType["kpis"];

    const kpisByScale: Record<Scale, KPIs> = {
      sme:       { revenuePotential: 62000, competitorCount: 36, avgRating: 4.3, monthlyDemand: 10000, rentSensitivity: 80 },
      corporate: { revenuePotential: 78000, competitorCount: 38, avgRating: 4.3, monthlyDemand: 11800, rentSensitivity: 74 },
      franchise: { revenuePotential: 90000, competitorCount: 42, avgRating: 4.4, monthlyDemand: 13500, rentSensitivity: 69 },
    };

    // ✅ memoize KPIs
    const computedKpis = useMemo<KPIs>(
      () => kpisByScale[resolvedScale] ?? analysis.kpis,
      [resolvedScale, analysis.kpis]
    );

    // ✅ now it’s safe to use both in the effect
    useEffect(() => {
      try {
        sessionStorage.setItem("lastLocation", location);
        sessionStorage.setItem("lastBusinessType", businessType);
        sessionStorage.setItem("lastScale", resolvedScale.toUpperCase());
        sessionStorage.setItem("lastScore", String(computedScore));
        sessionStorage.setItem("lastKpis", JSON.stringify(computedKpis));
      } catch (e) {
        console.warn("Failed to persist assistant context:", e);
      }
    }, [location, businessType, resolvedScale, computedScore, computedKpis]);


  useEffect(() => {
    
    const run = async () => {
      if (!isLoaded) return;

      setIsGeocoding(true);

      const geocoded = await geocodeLocation(location);

      let finalLoc: Location;
      if (geocoded) {
        finalLoc = geocoded;
      } else {
        finalLoc = {
          lat: analysis.location.lat,
          lng: analysis.location.lng,
          address: location || analysis.location.address,
        };
      }

      setActualLocation(finalLoc);

      const realBusinesses = await findNearbyBusinesses(finalLoc, businessType);
      setBusinesses(realBusinesses);

      setIsGeocoding(false);
    };

    run();
  }, [location, businessType, isLoaded, analysis.location.lat, analysis.location.lng]);

  const handleBusinessClick = (business: Business) => {
    setSelectedBusiness(business);
  };

  const handleRecenterMap = (_business: Business) => {
    setSelectedBusiness(null);
  };

  const reportRef = useRef<HTMLDivElement>(null);
  const dashRef = useRef<HTMLDivElement>(null);
  // put these above downloadPDF
async function waitForRender(ms = 200) {
  // give charts time to paint final frames
  await new Promise(r => setTimeout(r, ms));
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
}

async function addElementAsPages(pdf: jsPDF, el: HTMLElement) {
  // make sure the element is fully laid out & charts painted
  await waitForRender(250);

  // IMPORTANT: ensure all <img> tags inside have crossOrigin to avoid taint
  el.querySelectorAll('img').forEach(img => {
    if (!img.getAttribute('crossorigin')) img.setAttribute('crossorigin', 'anonymous');
  });

  const rect = el.getBoundingClientRect();
  const width = Math.ceil(rect.width);
  const height = Math.ceil(el.scrollHeight);

  const canvas = await html2canvas(el, {
    scale: 2,                     // high DPI
    backgroundColor: '#ffffff',
    useCORS: true,
    allowTaint: false,
    windowWidth: width,
    windowHeight: height,
    foreignObjectRendering: true, // better text fidelity
    onclone: (doc) => {
      // ensure the cloned doc hides floaters/sticky too
      doc.body.classList.add('exporting');
    }
  });

  const imgData = canvas.toDataURL('image/png');

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const imgW  = pageW;
  const imgH  = (canvas.height * imgW) / canvas.width;

  let remaining = imgH;
  let yOffsetPx = 0; // move the image up for subsequent pages

  // page 1
  pdf.addImage(imgData, 'PNG', 0, 0, imgW, imgH);
  remaining -= pageH;

  while (remaining > 0) {
    pdf.addPage();
    yOffsetPx -= pageH;                  // shift image up by one page height
    pdf.addImage(imgData, 'PNG', 0, yOffsetPx, imgW, imgH);
    remaining -= pageH;
  }
}

const downloadPDF = async (
  opts?: {
    score?: number;                   // optional override, e.g. computedScore
    kpisOverride?: {
      avgRating: number;
      monthlyDemand: number;
      competitorCount: number;
      revenuePotential: number;
      rentSensitivity?: number;
    };
  }
) => {
  setIsDownloading(true);

  // ---------- small helpers ----------
  const fmtNum = (n: number) => n.toLocaleString();
  const fmtRM  = (n: number) => `RM ${n.toLocaleString()}`;
  const today  = new Date().toLocaleDateString();

  const kpis = opts?.kpisOverride ?? analysis.kpis;
  const score = typeof opts?.score === "number" ? opts!.score : analysis.successScore;

  const pdf = new jsPDF("p", "mm", "a4");
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 14;

  const addHeader = (title: string) => {
    pdf.setFillColor(245, 247, 250);
    pdf.rect(0, 0, pageW, 18, "F");
    pdf.setTextColor(25, 28, 31);
    pdf.setFontSize(11);
    pdf.text(title, margin, 12);
  };
  const addFooter = (page: number) => {
    pdf.setDrawColor(230);
    pdf.line(margin, pageH - 15, pageW - margin, pageH - 15);
    pdf.setTextColor(120);
    pdf.setFontSize(9);
    pdf.text(`Generated ${today}`, margin, pageH - 7);
    pdf.text(`Page ${page}`, pageW - margin, pageH - 7, { align: "right" });
  };
  const addSectionTitle = (text: string, y: number) => {
    pdf.setTextColor(35, 38, 42);
    pdf.setFontSize(14);
    pdf.text(text, margin, y);
    pdf.setDrawColor(220);
    pdf.setLineWidth(0.3);
    pdf.line(margin, y + 2, pageW - margin, y + 2);
  };
  const kpiCard = (x: number, y: number, w: number, h: number, label: string, value: string, color: [number, number, number]) => {
    // card
    pdf.setDrawColor(230, 232, 235);
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(x, y, w, h, 3, 3, "FD");
    // accent
    pdf.setFillColor(...color);
    pdf.roundedRect(x, y, 3, h, 2, 2, "F");
    // text
    pdf.setTextColor(120);
    pdf.setFontSize(10);
    pdf.text(label, x + 7, y + 10);
    pdf.setTextColor(30);
    pdf.setFontSize(16);
    pdf.text(value, x + 7, y + 22);
  };
  const progressBar = (x: number, y: number, w: number, val01: number) => {
    const h = 6;
    pdf.setDrawColor(225);
    pdf.roundedRect(x, y, w, h, 3, 3);
    pdf.setFillColor(30, 144, 255);
    pdf.roundedRect(x, y, Math.max(0, Math.min(w, w * val01)), h, 3, 3, "F");
  };

  try {
    // ---------- COVER ----------
    // header band
    pdf.setFillColor(18, 122, 255);
    pdf.rect(0, 0, pageW, 36, "F");

    // white title box
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(margin, 22, pageW - margin * 2, 42, 4, 4, "F");

    // title
    pdf.setTextColor(18, 122, 255);
    pdf.setFontSize(22);
    pdf.text("Location Analysis Report", margin + 6, 40);

    // subtitle lines
    pdf.setTextColor(40);
    pdf.setFontSize(12);
    pdf.text(`Location: ${location}`, margin + 6, 54);
    pdf.text(`Business Type: ${businessType}`, margin + 6, 62);
    pdf.text(`Generated: ${today}`, margin + 6, 70);

    // big score “dial” (simple ring + number)
    const centerX = pageW - margin - 35;
    const centerY = 55;
    pdf.setDrawColor(235);
    pdf.setLineWidth(4);
    pdf.circle(centerX, centerY, 22, "S");
    // active arc approximation (just a second circle with colored stroke)
    pdf.setDrawColor(18, 122, 255);
    pdf.circle(centerX, centerY, 22, "S");
    pdf.setTextColor(20);
    pdf.setFontSize(10);
    pdf.text("Success", centerX, centerY - 2, { align: "center" });
    pdf.setFontSize(18);
    pdf.text(`${score}/100`, centerX, centerY + 10, { align: "center" });

    addFooter(1);

    // ---------- PAGE 2: KPIs ----------
    pdf.addPage();
    addHeader("Location Analysis");
    addSectionTitle("Key Performance Indicators", 28);

    const gridX = margin;
    const gridY = 40;
    const cardW = (pageW - margin * 2 - 10) / 2; // 2 columns
    const cardH = 28;
    const gap = 10;

    // Row 1
    kpiCard(gridX,                 gridY,               cardW, cardH, "Revenue Potential", fmtRM(kpis.revenuePotential), [128, 90, 255]);
    kpiCard(gridX + cardW + gap,   gridY,               cardW, cardH, "Competitor Count",   fmtNum(kpis.competitorCount), [255, 99, 99]);
    // Row 2
    kpiCard(gridX,                 gridY + cardH + gap, cardW, cardH, "Avg Rating",         `${kpis.avgRating.toFixed(1)} / 5`, [255, 185, 46]);
    kpiCard(gridX + cardW + gap,   gridY + cardH + gap, cardW, cardH, "Est. Monthly Demand", `${fmtNum(kpis.monthlyDemand)} visits`, [46, 204, 113]);

    // Optional: rent sensitivity if you have it
    if (typeof (kpis as any).rentSensitivity === "number") {
      kpiCard(gridX, gridY + (cardH + gap) * 2, cardW, cardH, "Rent Sensitivity", `${(kpis as any).rentSensitivity}/100`, [66, 133, 244]);
    }

    // simple bars
    const barsTop = gridY + (cardH + gap) * 2 + (typeof (kpis as any).rentSensitivity === "number" ? cardH + gap : 6);
    addSectionTitle("Quick Visuals", barsTop);
    const bx = margin, bw = pageW - margin * 2, barH = 8;
    // Demand bar (normalize to a simple scale)
    const demandVal = Math.min(1, kpis.monthlyDemand / Math.max(12000, kpis.monthlyDemand));
    pdf.setTextColor(80);
    pdf.setFontSize(10);
    pdf.text("Demand", bx, barsTop + 12);
    progressBar(bx + 24, barsTop + 7, bw - 24, demandVal);

    // Competitors bar (invert: fewer is better)
    const compVal = Math.min(1, kpis.competitorCount / Math.max(40, kpis.competitorCount));
    pdf.text("Competition", bx, barsTop + 26);
    progressBar(bx + 24, barsTop + 21, bw - 24, compVal);

    addFooter(2);

    // ---------- PAGE 3: DEMOGRAPHICS ----------
    pdf.addPage();
    addHeader("Location Analysis");
    addSectionTitle("Demographics", 28);

    pdf.setFontSize(12);
    pdf.setTextColor(45);
    const demoY = 44;
    const officePct = analysis.demographics.office ?? 0;
    const residentsPct = analysis.demographics.residents ?? 0;

    pdf.text(`Office Workers: ${officePct}%`, margin, demoY);
    progressBar(margin, demoY + 4, pageW - margin * 2, officePct / 100);

    pdf.text(`Residents: ${residentsPct}%`, margin, demoY + 16);
    progressBar(margin, demoY + 20, pageW - margin * 2, residentsPct / 100);

    // A short narrative block
    const blurb =
      `The area shows a ${officePct}% office worker share and ${residentsPct}% residents. ` +
      `Combine the ${fmtNum(kpis.monthlyDemand)} monthly visits with ${fmtNum(kpis.competitorCount)} competitors ` +
      `to align pricing/ops. Revenue potential is ${fmtRM(kpis.revenuePotential)} with an overall success score of ${score}/100.`;
    pdf.setTextColor(90);
    pdf.setFontSize(11);
    const blurbLines = pdf.splitTextToSize(blurb, pageW - margin * 2);
    pdf.text(blurbLines, margin, demoY + 36);

    addFooter(3);

    // ---------- SAVE ----------
    pdf.save("location-analysis-report.pdf");
  } catch (err) {
    console.error("Error generating PDF:", err);
  } finally {
    setIsDownloading(false);
  }
};


  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTabId={activeTabId}
        onTabSwitch={onTabSwitch}
        onTabClose={onTabClose}
        onNewComparison={onNewComparison}
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back to location request"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            aria-label={isPanelOpen ? "Close analysis panel" : "Open analysis panel"}
          >
            {isPanelOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-gray-900">Location Analysis</h1>
            <p className="text-sm text-gray-600">
              {location} • {businessType} • {/* NEW: show scale */}
              <span className="font-medium">
                {resolvedScale.toUpperCase()} (Score {computedScore})
              </span>
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView("dashboard")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
              view === "dashboard" ? "bg-green-700 text-white" : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Analysis Dashboard
          </button>

          <button
            onClick={() => setView("map")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
              view === "map" ? "bg-green-700 text-white" : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Map View
          </button>

          <button
            onClick={() => setView("ndvi")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
              view === "ndvi" ? "bg-green-700 text-white" : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Development Trend
          </button>

          <button
            onClick={downloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      {/* Dashboard only */}
      <div ref={reportRef} className={`transition-all ${view === "dashboard" ? "w-full" : "hidden"}`}>
        {view === "dashboard" && (
          <div
            className={`flex items-start ${showAIAssistant ? "justify-start" : "justify-center"} gap-0 
                        h-[calc(100vh-72px)] min-h-0`}
          >
            {/* LEFT: AI Chat */}
            {showAIAssistant && (
              <div className="hidden lg:block w-1/3">
                <div className="sticky top-[72px] h-[calc(100vh-72px)]">
                  <AIAssistant variant="dock" onClose={() => setShowAIAssistant(false)} className="h-full" />
                </div>
              </div>
            )}

            {/* RIGHT: Dashboard panel */}
            <div
              className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out 
                          ${showAIAssistant ? "w-full lg:w-2/3 xl:w-3/4" : "w-full max-w-5xl"} 
                          h-[calc(100vh-72px)] overflow-y-auto min-h-0`}
            >
              {/* Panel Header */}
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Analysis Dashboard</h2>
                <p className="text-sm text-gray-600">
                  {businessType} in {location}
                </p>

                {/* Tabs */}
                <div className="flex mt-4 bg-gray-100 rounded-lg p-1 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === "overview" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("businesses")}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === "businesses" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Similar Business Nearby
                  </button>
                  <button
                    onClick={() => setActiveTab("rent")}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === "rent" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Rent Location
                  </button>
                </div>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === "overview" ? (
                  <div ref={dashRef} className="p-6 space-y-8">
                    {/* NEW: use computedScore instead of analysis.successScore */}
                    <SuccessScoreChart score={computedScore} />
                    <KPICards kpis={computedKpis} />
                    <SeasonalDemandChart data={analysis.seasonalDemand} />
                    <DemographicChart data={analysis.demographics} />
                    <CompetitorChart data={analysis.competitors} />
                    <LocationProfileChart data={analysis.locationProfile} />
                    <CompetitionDensityChart data={analysis.competitionDensity} />
                  </div>
                ) : activeTab === "businesses" ? (
                  <div className="p-6 space-y-4">
                    <div className="text-sm text-gray-600 mb-4">
                      {businesses.length} businesses found within 1km radius
                    </div>
                    {businesses.map((b) => (
                      <BusinessCard key={b.id} business={b} onClick={handleBusinessClick} />
                    ))}
                  </div>
                ) : (
                  <div className="p-6">
                    <RentLocationContent location={location} businessType={businessType} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map only */}
      <div className={`transition-all ${view === "map" ? "w-full" : "hidden"}`}>
        {view === "map" && (
          <div
            className={`flex items-start ${showAIAssistant ? "justify-start" : "justify-center"} gap-0
                        h-[calc(100vh-72px)] min-h-0`}
          >
            {/* LEFT: AI Chat */}
            {showAIAssistant && (
              <div className="hidden lg:block w-1/3">
                <div className="sticky top-[72px] h-[calc(100vh-72px)]">
                  <AIAssistant variant="dock" onClose={() => setShowAIAssistant(false)} className="h-full" />
                </div>
              </div>
            )}

            {/* RIGHT: Map panel */}
            <div
              className={`bg-white transition-all duration-300 ease-in-out
                          ${showAIAssistant ? "w-full lg:w-2/3 xl:w-3/4" : "w-full max-w-5xl"}
                          h-[calc(100vh-72px)] min-h-0 flex flex-col`}
            >
              {/* Panel Header */}
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Map View</h2>
                <p className="text-sm text-gray-600">
                  {businessType} in {location}
                </p>
              </div>

              {/* Map area */}
              <div className="flex-1 min-h-0 overflow-hidden">
                {isGeocoding ? (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <div className="text-gray-600">Finding location...</div>
                    </div>
                  </div>
                ) : (
                  <GoogleMap
                    location={actualLocation || analysis.location}
                    businesses={businesses}
                    onBusinessClick={handleBusinessClick}
                    className="w-full h-full"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ndvi only */}
      <div className={`transition-all ${view === "ndvi" ? "w-full" : "hidden"}`}>
        {view === "ndvi" && (
          <div
            className={`flex items-start ${showAIAssistant ? "justify-start" : "justify-center"} gap-0 
                        h-[calc(100vh-72px)] min-h-0`}
          >
            {/* LEFT: AI Chat */}
            {showAIAssistant && (
              <div className="hidden lg:block w-1/3">
                <div className="sticky top-[72px] h-[calc(100vh-72px)]">
                  <AIAssistant variant="dock" onClose={() => setShowAIAssistant(false)} className="h-full" />
                </div>
              </div>
            )}

            {/* RIGHT: ndvi panel */}
            <div
              className={`bg-black transition-all duration-300 ease-in-out 
                ${showAIAssistant ? "w-full lg:w-2/3 xl:w-3/4" : "w-full max-w-5xl"} 
                h-[calc(100vh-72px)] overflow-y-auto min-h-0 rounded-tl-2xl`}
            >
              <NDVIDashboard data={Ndvi} />
            </div>
          </div>
        )}
      </div>

      {/* Hamburger Button for Mobile */}
      {!isPanelOpen && (
        <button
          onClick={() => setIsPanelOpen(true)}
          className="fixed top-32 left-4 z-10 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all lg:hidden"
          aria-label="Open analysis panel"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Modals */}
      {selectedBusiness && (
        <BusinessDetail business={selectedBusiness} onClose={() => setSelectedBusiness(null)} onRecenter={handleRecenterMap} />
      )}

      {/* Floating AI button */}
      <button
        onClick={() => setShowAIAssistant((prev) => !prev)}
        className="hide-in-export fixed bottom-6 right-6 flex items-center gap-2 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all group"
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="hide-in-export max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300">
          Chat with AI
        </span>
      </button>
    </div>
  );
};

export default LocationAnalysis;

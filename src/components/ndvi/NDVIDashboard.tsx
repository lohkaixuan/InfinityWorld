// src/components/ndvi/NDVIDashboard.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid,
} from "recharts";
import { Leaf, Factory, Droplets, Activity, Calendar } from "lucide-react";
import type { NdviDataset } from "../../data/NDVI";

type Props = { data: NdviDataset };

const accentMap = {
  green: "from-emerald-500 to-emerald-600",
  orange: "from-amber-400 to-amber-500",
  blue: "from-sky-500 to-sky-600",
  red: "from-rose-500 to-rose-600",
} as const;

const iconFor = (label: string) => {
  if (/Vegetation/i.test(label)) return <Leaf className="w-5 h-5" />;
  if (/Urban/i.test(label)) return <Factory className="w-5 h-5" />;
  if (/Water/i.test(label)) return <Droplets className="w-5 h-5" />;
  return <Activity className="w-5 h-5" />;
};

const Card: React.FC<React.PropsWithChildren<{ className?: string; title?: string; actions?: React.ReactNode }>> =
({ className, title, actions, children }) => (
  <div className={`bg-white border border-gray-200 rounded-2xl p-4 ${className || ""}`}>
    {(title || actions) && (
      <div className="mb-3 flex items-center justify-between">
        {title ? <h3 className="text-sm font-semibold text-gray-900">{title}</h3> : <div />}
        {actions}
      </div>
    )}
    {children}
  </div>
);

const Kpi: React.FC<{ label: string; value: number; accent: keyof typeof accentMap }> = ({ label, value, accent }) => {
  const sign = value > 0 ? "+" : "";
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`rounded-xl p-2 text-white bg-gradient-to-br ${accentMap[accent]}`}>{iconFor(label)}</div>
        <div>
          <div className="text-xs text-gray-600">{label}</div>
          <div className="text-2xl font-bold text-gray-900">
            {sign}{Math.abs(value).toFixed(1)}<span className="text-gray-600 text-lg">%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Cross-fade before/after with autoplay + pause-on-hover. Exposes control via `playing` prop. */
const BeforeAfterFlip: React.FC<{
  beforeSrc: string; afterSrc: string; intervalMs?: number; className?: string; playing?: boolean;
  showAfterExternal?: boolean; onToggle?: () => void; setShowAfterExternal?: (v: boolean) => void;
}> = ({ beforeSrc, afterSrc, intervalMs = 1800, className, playing = true,
        showAfterExternal, onToggle, setShowAfterExternal }) => {
  const [showAfter, setShowAfter] = useState(false);
  const activeShowAfter = showAfterExternal ?? showAfter;
  const setActiveShowAfter = setShowAfterExternal ?? setShowAfter;
  const timerRef = useRef<number | null>(null);

  const start = () => {
    if (!playing) return;
    stop();
    timerRef.current = window.setInterval(() => setActiveShowAfter(!activeShowAfter), intervalMs);
  };
  const stop = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };

  useEffect(() => { stop(); if (playing) start(); return stop; /* eslint-disable-next-line */ }, [intervalMs, playing, activeShowAfter]);

  return (
    <div
      className={`relative w-full h-72 sm:h-80 lg:h-96 overflow-hidden rounded-xl ${className || ""}`}
      onMouseEnter={stop}
      onMouseLeave={() => playing && start()}
    >
      <img src={beforeSrc} alt="NDVI before"
           className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${activeShowAfter ? "opacity-0" : "opacity-100"}`} />
      <img src={afterSrc} alt="NDVI after"
           className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${activeShowAfter ? "opacity-100" : "opacity-0"}`} />

      {/* Controls */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <button type="button" onClick={() => setActiveShowAfter(false)}
                className={`px-3 py-1.5 text-sm rounded-full border ${!activeShowAfter ? "bg-white text-gray-900 border-gray-200 shadow" : "bg-white/80 text-gray-700 border-gray-200 hover:bg-white"}`}>
          Before
        </button>
        <button type="button" onClick={() => setActiveShowAfter(true)}
                className={`px-3 py-1.5 text-sm rounded-full border ${activeShowAfter ? "bg-white text-gray-900 border-gray-200 shadow" : "bg-white/80 text-gray-700 border-gray-200 hover:bg-white"}`}>
          After
        </button>
        <button type="button" onClick={onToggle ?? (() => setActiveShowAfter(!activeShowAfter))}
                className="px-3 py-1.5 text-sm rounded-full border bg-white/80 text-gray-700 border-gray-200 hover:bg-white" title="Toggle">
          Toggle
        </button>
      </div>
    </div>
  );
};

const NDVIDashboard: React.FC<Props> = ({ data }) => {
  const compareBars = data.ndviCompare.map((row) => ({
    label: row.label, Mean: row.mean, Median: row.median, "Max NDVI": row.max, "Min NDVI": row.min,
  }));

  // ▶ fullscreen state
  const [fsOpen, setFsOpen] = useState(false);
  const [fsShowAfter, setFsShowAfter] = useState(false);

  // lock body scroll when fullscreen open
  useEffect(() => {
    if (!fsOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [fsOpen]);

  // keyboard: Esc to close, arrows to switch
  useEffect(() => {
    if (!fsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFsOpen(false);
      if (e.key === "ArrowLeft") setFsShowAfter(false);
      if (e.key === "ArrowRight") setFsShowAfter(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fsOpen]);

  return (
    <div className="w-full min-h-full bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{data.title}</h2>
          <p className="text-gray-600 text-sm">{data.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{data.period}</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-5">
        {data.kpis.map((k) => (
          <Kpi key={k.label} label={k.label} value={k.value} accent={k.accent} />
        ))}
      </div>

      {/* Before / After with Fullscreen action */}
      <Card
        title="Before / After Preview"
        className="mx-5 mt-4"
        actions={
          <button
            type="button"
            onClick={() => { setFsOpen(true); }}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
            aria-label="Open fullscreen comparison"
          >
            Full screen
          </button>
        }
      >
        <BeforeAfterFlip
          beforeSrc="assets/before.png"
          afterSrc="assets/after.png"
          intervalMs={1800}
          playing={!fsOpen}  // pause autoplay while fullscreen is open
        />
      </Card>

      {/* Fullscreen modal */}
      {fsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setFsOpen(false); }}
        >
          <div className="relative w-full max-w-6xl">
            <button
              type="button"
              onClick={() => setFsOpen(false)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white text-sm"
            >
              ESC to close ✕
            </button>

            <BeforeAfterFlip
              beforeSrc="/before.png"
              afterSrc="/after.png"
              intervalMs={1600}
              className="h-[70vh] sm:h-[75vh] lg:h-[80vh]"  // big height in fullscreen
              playing={true}
              showAfterExternal={fsShowAfter}
              setShowAfterExternal={setFsShowAfter}
              onToggle={() => setFsShowAfter((v) => !v)}
            />
          </div>
        </div>
      )}

      {/* 2-up charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-5 mt-4">
        <Card title="Land Use Change Distribution">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.landUseDistribution}>
                <defs>
                  <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.15} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(0,0,0,.08)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "rgba(0,0,0,.6)" }} />
                <YAxis tick={{ fill: "rgba(0,0,0,.6)" }} />
                <Tooltip
                  contentStyle={{ background: "#ffffff", border: "1px solid rgba(0,0,0,.08)", borderRadius: 12 }}
                  labelStyle={{ color: "#111827" }}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#gradGreen)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="NDVI Values Comparison">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareBars}>
                <CartesianGrid stroke="rgba(0,0,0,.08)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "rgba(0,0,0,.6)" }} />
                <YAxis tick={{ fill: "rgba(0,0,0,.6)" }} domain={[-0.4, 1.2]} />
                <Tooltip
                  contentStyle={{ background: "#ffffff", border: "1px solid rgba(0,0,0,.08)", borderRadius: 12 }}
                  labelStyle={{ color: "#111827" }}
                />
                <Bar dataKey="Mean" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Median" fill="#a78bfa" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Max NDVI" fill="#22c55e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Min NDVI" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* bottom charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-5 mt-4 pb-6">
        <Card title="Net Change Overview">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.netChange}>
                <CartesianGrid stroke="rgba(0,0,0,.08)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "rgba(0,0,0,.6)" }} />
                <YAxis tick={{ fill: "rgba(0,0,0,.6)" }} />
                <Tooltip
                  contentStyle={{ background: "#ffffff", border: "1px solid rgba(0,0,0,.08)", borderRadius: 12 }}
                  labelStyle={{ color: "#111827" }}
                />
                <Bar dataKey="change" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Vegetation Trend Over Time">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.vegetationTrend}>
                <defs>
                  <linearGradient id="gradTeal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.15} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(0,0,0,.08)" vertical={false} />
                <XAxis dataKey="year" tick={{ fill: "rgba(0,0,0,.6)" }} />
                <YAxis tick={{ fill: "rgba(0,0,0,.6)" }} />
                <Tooltip
                  contentStyle={{ background: "#ffffff", border: "1px solid rgba(0,0,0,.08)", borderRadius: 12 }}
                  labelStyle={{ color: "#111827" }}
                />
                <Area type="monotone" dataKey="vegetationIndex" name="NDVI Index"
                      stroke="#14b8a6" fill="url(#gradTeal)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NDVIDashboard;

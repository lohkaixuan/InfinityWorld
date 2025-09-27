// src/components/ndvi/NDVIDashboard.tsx
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { Leaf, Factory, Droplets, Activity, Calendar } from "lucide-react";
import type { NdviDataset } from "../../data/mockNDVI";

type Props = { data: NdviDataset };

const accentMap = {
  green: "from-emerald-500 to-emerald-600",
  orange: "from-amber-400 to-amber-500",
  blue: "from-sky-500 to-sky-600",
  red: "from-rose-500 to-rose-600",
};

const iconFor = (label: string) => {
  if (/Vegetation/i.test(label)) return <Leaf className="w-5 h-5" />;
  if (/Urban/i.test(label)) return <Factory className="w-5 h-5" />;
  if (/Water/i.test(label)) return <Droplets className="w-5 h-5" />;
  return <Activity className="w-5 h-5" />;
};

const Card: React.FC<
  React.PropsWithChildren<{ className?: string; title?: string }>
> = ({ className, title, children }) => (
  <div
    className={`bg-white border border-gray-200 rounded-2xl p-4 ${className || ""}`}
  >
    {title && (
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
    )}
    {children}
  </div>
);

const Kpi: React.FC<{
  label: string;
  value: number;
  accent: keyof typeof accentMap;
}> = ({ label, value, accent }) => {
  const sign = value > 0 ? "+" : "";
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`rounded-xl p-2 text-white bg-gradient-to-br ${accentMap[accent]}`}>
          {iconFor(label)}
        </div>
        <div>
          <div className="text-xs text-gray-600">{label}</div>
          <div className="text-2xl font-bold text-gray-900">
            {sign}
            {Math.abs(value).toFixed(1)}
            <span className="text-gray-600 text-lg">%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const NDVIDashboard: React.FC<Props> = ({ data }) => {
  const compareBars = data.ndviCompare.map((row) => ({
    label: row.label,
    Mean: row.mean,
    Median: row.median,
    "Max NDVI": row.max,
    "Min NDVI": row.min,
  }));

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

      {/* 2-up charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-5 mt-4">
        {/* Land Use Change Distribution */}
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
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid rgba(0,0,0,.08)",
                    borderRadius: 12,
                  }}
                  labelStyle={{ color: "#111827" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  fill="url(#gradGreen)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* NDVI Values Comparison */}
        <Card title="NDVI Values Comparison">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareBars}>
                <CartesianGrid stroke="rgba(0,0,0,.08)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "rgba(0,0,0,.6)" }} />
                <YAxis tick={{ fill: "rgba(0,0,0,.6)" }} domain={[-0.4, 1.2]} />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid rgba(0,0,0,.08)",
                    borderRadius: 12,
                  }}
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

      {/* 2-up charts bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-5 mt-4 pb-6">
        {/* Net Change Overview */}
        <Card title="Net Change Overview">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.netChange}>
                <CartesianGrid stroke="rgba(0,0,0,.08)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "rgba(0,0,0,.6)" }} />
                <YAxis tick={{ fill: "rgba(0,0,0,.6)" }} />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid rgba(0,0,0,.08)",
                    borderRadius: 12,
                  }}
                  labelStyle={{ color: "#111827" }}
                />
                <Bar dataKey="change" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Vegetation Trend Over Time */}
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
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid rgba(0,0,0,.08)",
                    borderRadius: 12,
                  }}
                  labelStyle={{ color: "#111827" }}
                />
                <Area
                  type="monotone"
                  dataKey="vegetationIndex"
                  name="NDVI Index"
                  stroke="#14b8a6"
                  fill="url(#gradTeal)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NDVIDashboard;

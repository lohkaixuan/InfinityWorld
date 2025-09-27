// src/data/Ndvi.ts
export type NdviKpi = {
  label: string;
  value: number;      // percentage (e.g., 24.1 means +24.1%)
  accent: "green" | "orange" | "blue" | "red";
};

export type NdviDistributionPoint = {
  label: string;
  value: number;
};

export type NdviBarCompare = {
  label: string;
  mean: number;
  median: number;
  max: number;
  min: number;
};

export type NdviTrendPoint = {
  year: number;
  vegetationIndex: number;
};

export interface NdviDataset {
  title: string;
  subtitle: string;
  period: string; // e.g. "2020-01-30 → 2023-01-09"
  kpis: NdviKpi[];
  landUseDistribution: NdviDistributionPoint[];
  ndviCompare: NdviBarCompare[];
  netChange: { label: string; change: number }[];
  vegetationTrend: NdviTrendPoint[];
}

export const Ndvi: NdviDataset = {
  title: "Development Vegetation Analysis",
  subtitle: "Satellite-powered vegetation change detection for sample AOI",
  period: "2020-01-30 → 2023-01-09",
  kpis: [
    { label: "Total Change",      value: 122.9, accent: "orange" },
    { label: "Vegetation Change", value: 24.1,  accent: "green"  },
    { label: "Urban Change",      value: -20.4, accent: "blue"   },
    { label: "Water Change",      value: -33.9, accent: "red"    },
  ],
  landUseDistribution: [
    { label: "Vegetation Gain", value: 32 },
    { label: "Vegetation Loss", value: 12 },
    { label: "Urbanization",    value: 8  },
    { label: "Urban Loss",      value: 19 },
    { label: "Water Gain",      value: 28 },
    { label: "Water Loss",      value: 10 },
  ],
  ndviCompare: [
    { label: "Mean NDVI",   mean: 0.28, median: 0.15, max: 0.92, min: -0.35 },
    { label: "Median NDVI", mean: 0.32, median: 0.18, max: 1.05, min: -0.40 },
    { label: "Max NDVI",    mean: 0.25, median: 0.12, max: 0.98, min: -0.28 },
    { label: "Min NDVI",    mean: 0.10, median: 0.05, max: 0.22, min: -0.22 },
  ],
  netChange: [
    { label: "Vegetation Change", change: 24 },
    { label: "Urban Change",      change: -20 },
    { label: "Water Change",      change: -34 },
  ],
  vegetationTrend: [
    { year: 2020, vegetationIndex: 24.3 },
    { year: 2021, vegetationIndex: 26.1 },
    { year: 2022, vegetationIndex: 27.8 },
    { year: 2023, vegetationIndex: 29.5 },
  ],
};

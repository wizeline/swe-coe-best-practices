"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_SERIES_COLORS } from "@/components/charts/chartTheme";

interface PillarAveragesChartProps {
  pillars: Array<{ id: string; label: string; average: number }>;
  title?: string;
  description?: string;
}

export function PillarAveragesChart({
  pillars,
  title = "Org Pillar Averages",
  description = "Average pillar score across the filtered teams.",
}: PillarAveragesChartProps) {
  const hasData = pillars.length > 0;

  return (
    <article className="card results-content-card chart-card" data-testid="pillar-averages-chart">
      <div className="chart-card-header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      {!hasData ? (
        <p className="chart-empty-state">No pillar averages are available yet.</p>
      ) : (
        <>
          <div className="chart-frame chart-frame--tall">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pillars} layout="vertical" margin={{ top: 12, right: 12, bottom: 0, left: 32 }}>
                <CartesianGrid stroke={CHART_SERIES_COLORS.surfaceStroke} strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 4]} tickLine={false} axisLine={false} />
                <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} width={132} />
                <Tooltip formatter={(value) => `${Number(value).toFixed(2)} / 4.00`} />
                <Bar dataKey="average" fill={CHART_SERIES_COLORS.primary} radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-metric-list" aria-label="pillar averages summary">
            {pillars.map((pillar) => (
              <div key={pillar.id} className="chart-metric-item">
                <span className="chart-metric-label">{pillar.label}</span>
                <strong>{pillar.average.toFixed(2)} / 4.00</strong>
              </div>
            ))}
          </div>
        </>
      )}
    </article>
  );
}
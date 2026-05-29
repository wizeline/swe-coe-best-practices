"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { CHART_SERIES_COLORS } from "@/components/charts/chartTheme";

interface PillarRadarChartProps {
  pillars: Array<{ id: string; label: string; teamAvg: number; orgAvg: number }>;
  title?: string;
  description?: string;
}

export function PillarRadarChart({
  pillars,
  title = "Team vs Org Baseline",
  description = "Compare the current team to the all-time org average by pillar.",
}: PillarRadarChartProps) {
  const hasData = pillars.length > 0;

  return (
    <article className="card results-content-card chart-card chart-card--wide" data-testid="pillar-radar-chart">
      <div className="chart-card-header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      {!hasData ? (
        <p className="chart-empty-state">No team or org baseline data is available yet.</p>
      ) : (
        <>
          <div className="chart-frame chart-frame--radar">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={pillars} outerRadius="72%">
                <PolarGrid stroke={CHART_SERIES_COLORS.surfaceStroke} />
                <PolarAngleAxis dataKey="label" tick={{ fill: "#1a1a1a", fontSize: 12 }} />
                <Tooltip formatter={(value) => `${Number(value).toFixed(2)} / 4.00`} />
                <Radar
                  name="Team"
                  dataKey="teamAvg"
                  stroke={CHART_SERIES_COLORS.primary}
                  fill={CHART_SERIES_COLORS.primary}
                  fillOpacity={0.24}
                />
                <Radar
                  name="Org"
                  dataKey="orgAvg"
                  stroke={CHART_SERIES_COLORS.secondary}
                  fill={CHART_SERIES_COLORS.secondary}
                  fillOpacity={0.1}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-metric-list chart-metric-list--dual" aria-label="team versus org summary">
            {pillars.map((pillar) => (
              <div key={pillar.id} className="chart-metric-item chart-metric-item--dual">
                <span className="chart-metric-label">{pillar.label}</span>
                <strong>
                  Team {pillar.teamAvg.toFixed(2)} · Org {pillar.orgAvg.toFixed(2)}
                </strong>
              </div>
            ))}
          </div>
        </>
      )}
    </article>
  );
}
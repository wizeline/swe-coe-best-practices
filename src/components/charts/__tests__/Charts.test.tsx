import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  PillarAveragesChart,
  PillarRadarChart,
  ScoreLevelDistribution,
  TeamRankingChart,
} from "@/components/charts";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("chart components", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
      true;
    vi.stubGlobal("ResizeObserver", ResizeObserver);
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      get: () => 960,
    });
    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      get: () => 320,
    });
    HTMLElement.prototype.getBoundingClientRect = () =>
      ({
        width: 960,
        height: 320,
        top: 0,
        left: 0,
        right: 960,
        bottom: 320,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;
    container = document.createElement("div");
    container.style.width = "960px";
    container.style.height = "720px";
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.unstubAllGlobals();
  });

  it("renders score level distribution and groups counts correctly", async () => {
    await act(async () => {
      root.render(
        <ScoreLevelDistribution
          sessions={[
            { scoreLevel: "Foundational" },
            { scoreLevel: "Foundational" },
            { scoreLevel: "Optimized" },
          ]}
        />
      );
    });

    expect(container.textContent).toContain("Score Level Distribution");
    expect(container.textContent).toContain("Foundational");
    expect(container.textContent).toContain("2");
    expect(container.textContent).toContain("Optimized");
  });

  it("renders empty states for each chart component", async () => {
    await act(async () => {
      root.render(
        <div>
          <ScoreLevelDistribution sessions={[]} />
          <PillarAveragesChart pillars={[]} />
          <TeamRankingChart teams={[]} />
          <PillarRadarChart pillars={[]} />
        </div>
      );
    });

    expect(container.textContent).toContain("No teams match the current filter.");
    expect(container.textContent).toContain("No pillar averages are available yet.");
    expect(container.textContent).toContain("No filtered teams are available for ranking.");
    expect(container.textContent).toContain("No team or org baseline data is available yet.");
  });

  it("renders pillar averages, ranking, and radar charts with data", async () => {
    await act(async () => {
      root.render(
        <div>
          <PillarAveragesChart
            pillars={[
              { id: "p1", label: "Testing", average: 2.5 },
              { id: "p2", label: "CI/CD", average: 3.25 },
            ]}
          />
          <TeamRankingChart
            teams={[
              {
                name: "Beta",
                averageTotalScore: 35,
                maxScore: 48,
                scoreLevel: "Optimized",
              },
              {
                name: "Alpha",
                averageTotalScore: 22,
                maxScore: 48,
                scoreLevel: "Disciplined",
              },
            ]}
          />
          <PillarRadarChart
            pillars={[
              { id: "p1", label: "Testing", teamAvg: 2.5, orgAvg: 3 },
              { id: "p2", label: "CI/CD", teamAvg: 3.25, orgAvg: 2.75 },
            ]}
          />
        </div>
      );
    });

    expect(container.textContent).toContain("Org Pillar Averages");
    expect(container.textContent).toContain("Testing");
    expect(container.textContent).toContain("Team Ranking");
    expect(container.textContent).toContain("Beta");
    expect(container.textContent).toContain("Team vs Org Baseline");
    expect(container.textContent).toContain("Team 2.50 · Org 3.00");
  });
});
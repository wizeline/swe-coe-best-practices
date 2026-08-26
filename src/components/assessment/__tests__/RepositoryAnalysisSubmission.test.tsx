import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RepositoryAnalysisSubmission } from "@/components/assessment/RepositoryAnalysisSubmission";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const promptContent = `# Prompt\n\nUse this`;

describe("RepositoryAnalysisSubmission", () => {
  let container: HTMLDivElement;
  let root: Root;
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
      true;
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    pushMock.mockReset();
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("renders the prompt inside a collapsible section", async () => {
    await act(async () => {
      root.render(<RepositoryAnalysisSubmission promptContent={promptContent} />);
    });

    const summary = container.querySelector("details summary");
    const promptTextarea = container.querySelector(
      "textarea[aria-label='Repository analysis prompt']"
    ) as HTMLTextAreaElement | null;

    expect(summary?.textContent).toBe("Open Prompt");
    expect(promptTextarea?.value).toContain("# Prompt");
  });

  it("copies the prompt to the clipboard", async () => {
    await act(async () => {
      root.render(<RepositoryAnalysisSubmission promptContent={promptContent} />);
    });

    const copyButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Copy Prompt"
    );
    expect(copyButton).toBeDefined();

    await act(async () => {
      copyButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(writeText).toHaveBeenCalledWith(promptContent);
    expect(container.textContent).toContain("Prompt copied to clipboard.");
  });

  it("displays score and level locally when valid JSON is submitted and redirects to dashboard", async () => {
    await act(async () => {
      root.render(<RepositoryAnalysisSubmission promptContent={promptContent} />);
    });

    const jsonTextarea = container.querySelector(
      "textarea.json-textarea:not(.prompt-textarea)"
    ) as HTMLTextAreaElement | null;
    expect(jsonTextarea).not.toBeNull();

    await act(async () => {
      if (jsonTextarea) {
        const setValue = Object.getOwnPropertyDescriptor(
          HTMLTextAreaElement.prototype,
          "value"
        )?.set;
        setValue?.call(
          jsonTextarea,
          '{"analysis":{"pillars":{},"raw_score":28,"score_level":"Optimized"}}'
        );
        jsonTextarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });

    const submitButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Submit Analysis"
    );

    await act(async () => {
      submitButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(container.textContent).toContain("Score: 28");
    expect(container.textContent).toContain("Optimized");
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });

  it("parses pillar questions, calculates score, and navigates to dashboard", async () => {
    await act(async () => {
      root.render(<RepositoryAnalysisSubmission promptContent={promptContent} />);
    });

    const jsonTextarea = container.querySelector(
      "textarea.json-textarea:not(.prompt-textarea)"
    ) as HTMLTextAreaElement | null;

    const sampleJson = JSON.stringify({
      analysis: {
        pillars: {
          p1: {
            questions: [
              { id: "p1-q1", score: 3 },
              { id: "p1-q2", score: 3 },
              { id: "p1-q3", score: 3 },
            ],
          },
        },
      },
    });

    await act(async () => {
      if (jsonTextarea) {
        const setValue = Object.getOwnPropertyDescriptor(
          HTMLTextAreaElement.prototype,
          "value"
        )?.set;
        setValue?.call(jsonTextarea, sampleJson);
        jsonTextarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });

    const submitButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Submit Analysis"
    );

    await act(async () => {
      submitButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(pushMock).toHaveBeenCalledWith("/dashboard");
    const stored = localStorage.getItem("assessment-result");
    expect(stored).not.toBeNull();
    if (stored) {
      const parsedStored = JSON.parse(stored);
      expect(parsedStored.answers["p1-q1"]).toBe(3);
    }
  });

  it("shows error when JSON is missing required fields", async () => {
    await act(async () => {
      root.render(<RepositoryAnalysisSubmission promptContent={promptContent} />);
    });

    const jsonTextarea = container.querySelector(
      "textarea.json-textarea:not(.prompt-textarea)"
    ) as HTMLTextAreaElement | null;

    await act(async () => {
      if (jsonTextarea) {
        const setValue = Object.getOwnPropertyDescriptor(
          HTMLTextAreaElement.prototype,
          "value"
        )?.set;
        setValue?.call(jsonTextarea, '{"analysis":{}}');
        jsonTextarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });

    const submitButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Submit Analysis"
    );

    await act(async () => {
      submitButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(container.textContent).toContain("Invalid JSON format");
  });
});

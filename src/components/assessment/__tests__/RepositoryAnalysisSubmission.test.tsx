import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RepositoryAnalysisSubmission } from "@/components/assessment/RepositoryAnalysisSubmission";

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

  it("displays score and level locally when valid JSON is submitted", async () => {
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

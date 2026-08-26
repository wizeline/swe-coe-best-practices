import { describe, expect, it, vi } from "vitest";
import NotFound from "@/app/not-found";

const redirectMock = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: (url: string) => redirectMock(url),
}));

describe("NotFound Page", () => {
  it("redirects to /dashboard", () => {
    NotFound();
    expect(redirectMock).toHaveBeenCalledWith("/dashboard");
  });
});

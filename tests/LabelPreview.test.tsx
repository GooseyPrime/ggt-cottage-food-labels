// @vitest-environment jsdom

import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { DEMO_UNLOCK_EVENT, UNLOCK_STORAGE_KEY } from "@/lib/config";
import { LabelPreview } from "@/app/components/LabelPreview";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

function setInputValue(input: HTMLInputElement, value: string) {
  const descriptor = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  );
  descriptor?.set?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

describe("LabelPreview", () => {
  let container: HTMLDivElement | null = null;
  let root: Root | null = null;

  afterEach(() => {
    if (root) {
      act(() => {
        root?.unmount();
      });
    }
    root = null;
    container?.remove();
    container = null;
    localStorage.clear();
    document.body.innerHTML = "";
  });

  it("preserves entered fields when demo unlock is triggered", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      root?.render(<LabelPreview />);
    });

    const producerInput = container.querySelector(
      'input[placeholder="Your name / bakery"]',
    ) as HTMLInputElement;
    const productInput = container.querySelector(
      'input[placeholder="Chocolate chip cookies"]',
    ) as HTMLInputElement;
    const preview = container.querySelector(
      '[aria-label="TN label preview"]',
    ) as HTMLDivElement;
    act(() => {
      setInputValue(producerInput, "Test Bakery");
      setInputValue(productInput, "Brownies");
    });

    expect(preview.className).toContain("ggt-label-sheet--locked");
    expect(producerInput.value).toBe("Test Bakery");
    expect(productInput.value).toBe("Brownies");
    expect(container.textContent).toContain("Test Bakery");

    act(() => {
      localStorage.setItem(UNLOCK_STORAGE_KEY, "1");
      window.dispatchEvent(new Event(DEMO_UNLOCK_EVENT));
    });

    const producerInputAfterUnlock = container.querySelector(
      'input[placeholder="Your name / bakery"]',
    ) as HTMLInputElement;
    const productInputAfterUnlock = container.querySelector(
      'input[placeholder="Chocolate chip cookies"]',
    ) as HTMLInputElement;

    expect(preview.className).not.toContain("ggt-label-sheet--locked");
    expect(producerInputAfterUnlock.value).toBe("Test Bakery");
    expect(productInputAfterUnlock.value).toBe("Brownies");
    expect(container.textContent).toContain("Test Bakery");
  });
});

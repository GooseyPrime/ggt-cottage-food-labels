import { afterEach, describe, expect, it, vi } from "vitest";
import { startSale, verifySale } from "@/lib/payments";

const original = { ...process.env };

afterEach(() => {
  process.env = { ...original };
  vi.unstubAllGlobals();
});

function stubFetch(status: number, body: unknown) {
  const fn = vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));
  vi.stubGlobal("fetch", fn);
  return fn;
}

describe("startSale", () => {
  it("posts the cottage-food-labels product with the tool url to the shop desk", async () => {
    process.env.NEXT_PUBLIC_SHOP_ORIGIN = "https://shop.example.com/";
    const fn = stubFetch(200, { ok: true, url: "https://checkout.stripe.com/c/x", sessionId: "cs_1" });
    expect(await startSale()).toEqual({
      ok: true,
      checkoutUrl: "https://checkout.stripe.com/c/x",
      sessionId: "cs_1",
    });
    const [url, init] = fn.mock.calls[0];
    expect(url).toBe("https://shop.example.com/api/sale");
    expect(JSON.parse(init.body)).toEqual({
      url: "https://shop.example.com/tools/cottage-food-labels",
      product: "cottage-food-labels",
      toolId: "cottage-food-labels",
    });
  });

  it("surfaces a shop refusal", async () => {
    stubFetch(400, { ok: false, message: "Unknown product." });
    expect(await startSale()).toEqual({ ok: false, message: "Unknown product." });
  });

  it("reports an unreachable shop", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("down")));
    expect((await startSale()).ok).toBe(false);
  });
});

describe("verifySale", () => {
  it("is paid only for ok + paid + matching product", async () => {
    stubFetch(200, { ok: true, paid: true, product: "cottage-food-labels" });
    expect((await verifySale("cs_1")).paid).toBe(true);
  });

  it("rejects a paid session for another product", async () => {
    stubFetch(200, { ok: true, paid: true, product: "chat-to-pdf" });
    const result = await verifySale("cs_1");
    expect(result.paid).toBe(false);
    expect(result.message).toMatch(/different product/);
  });

  it("rejects a response with no product", async () => {
    stubFetch(200, { ok: true, paid: true });
    expect((await verifySale("cs_1")).paid).toBe(false);
  });

  it.each(["productId", "toolId"])("requires product even when %s matches", async (field) => {
    stubFetch(200, { ok: true, paid: true, [field]: "cottage-food-labels" });
    expect((await verifySale("cs_1")).paid).toBe(false);
  });

  it("rejects an unpaid session", async () => {
    stubFetch(402, { ok: false, paid: false, message: "Payment not completed." });
    expect((await verifySale("cs_1")).message).toBe("Payment not completed.");
  });

  it("rejects a missing id without calling the shop", async () => {
    const fn = stubFetch(200, {});
    expect((await verifySale("")).paid).toBe(false);
    expect(fn).not.toHaveBeenCalled();
  });
});

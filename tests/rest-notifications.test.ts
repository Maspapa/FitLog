import { afterEach, describe, expect, it, vi } from "vitest";
import { showRestNotification } from "../lib/rest-notifications";

afterEach(() => { vi.unstubAllGlobals(); });

function browser(permission = "granted") {
  const showNotification = vi.fn().mockResolvedValue(undefined);
  const register = vi.fn().mockResolvedValue({});
  vi.stubGlobal("window", { isSecureContext: true });
  vi.stubGlobal("Notification", { permission });
  vi.stubGlobal("navigator", { serviceWorker: { register, ready: Promise.resolve({ showNotification }) } });
  return { register, showNotification };
}

describe("rest notifications", () => {
  it("uses service-worker notifications for mobile browsers", async () => {
    const { register, showNotification } = browser();
    expect(await showRestNotification()).toBe(true);
    expect(register).toHaveBeenCalledWith("/rest-notifications-sw.js");
    expect(showNotification).toHaveBeenCalledWith("FitLog · 休息结束", expect.objectContaining({ tag: "fitlog-rest-timer", renotify: true }));
  });
  it("does not register or ask permission at timer expiry when permission is denied", async () => {
    const { register, showNotification } = browser("denied");
    expect(await showRestNotification()).toBe(false);
    expect(register).not.toHaveBeenCalled();
    expect(showNotification).not.toHaveBeenCalled();
  });
  it("drops a stale reminder after reset or restart", async () => {
    const { showNotification } = browser();
    expect(await showRestNotification(() => false)).toBe(false);
    expect(showNotification).not.toHaveBeenCalled();
  });
  it("returns a visible-fallback result when notification delivery fails", async () => {
    const { showNotification } = browser();
    showNotification.mockRejectedValue(new Error("blocked"));
    expect(await showRestNotification()).toBe(false);
  });
  it("handles browsers without notification support", async () => {
    browser();
    vi.stubGlobal("Notification", undefined);
    expect(await showRestNotification()).toBe(false);
  });
});

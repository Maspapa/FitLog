export function supportsRestNotifications(): boolean {
  return typeof Notification !== "undefined" && "serviceWorker" in navigator && window.isSecureContext;
}

export async function showRestNotification(isCurrent = () => true): Promise<boolean> {
  if (!supportsRestNotifications() || Notification.permission !== "granted") return false;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    await navigator.serviceWorker.register("/rest-notifications-sw.js");
    const registration = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise<never>((_, reject) => { timeout = setTimeout(() => reject(new Error("Notification setup timed out")), 8000); }),
    ]);
    if (!isCurrent()) return false;
    const options: NotificationOptions & { renotify: boolean } = {
      body: "可以开始下一组了",
      tag: "fitlog-rest-timer",
      renotify: true,
    };
    await registration.showNotification("FitLog · 休息结束", options);
    return true;
  } catch { return false; }
  finally { if (timeout) clearTimeout(timeout); }
}

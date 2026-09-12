if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/cripto-dashboard/sw.js").catch(() => {
      // Offline support is optional; the dashboard continues to work without it.
    });
  });
}

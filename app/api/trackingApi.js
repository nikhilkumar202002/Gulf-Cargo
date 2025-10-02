// trackingApi.js
export async function fetchTrackingData(code) {
  try {
    const url = `https://api.gulfcargoksa.com/public/api/track/${encodeURIComponent(code)}`;

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      try {
        const j = text ? JSON.parse(text) : {};
        throw new Error(j?.error || j?.message || `Failed (${res.status})`);
      } catch {
        throw new Error(text || `Failed (${res.status})`);
      }
    }

    return await res.json();
  } catch (error) {
    throw new Error(error.message || "Failed to fetch tracking data");
  }
}

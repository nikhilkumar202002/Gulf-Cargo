// trackingApi.js

async function request(url) {
  try {
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

/** Existing: track by cargo/awb code */
export async function fetchTrackingData(code) {
  const url = `https://developmentapi.gulfcargoksa.com/public/api/track/${encodeURIComponent(code)}`;
  return request(url);
}

/** NEW: track by physical bill invoice number (e.g., "INV-2025-3109") */
export async function fetchTrackingByInvoice(invoiceNo) {
  const url = `https://developmentapi.gulfcargoksa.com/public/api/tracks/${encodeURIComponent(invoiceNo)}`;
  return request(url);
}

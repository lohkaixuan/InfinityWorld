// utils/maps.ts
export const googleMapsPlaceUrl = (b: { position?: { lat: number; lng: number }, address?: string }) => {
  if (b?.position) {
    const { lat, lng } = b.position;
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  const q = encodeURIComponent(b?.address ?? '');
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
};

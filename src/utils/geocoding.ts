// utils/geocoding.ts
import type { Location } from '../types';

/**
 * Geocode a freeform address string to {lat, lng, address}.
 * Requires the Google Maps JS API to be loaded (your useGoogleMaps hook).
 */
export async function geocodeLocation(address: string): Promise<Location | null> {
  return new Promise<Location | null>((resolve) => {
    const g = (window as any).google as typeof google | undefined;

    if (!g?.maps) {
      console.warn('[geocodeLocation] Google Maps not loaded');
      resolve(null);
      return;
    }

    const geocoder = new g.maps.Geocoder();

    geocoder.geocode(
      { address },
      (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        if (status === g.maps.GeocoderStatus.OK && results && results[0]) {
          const loc = results[0].geometry.location;

          // geometry.location can be a LatLng object with .lat()/.lng()
          const lat = typeof loc.lat === 'function' ? loc.lat() : (loc as any).lat;
          const lng = typeof loc.lng === 'function' ? loc.lng() : (loc as any).lng;

          resolve({
            lat,
            lng,
            address: results[0].formatted_address,
          });
        } else {
          console.warn('[geocodeLocation] Geocode failed:', status);
          resolve(null);
        }
      }
    );
  });
}

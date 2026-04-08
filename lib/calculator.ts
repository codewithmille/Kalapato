/**
 * Calculates the speed in meters per minute (m/min).
 * @param distanceKm Distance in kilometers.
 * @param releaseTime Date when the bird was released.
 * @param arrivalTime Date when the bird arrived.
 * @returns Speed in m/min.
 */
export function calculateSpeed(
  distanceKm: number,
  releaseTime: Date,
  arrivalTime: Date
): number {
  const distanceMeters = distanceKm * 1000;
  const flightMs = arrivalTime.getTime() - releaseTime.getTime();
  const flightMinutes = flightMs / 60000;
  
  if (flightMinutes <= 0) return 0;
  
  return distanceMeters / flightMinutes;
}

/**
 * Calculates the great-circle distance between two points on a sphere
 * using the Haversine formula.
 * @returns Distance in kilometers.
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * Formats speed for display.
 */
export function formatSpeed(speed: number): string {
  return speed.toLocaleString(undefined, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

/**
 * Formats distance for display.
 */
export function formatDistance(distance: number): string {
  return distance.toLocaleString(undefined, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

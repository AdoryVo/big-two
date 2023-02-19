// Make an object serializable to JSON.
//
// Useful to convert an object which may contain non-serializeable data such as
// Dates to an object that doesn't
export function makeSerializable<T> (o: T): T {
  return JSON.parse(JSON.stringify(o))
}

export interface Coords {
  lat: number,
  lng: number,
}

export function parseCoords(
  lat: string | string[] | undefined,
  lng: string | string[] | undefined
): Coords | null {
  // Coordinates should be strings
  if (typeof lat !== 'string' || typeof lng !== 'string') {
    return null
  }

  const coords: Coords = {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
  }

  // Coordinates must be valid numbers
  if (!isFinite(coords.lat) || !isFinite(coords.lng)) return null

  // Lat must be in [-90, 90], lng must be in [-180, 180)
  if (coords.lat < -90 || coords.lat > 90) return null
  if (coords.lng < -180 || coords.lng >= 180) return null

  return coords
}

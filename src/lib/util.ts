// Make an object serializable to JSON.
//
// Useful to convert an object which may contain non-serializeable data such as
// Dates to an object that doesn't
export function makeSerializable<T> (o: T): T {
  return JSON.parse(JSON.stringify(o))
}

export function parseCoords(
  lat: string | string[] | undefined,
  lng: string | string[] | undefined
): [number, number] | undefined {
  // Coordinates should be strings
  if (typeof lat !== 'string' || typeof lng !== 'string') {
    return undefined
  }

  const coords: [number, number] = [parseFloat(lat), parseFloat(lng)]

  // Coordinates must be valid numbers
  if (!coords.every(isFinite)) return undefined

  // Lat must be in [-90, 90], lng must be in [-180, 180)
  if (coords[0] < -90 || coords[0] > 90) return undefined
  if (coords[1] < -180 || coords[1] >= 180) return undefined

  return coords
}

export class Location {
  private constructor(
    public readonly latitude: number,
    public readonly longitude: number,
  ) {}

  static at(latitude: number, longitude: number) {
    return new Location(latitude, longitude);
  }

  distanceTo(other: Location): number {
    const earthRadiusKm = 6371;

    // Convert latitude and longitude from degrees to radians
    const lat1Rad = toRadians(this.latitude);
    const lat2Rad = toRadians(other.latitude);
    const deltaLat = toRadians(other.latitude - this.latitude);
    const deltaLng = toRadians(other.longitude - this.longitude);

    // Haversine formula
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(deltaLng / 2) *
        Math.sin(deltaLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
  }
}

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

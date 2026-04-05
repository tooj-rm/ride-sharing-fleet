import { describe, expect, it } from 'vitest';
import { Location } from '~/entities/location';

describe('Location', () => {
  it('should create a location with correct initial state', () => {
    const location = Location.at(0, 0);

    expect(location).toBeDefined();
    expect(location.latitude).toBe(0);
    expect(location.longitude).toBe(0);
  });

  it('should calculate distance between two locations', () => {
    const location1 = Location.at(0, 0);
    const location2 = Location.at(0.1, 0);

    const distance = location1.distanceTo(location2);
    expect(distance).toBeCloseTo(11.1, 1);
  });
});

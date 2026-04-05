import { describe, expect, it } from 'vitest';
import { Driver } from '~/driver';

describe('Driver', () => {
  it.each([
    ['', 'Jane Doe'],
    [' 1234 ', 'John Doe'],
    ['      ', 'John Doe'],
  ])('A driver cannot be created with an invalid driver ID', (id, name) => {
    expect(() => Driver.register(id, name)).toThrow(
      'Driver ID must be at least 5 characters',
    );
  });

  it.each([
    ['driver123', ''],
    ['driver123', 'J '],
    ['driver123', '  '],
  ])('A driver cannot be created with an invalid name', (id, name) => {
    expect(() => Driver.register(id, name)).toThrow(
      'Driver name must be at least 2 characters',
    );
  });

  it('should create a valid driver with correct initial state', () => {
    const driver = Driver.register('driver123', 'John Doe');

    expect(driver).toBeDefined();
    expect(driver.id).toBe('driver123');
    expect(driver.name).toBe('John Doe');
    expect(driver.status).toBe('available');
    expect(driver.earnings).toBe(0);
  });
});

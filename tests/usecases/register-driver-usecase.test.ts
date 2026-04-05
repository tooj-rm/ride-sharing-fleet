import { describe, it, expect, beforeEach } from 'vitest';
import { mock, MockProxy } from 'vitest-mock-extended';
import { Driver } from '~/domain/entities';
import { RegisterDriverUseCase } from '~/application/usecases';
import { DriverRepository } from '~/domain/repositories';

describe('RegisterDriverUseCase', () => {
  let driverRepository: MockProxy<DriverRepository>;
  let useCase: RegisterDriverUseCase;

  beforeEach(() => {
    driverRepository = mock<DriverRepository>();
    useCase = new RegisterDriverUseCase(driverRepository);
  });

  it('should register a new driver successfully', async () => {
    driverRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute({ id: 'driver123', name: 'John Doe' });

    expect(driverRepository.findById).toHaveBeenCalledWith('driver123');
    expect(driverRepository.save).toHaveBeenCalledTimes(1);
    expect(result.id).toBe('driver123');
    expect(result.name).toBe('John Doe');
    expect(result.status).toBe('available');
  });

  it('should throw error when driver ID is invalid', async () => {
    await expect(
      useCase.execute({ id: 'ab', name: 'John Doe' }),
    ).rejects.toThrow('Driver ID must be at least 5 characters');

    expect(driverRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error when driver name is invalid', async () => {
    await expect(
      useCase.execute({ id: 'driver123', name: 'J' }),
    ).rejects.toThrow('Driver name must be at least 2 characters');

    expect(driverRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error when driver already exists', async () => {
    const existingDriver = { id: 'driver123', name: 'John Doe' } as Driver;
    driverRepository.findById.mockResolvedValue(existingDriver);

    await expect(
      useCase.execute({ id: 'driver123', name: 'John Doe' }),
    ).rejects.toThrow('Driver already registered');

    expect(driverRepository.save).not.toHaveBeenCalled();
  });
});

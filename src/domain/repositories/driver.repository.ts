import { Driver } from '~/domain/entities';

export interface DriverRepository {
  findById(id: string): Promise<Driver | null>;

  save(driver: Driver): Promise<void>;
}

import { DriverRepository } from '~/domain/repositories';
import { Driver } from '~/domain/entities';

type RegisterDriverInput = {
  id: string;
  name: string;
};

export class RegisterDriverUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  async execute({ id, name }: RegisterDriverInput): Promise<Driver> {
    let driver = await this.driverRepository.findById(id);
    if (driver) {
      throw new Error('Driver already registered');
    }

    driver = Driver.register(id, name);
    await this.driverRepository.save(driver);

    return driver;
  }
}

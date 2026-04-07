import { DriverRepository } from '~/domain/repositories';
import { Driver } from '~/domain/entities';
import { EventPublisher } from '~/domain/events';
import { DriverAlreadyRegistered } from '~/domain/exceptions';

export class RegisterDriverUseCase {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ id, name }: RegisterDriverInput): Promise<Driver> {
    let driver = await this.driverRepository.findById(id);
    if (driver) {
      throw new DriverAlreadyRegistered();
    }

    driver = Driver.register(id, name);
    await this.driverRepository.save(driver);
    await this.eventPublisher.publish(driver.releaseEvents());

    return driver;
  }
}

type RegisterDriverInput = {
  id: string;
  name: string;
};

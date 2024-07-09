import { Provider } from '@app/entities/user.entity';

export class CreateUserDto {
  provider: Provider;
  providerId: string;
  name: string;
  email: string;
}

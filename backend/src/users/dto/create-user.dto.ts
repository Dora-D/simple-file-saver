import { Provider } from '@app/entities/user.entity';
import { Contains, IsString } from 'class-validator';

export class CreateUserDto {
  @Contains('google')
  provider: Provider;

  @IsString()
  providerId: string;

  @IsString()
  name: string;

  @IsString()
  email: string;
}

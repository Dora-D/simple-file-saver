import { Permission } from '@app/entities/permission.entity';
import { Folder } from '@app/entities/folder.entity';
import { File } from '@app/entities/file.entity';
import { User } from '@app/entities/user.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT as string, 10) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  //   entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: process.env.NODE_ENV === 'development',
  entities: [User, File, Folder, Permission],
  autoLoadEntities: true,
};

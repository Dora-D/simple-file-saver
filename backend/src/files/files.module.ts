import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from '@app/entities/file.entity';
import { UsersModule } from '@app/users/users.module';
import { PermissionsModule } from '@app/permissions/permissions.module';

@Module({
  imports: [TypeOrmModule.forFeature([File]), UsersModule, PermissionsModule],
  providers: [FilesService],
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}

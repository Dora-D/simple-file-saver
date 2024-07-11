import { Module } from '@nestjs/common';
import { PermissionsController } from '@app/permissions/permissions.controller';
import { FoldersModule } from '@app/folders/folders.module';
import { Folder } from '@app/entities/folder.entity';
import { File } from '@app/entities/file.entity';
import { UsersModule } from '@app/users/users.module';
import { FilesModule } from '@app/files/files.module';
import { User } from '@app/entities/user.entity';
import { PermissionsService } from '@app/permissions/permissions.service';
import { Permission } from '@app/entities/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([File, Folder, User, Permission]),
    UsersModule,
    FilesModule,
    FoldersModule,
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}

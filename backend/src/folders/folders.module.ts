import { FoldersService } from '@app/folders/folders.service';
import { FoldersController } from '@app/folders/folders.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@app/users/users.module';
import { Folder } from '@app/entities/folder.entity';
import { FilesModule } from '@app/files/files.module';
import { PermissionsModule } from '@app/permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([File, Folder]),
    UsersModule,
    FilesModule,
    PermissionsModule,
  ],
  controllers: [FoldersController],
  providers: [FoldersService],
  exports: [FoldersService],
})
export class FoldersModule {}

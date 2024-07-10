import { FoldersService } from '@app/folders/folders.service';
import { FoldersController } from '@app/folders/folders.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@app/users/users.module';
import { Folder } from '@app/entities/folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File, Folder]), UsersModule],
  controllers: [FoldersController],
  providers: [FoldersService],
})
export class FoldersModule {}

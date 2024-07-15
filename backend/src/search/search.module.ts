import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from '@app/entities/folder.entity';
import { FilesModule } from '@app/files/files.module';
import { FoldersModule } from '@app/folders/folders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([File, Folder]),
    FilesModule,
    FoldersModule,
  ],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}

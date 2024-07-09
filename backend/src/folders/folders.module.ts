import { FoldersController } from '@app/folders/folders.controller';
import { FoldersService } from '@app/folders/folders.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [FoldersController],
  providers: [FoldersService],
})
export class FoldersModule {}

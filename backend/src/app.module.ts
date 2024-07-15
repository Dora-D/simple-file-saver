import { Module } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '@app/typeorm.config';
import { AuthModule } from '@app/auth/auth.module';
import { UsersModule } from '@app/users/users.module';
import { FoldersModule } from '@app/folders/folders.module';
import { FilesModule } from '@app/files/files.module';
import { PermissionsModule } from '@app/permissions/permissions.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    UsersModule,
    FoldersModule,
    FilesModule,
    PermissionsModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

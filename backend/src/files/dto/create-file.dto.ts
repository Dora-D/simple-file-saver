import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateFileDto {
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsNumber()
  @IsOptional()
  folderId?: boolean;
}

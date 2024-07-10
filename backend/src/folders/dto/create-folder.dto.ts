import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFolderDto {
  @ApiProperty({ description: 'Name of the folder' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'ID of the parent folder (if any)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  parentFolderId?: number;
}

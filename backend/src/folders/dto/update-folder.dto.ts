import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateFolderDto {
  @ApiProperty({ description: 'New name of the folder', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'New ID of the parent folder (if any)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  parentFolderId?: number;
}

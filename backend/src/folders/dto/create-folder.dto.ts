import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFolderDto {
  @ApiProperty({ description: 'Name of the folder' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty({
    description: 'ID of the parent folder',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  parentFolderId?: number;
}

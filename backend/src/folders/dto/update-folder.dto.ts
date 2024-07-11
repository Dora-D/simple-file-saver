import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateFolderDto {
  @ApiProperty({ description: 'New name of the folder', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  // @ApiProperty({
  //   description: 'Id of the parent folder',
  //   required: false,
  // })
  // @IsOptional()
  // @IsNumber()
  // parentFolderId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

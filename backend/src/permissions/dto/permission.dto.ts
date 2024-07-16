import { IsEmail, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PermissionType } from '@app/entities/permission.entity';

export class CreatePermissionDto {
  @ApiProperty({ description: 'Email of the user to grant permission' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'ID of the file to grant permission to',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  fileId?: number;

  @ApiProperty({
    description: 'ID of the folder to grant permission to',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  folderId?: number;

  @ApiProperty({
    description: 'Type of permission (view or edit)',
  })
  type: PermissionType;
}

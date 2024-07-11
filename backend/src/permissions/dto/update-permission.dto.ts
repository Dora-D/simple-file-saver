import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PermissionType } from '@app/entities/permission.entity';

export class UpdatePermissionDto {
  @ApiProperty({
    description: 'New type of permission (view or edit)',
    enum: PermissionType,
    required: false,
  })
  @IsOptional()
  @IsEnum(PermissionType)
  type: PermissionType;
}

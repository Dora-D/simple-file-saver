import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiProperty()
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty({ nullable: true, required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  folderId?: number;

  @ApiProperty({
    type: 'file',
    format: 'form-data',
  })
  file: any;
}

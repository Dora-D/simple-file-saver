import { CreatePermissionDto } from '@app/permissions/dto/permission.dto';
import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PermissionsService } from '@app/permissions/permissions.service';
import { GetCurrentUserId } from '@app/common/decprators/get-current-user-id.decorator';
import { UpdatePermissionDto } from '@app/permissions/dto/update-permission.dto';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('permissions')
@ApiTags('Permissions')
export class PermissionsController {
  constructor(private readonly permissionService: PermissionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getAll(@GetCurrentUserId() userId: number) {
    return await this.permissionService.findAll(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiCreatedResponse({ description: 'Permission created successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async create(
    @Res() res: Response,
    @Body() createPermissionDto: CreatePermissionDto,
    @GetCurrentUserId() userId: number,
  ) {
    await this.permissionService.create(createPermissionDto, userId);
    return res.status(HttpStatus.CREATED);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get permission by ID' })
  @ApiOkResponse({ description: 'Permission found' })
  @ApiNotFoundResponse({ description: 'Permission not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async findOne(
    @Res() res: Response,
    @Param('id') id: string,
    @GetCurrentUserId() userId: number,
  ) {
    await this.permissionService.findOne(+id, userId);
    return res.status(HttpStatus.OK).send('Permission Updated');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update permission by ID' })
  @ApiOkResponse({ description: 'Permission updated successfully' })
  @ApiNotFoundResponse({ description: 'Permission not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @GetCurrentUserId() userId: number,
  ) {
    await this.permissionService.update(+id, updatePermissionDto, userId);
    return res.status(HttpStatus.OK).send('Permission Updated');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete permission by ID' })
  @ApiOkResponse({ description: 'Permission deleted successfully' })
  @ApiNotFoundResponse({ description: 'Permission not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(
    @Res() res: Response,
    @Param('id') id: string,
    @GetCurrentUserId() userId: number,
  ) {
    await this.permissionService.remove(+id, userId);
    return res.status(HttpStatus.OK).send('Permission Deleted');
  }
}

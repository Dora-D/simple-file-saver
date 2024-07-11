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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FoldersService } from '@app/folders/folders.service';
import { CreateFolderDto } from '@app/folders/dto/create-folder.dto';
import { Folder } from '@app/entities/folder.entity';
import { GetCurrentUserId } from '@app/common/decprators/get-current-user-id.decorator';
import { UpdateFolderDto } from '@app/folders/dto/update-folder.dto';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('folders')
@ApiTags('Folders')
export class FoldersController {
  constructor(private readonly folderService: FoldersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new folder' })
  @ApiCreatedResponse({
    description: 'Folder created successfully',
    type: Folder,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async create(
    @Body() createFolderDto: CreateFolderDto,
    @GetCurrentUserId() userId: number,
  ) {
    const folder = await this.folderService.create(createFolderDto, userId);
    return folder;
  }

  @Post(':id/clone')
  @ApiOperation({ summary: 'Clone folder by ID' })
  @ApiCreatedResponse({
    description: 'Folder cloned successfully',
    type: Folder,
  })
  @ApiNotFoundResponse({ description: 'Folder not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async cloneFolder(
    @Param('id') id: string,
    @GetCurrentUserId() userId: number,
  ) {
    return this.folderService.clone(+id, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get folder by ID' })
  @ApiOkResponse({ description: 'Folder found', type: Folder })
  @ApiNotFoundResponse({ description: 'Folder not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findOne(@Param('id') id: string, @GetCurrentUserId() userId: number) {
    return this.folderService.findOne(+id, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update folder by ID' })
  @ApiOkResponse({ description: 'Folder updated successfully', type: Folder })
  @ApiNotFoundResponse({ description: 'Folder not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async update(
    @Param('id') id: string,
    @Body() updateFolderDto: UpdateFolderDto,
    @GetCurrentUserId() userId: number,
  ) {
    const folder = await this.folderService.update(
      +id,
      updateFolderDto,
      userId,
    );
    return folder;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete folder by ID' })
  @ApiOkResponse({ description: 'Folder deleted successfully' })
  @ApiNotFoundResponse({ description: 'Folder not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(
    @Param('id') id: string,
    @GetCurrentUserId() userId: number,
    @Res() res: Response,
  ) {
    await this.folderService.remove(+id, userId);
    return res.status(HttpStatus.OK).send('Folder Deleted');
  }
}

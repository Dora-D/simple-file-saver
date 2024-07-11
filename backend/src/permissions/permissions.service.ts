import { Permission } from '@app/entities/permission.entity';
import { FilesService } from '@app/files/files.service';
import { FoldersService } from '@app/folders/folders.service';
import { UsersService } from '@app/users/users.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from '@app/permissions/dto/permission.dto';
import { UpdatePermissionDto } from '@app/permissions/dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    private readonly userService: UsersService,
    private readonly fileService: FilesService,
    private readonly folderService: FoldersService,
  ) {}

  async create(
    createPermissionDto: CreatePermissionDto,
    currentUserId: number,
  ): Promise<Permission> {
    const user = await this.userService.findOneByEmail(
      createPermissionDto.email,
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let file = null;
    let folder = null;

    if (createPermissionDto.fileId) {
      file = await this.fileService.findOne(
        createPermissionDto.fileId,
        currentUserId,
      );
      if (!file || file.owner.id !== currentUserId) {
        throw new ForbiddenException(
          'You do not have permission to share this file',
        );
      }
    } else if (createPermissionDto.folderId) {
      folder = await this.folderService.findOne(
        createPermissionDto.folderId,
        currentUserId,
      );
      if (!folder || folder.owner.id !== currentUserId) {
        throw new ForbiddenException(
          'You do not have permission to share this file',
        );
      }
    } else {
      throw new BadRequestException(
        'Either fileId or folderId must be provided',
      );
    }

    const permission = this.permissionRepository.create({
      user,
      file,
      folder,
      type: createPermissionDto.type,
    });

    return await this.permissionRepository.save(permission);
  }

  async findOne(id: number, currentUserId: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['user', 'file', 'folder'],
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    if (permission.user.id !== currentUserId) {
      throw new ForbiddenException('You do not have permission to check this');
    }

    return permission;
  }

  async findAll(currentUserId: number) {
    return await this.permissionRepository.find({
      where: { user: { id: currentUserId } },
      relations: ['file', 'folder'],
    });
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
    currentUserId: number,
  ): Promise<Permission> {
    const permission = await this.findOne(id, currentUserId);

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    Object.assign(permission, updatePermissionDto);

    return this.permissionRepository.save(permission);
  }

  async remove(id: number, currentUserId: number) {
    const permission = await this.findOne(id, currentUserId);

    await this.permissionRepository.remove(permission);
  }
}

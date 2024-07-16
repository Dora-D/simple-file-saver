import { EPermissionType, Permission } from '@app/entities/permission.entity';
import { FilesService } from '@app/files/files.service';
import { FoldersService } from '@app/folders/folders.service';
import { UsersService } from '@app/users/users.service';
import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreatePermissionDto } from '@app/permissions/dto/permission.dto';
import { UpdatePermissionDto } from '@app/permissions/dto/update-permission.dto';

type ChekFilePermissionsArgumentTypes = Parameters<
  (userId: number, fileId: number) => Promise<boolean>
>;

type ChekFolderPermissionsArgumentTypes = Parameters<
  (userId: number, folderId: number) => Promise<boolean>
>;

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    private readonly userService: UsersService,
    @Inject(forwardRef(() => FilesService))
    private readonly fileService: FilesService,
    @Inject(forwardRef(() => FoldersService))
    private readonly folderService: FoldersService,
  ) {}

  async create(
    createPermissionDto: CreatePermissionDto,
    userId: number,
  ): Promise<Permission> {
    let fileId;
    let folderId;

    if (createPermissionDto.fileId) {
      this.checkUserFileOwner(userId, createPermissionDto.fileId);
      fileId = createPermissionDto.fileId;
    } else if (createPermissionDto.folderId) {
      this.checkUserFolderOwner(userId, createPermissionDto.folderId);
      folderId = createPermissionDto.folderId;
    } else {
      throw new BadRequestException(
        'Either fileId or folderId must be provided',
      );
    }

    const user = await this.userService.findOneByEmail(
      createPermissionDto.email,
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const permission = this.permissionRepository.create({
      user,
      owner: { id: userId },
      file: fileId ? { id: fileId } : undefined,
      folder: folderId ? { id: folderId } : undefined,
      type: createPermissionDto.type,
    });

    return await this.permissionRepository.save(permission);
  }

  async findOne(id: number, userId: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['user', 'file', 'folder', 'owner'],
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    if (permission.owner.id !== userId) {
      throw new ForbiddenException('You do not have permission to check this');
    }

    return permission;
  }

  async findAllByUserId(userId: number) {
    const permissions = await this.findAll({
      where: { owner: { id: userId } },
      relations: ['file', 'folder'],
    });

    if (!permissions.length) {
      throw new NotFoundException('Permission not found');
    }

    return permissions;
  }

  async findAll(params: FindManyOptions<Permission> = {}) {
    return await this.permissionRepository.find(params);
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
    userId: number,
  ): Promise<Permission> {
    const permission = await this.findOne(id, userId);

    Object.assign(permission, updatePermissionDto);

    return this.permissionRepository.save(permission);
  }

  async remove(id: number, userId: number) {
    const permission = await this.findOne(id, userId);

    await this.permissionRepository.remove(permission);
  }

  async checkUserFileOwner(...args: ChekFilePermissionsArgumentTypes) {
    const permissions = await this.checkFilePermission(...args);

    const isUserOwner = permissions.some(
      (permission) => permission === EPermissionType.OWNER,
    );

    if (isUserOwner) {
      return true;
    }

    throw new ForbiddenException(`You do not have permission to this`);
  }

  async checkUserCanReadFile(...args: ChekFilePermissionsArgumentTypes) {
    const permissions = await this.checkFilePermission(...args);

    if (permissions.length) {
      return true;
    }

    throw new ForbiddenException(
      `You do not have permission to view this file.`,
    );
  }

  async checkUserCanEditFile(...args: ChekFilePermissionsArgumentTypes) {
    const permissions = await this.checkFilePermission(...args);

    const isUserCanEdit = permissions.some(
      (permission) =>
        permission === EPermissionType.OWNER ||
        permission === EPermissionType.VIEW,
    );

    if (isUserCanEdit) {
      return true;
    }

    throw new ForbiddenException(
      `You do not have permission to edit this file.`,
    );
  }

  private async checkFilePermission(userId: number, fileId: number) {
    const file = await this.fileService.findFileById(fileId);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const userPermissions = [];
    let permissions = file.permissions;
    const isOwner = file?.owner?.id === userId;

    if (isOwner) {
      userPermissions.push(EPermissionType.OWNER);
      return userPermissions;
    }

    if (file?.folder?.id) {
      const userFolderPermission = await this.checkFolderPermission(
        userId,
        file?.folder?.id,
      );
      if (userFolderPermission.length) {
        userPermissions.push(...userFolderPermission);
      }
    }

    if (file.isPublic) {
      userPermissions.push(EPermissionType.VIEW);
    }

    permissions = await this.findAll({
      where: { user: { id: userId }, file },
    });

    if (!permissions.length) {
      return userPermissions;
    }

    const isUserCanEdit = !!permissions.find(
      ({ type }) => type === EPermissionType.EDIT,
    );

    if (isUserCanEdit) {
      userPermissions.push(EPermissionType.VIEW);
      userPermissions.push(EPermissionType.EDIT);
      return userPermissions;
    }

    const isUserCanView = !!permissions.find(
      ({ type }) => type === EPermissionType.VIEW,
    );

    if (isUserCanView || file.isPublic) {
      userPermissions.push(EPermissionType.VIEW);
    }

    return userPermissions;
  }

  async checkUserFolderOwner(...args: ChekFolderPermissionsArgumentTypes) {
    const permissions = await this.checkFolderPermission(...args);

    const isUserOwner = permissions.some(
      (permission) => permission === EPermissionType.OWNER,
    );

    if (isUserOwner) {
      return true;
    }
    throw new ForbiddenException(`You do not have permission to this`);
  }

  async checkUserCanReadFolder(...args: ChekFolderPermissionsArgumentTypes) {
    const permissions = await this.checkFolderPermission(...args);

    if (permissions.length) {
      return true;
    }

    throw new ForbiddenException(
      `You do not have permission to read this folder.`,
    );
  }

  async checkUserCanEditFolder(...args: ChekFolderPermissionsArgumentTypes) {
    const permissions = await this.checkFolderPermission(...args);

    const isUserCanEdit = permissions.some(
      (permission) =>
        permission === EPermissionType.OWNER ||
        permission === EPermissionType.EDIT,
    );

    if (isUserCanEdit) {
      return true;
    }

    throw new ForbiddenException(
      `You do not have permission to edit this folder.`,
    );
  }

  private async checkFolderPermission(userId: number, folderId: number) {
    const folder = await this.folderService.findFileById(folderId);

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    const isOwner = folder.owner.id === userId;
    const userPermissions = [] as EPermissionType[];

    if (isOwner) {
      userPermissions.push(EPermissionType.OWNER);
      return userPermissions;
    }

    if (folder.isPublic) {
      userPermissions.push(EPermissionType.VIEW);
    }

    const permissions = await this.findAll({
      where: { user: { id: userId }, folder },
    });

    if (!permissions.length) {
      return userPermissions;
    }

    const isUserCanEdit = !!permissions.find(
      ({ type }) => type === EPermissionType.EDIT,
    );

    if (isUserCanEdit) {
      userPermissions.push(EPermissionType.VIEW);
      userPermissions.push(EPermissionType.EDIT);
      return userPermissions;
    }

    const isUserCanView = !!permissions.find(
      ({ type }) => type === EPermissionType.VIEW,
    );

    if (isUserCanView) {
      userPermissions.push(EPermissionType.VIEW);
    }

    return userPermissions;
  }
}

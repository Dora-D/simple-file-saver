import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from '@app/entities/user.entity';
import { File } from '@app/entities/file.entity';
import { Folder } from '@app/entities/folder.entity';

export enum EPermissionType {
  VIEW = 'view',
  EDIT = 'edit',
  OWNER = 'owner',
}

export type PermissionType = EPermissionType.EDIT | EPermissionType.VIEW;

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.ownerPermissions)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @ManyToOne(() => User, (user) => user.permissions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => File, (file) => file.permissions, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fileId' })
  file?: File | null;

  @ManyToOne(() => Folder, (folder) => folder.permissions, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'folderId' })
  folder?: Folder | null;

  @Column({
    type: 'enum',
    enum: EPermissionType,
    default: EPermissionType.VIEW,
  })
  type: PermissionType;
}

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

export enum PermissionType {
  VIEW = 'view',
  EDIT = 'edit',
}

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.permissions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => File, (file) => file.permissions, {
    nullable: true,
  })
  @JoinColumn({ name: 'fileId' })
  file?: File | null;

  @ManyToOne(() => Folder, (folder) => folder.permissions, {
    nullable: true,
  })
  @JoinColumn({ name: 'folderId' })
  folder?: Folder | null;

  @Column({
    type: 'enum',
    enum: PermissionType,
    default: PermissionType.VIEW,
  })
  type: PermissionType;
}

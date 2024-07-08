import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@app/entities/user.entity';
import { File } from '@app/entities/file.entity';
import { Folder } from '@app/entities/folder.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.permissions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => File, (file) => file.permissions)
  @JoinColumn({ name: 'fileId' })
  file: File;

  @ManyToOne(() => Folder, (folder) => folder.id)
  @JoinColumn({ name: 'folderId' })
  folder: Folder;

  @Column()
  type: 'view' | 'edit';
}

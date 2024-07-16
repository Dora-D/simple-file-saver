import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { File } from './file.entity';
import { Permission } from './permission.entity';

@Entity()
export class Folder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  isPublic: boolean;

  @ManyToOne(() => User, (user) => user.folders)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @ManyToOne(() => Folder, (folder) => folder.parentFolder, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentFolderId' })
  parentFolder?: Folder;

  @OneToMany(() => Folder, (folder) => folder.parentFolder, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  childFolders?: Folder[];

  @OneToMany(() => File, (file) => file.folder, { onDelete: 'CASCADE' })
  files?: File[];

  @OneToMany(() => Permission, (permission) => permission.folder, {
    onDelete: 'CASCADE',
  })
  permissions?: Permission[];
}

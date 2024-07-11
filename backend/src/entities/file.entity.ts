import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '@app/entities/user.entity';
import { Folder } from '@app/entities/folder.entity';
import { Permission } from '@app/entities/permission.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  size: number;

  @Column()
  path: string;

  @Column({ default: false })
  isPublic: boolean;

  @ManyToOne(() => User, (user) => user.files)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @ManyToOne(() => Folder, (folder) => folder.files, { nullable: true })
  @JoinColumn({ name: 'folderId' })
  folder: Folder;

  @OneToMany(() => Permission, (permission) => permission.file)
  permissions: Permission[];

  @Column()
  exp: string;
}

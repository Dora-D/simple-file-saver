import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { File } from '@app/entities/file.entity';
import { Folder } from '@app/entities/folder.entity';
import { Permission } from '@app/entities/permission.entity';

export type Provider = 'google';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  picture: string;

  @OneToMany(() => File, (file) => file.owner)
  files: File[];

  @OneToMany(() => Folder, (folder) => folder.owner)
  folders: Folder[];

  @OneToMany(() => Permission, (permission) => permission.user)
  permissions: Permission[];
}

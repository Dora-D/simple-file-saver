import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { File } from '@app/entities/file.entity';
import { Folder } from '@app/entities/folder.entity';
import { Permission } from '@app/entities/permission.entity';

export type Provider = 'google';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  provider: Provider;

  @Column({ nullable: false })
  providerId: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @OneToMany(() => File, (file) => file.owner)
  @JoinColumn()
  files: File[];

  @OneToMany(() => Folder, (folder) => folder.owner)
  @JoinColumn()
  folders: Folder[];

  @OneToMany(() => Permission, (permission) => permission.user)
  @JoinColumn()
  permissions: Permission[];
}

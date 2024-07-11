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

@Entity()
export class Folder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.folders)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @ManyToOne(() => Folder, (folder) => folder.parentFolder)
  @JoinColumn({ name: 'parentFolderId' })
  parentFolder?: Folder;

  @OneToMany(() => Folder, (folder) => folder.parentFolder, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  childFolders: Folder[];

  @OneToMany(() => File, (file) => file.folder)
  files?: File[];
}

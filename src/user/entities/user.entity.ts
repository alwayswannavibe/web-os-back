// Libraries
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Common
import { CoreEntity } from '@app/common/entities/Core.entity';

// Chat
import { Message } from '@app/chat/entities/Message.entity';
import { ToDo } from '@app/toDo/entities/ToDo.entity';

@Entity('users')
export class User extends CoreEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: false })
  online: boolean;

  @Column({ type: 'timestamptz', default: new Date() })
  lastVisit: Date;

  @OneToMany(() => Message, (message) => message.owner)
  messages: Message[];

  @OneToMany(() => ToDo, (toDo) => toDo.owner)
  toDoItems: ToDo[];

  @Column('int', { default: {}, array: true })
  roomsIds: number[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}

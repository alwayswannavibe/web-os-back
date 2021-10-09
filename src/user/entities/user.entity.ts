// Libraries
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';

// Common
import { CoreEntity } from '@app/common/entities/Core.entity';

// Chat
import { Message } from '@app/chat/entities/Message.entity';

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

  @Column('int', { default: {}, array: true })
  roomsIds: number[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}

// Libraries
import { Column, Entity, ManyToOne } from 'typeorm';

// Entities
import { CoreEntity } from '@app/common/entities/Core.entity';
import { User } from '@app/user/entities/user.entity';

@Entity('messages')
export class Message extends CoreEntity {
  @Column()
  text: string;

  @Column('int', { default: {}, array: true })
  listOfReaders: number[];

  @Column({ nullable: true })
  toUserId?: number;

  @Column({ nullable: true })
  toRoomId?: number;

  @ManyToOne(() => User, (user) => user.messages)
  owner: User;
}

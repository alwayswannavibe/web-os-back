// Lib
import { Column, Entity } from 'typeorm';

// Common
import { CoreEntity } from '@app/common/entities/Core.entity';

@Entity('messages')
export class Message extends CoreEntity {
  @Column()
  text: string;

  @Column()
  username: string;

  @Column()
  photoUrl: string;
}

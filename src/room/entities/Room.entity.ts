// Libraries
import { Column, Entity } from 'typeorm';

// Common
import { CoreEntity } from '@app/common/entities/Core.entity';

@Entity('rooms')
export class Room extends CoreEntity {
  @Column('int', { default: {}, array: true })
  usersIds: number[];

  @Column({ nullable: true })
  ownerId: number;

  @Column({ nullable: true })
  image: string;

  @Column()
  name: string;
}

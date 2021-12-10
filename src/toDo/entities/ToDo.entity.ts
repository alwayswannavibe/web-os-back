// Libraries
import { Column, Entity, ManyToOne } from 'typeorm';

// Common
import { CoreEntity } from '@app/common/entities/Core.entity';

// User
import { User } from '@app/user/entities/user.entity';

@Entity('toDoItems')
export class ToDo extends CoreEntity {
  @Column()
  heading: string;

  @Column({ nullable: true })
  description?: string;

  @Column('varchar', { default: {}, array: true, length: 256 })
  tags: string[];

  @Column()
  isComplete: boolean;

  @ManyToOne(() => User, (user) => user.toDoItems)
  owner: User;
}

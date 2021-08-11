import { BeforeInsert, Column, Entity } from 'typeorm';
import { CoreEntity } from '@app/common/entities/Core.entity';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User extends CoreEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}

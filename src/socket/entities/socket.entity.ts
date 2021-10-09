// Libraries
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sockets')
export class SocketEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @Column()
  userId: number;
}

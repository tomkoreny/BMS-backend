import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Shift } from './Shift';

@Entity()
export class Workplace {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @OneToMany(type => Shift, shift => shift.workplace)
  shifts: Shift[];
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Workplace } from './Workplace';

@Entity()
export class Shift {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  date: Date;

  @ManyToOne(type => Workplace, workplace => workplace.shifts)
  workplace: Workplace;
}


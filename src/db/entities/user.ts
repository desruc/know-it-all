import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  guild: string;

  @Column({ default: 0 })
  currentStreak: number;

  @Column({ default: 0 })
  highestStreak: number;

  @Column({ default: 0 })
  currentPoints: number;

  @Column({ default: 0 })
  highestPoints: number;

  @Column({ default: 0 })
  totalCorrectAnswers: number;

  @Column({ default: 0 })
  totalAnswers: number;

  @Column({ default: false })
  answered: boolean;
}

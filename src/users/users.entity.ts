import { Report } from '../reports/reports.entity';
import {
  AfterInsert,
  AfterUpdate,
  BeforeRemove,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  afterInsert() {
    console.log(`Inserted User with id ${this.id}`);
  }

  @BeforeRemove()
  afterRemove() {
    console.log(`Removed User with id ${this.id}`);
  }

  @AfterUpdate()
  afterUpdate() {
    console.log(`Updated User with id ${this.id}`);
  }
}

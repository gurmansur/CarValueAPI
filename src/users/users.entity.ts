import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  BeforeRemove,
  AfterLoad,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

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

  @AfterLoad()
  afterLoad() {
    console.log(`Loaded User with id ${this.id}`);
  }
}

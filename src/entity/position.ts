import { BaseEntity,  Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Position extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: number;

}
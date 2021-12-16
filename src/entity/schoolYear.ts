import { BaseEntity,  Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class SchoolYear extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: number;

}
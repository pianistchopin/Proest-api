import { BaseEntity,  Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Course extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default:""})
    title: String;

}
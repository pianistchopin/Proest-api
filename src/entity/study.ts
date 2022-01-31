import { BaseEntity,  Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Study extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: String;

}
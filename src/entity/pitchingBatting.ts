import { BaseEntity,  Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class PitchingBatting extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: String;

}
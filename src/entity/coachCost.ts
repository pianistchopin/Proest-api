import { BaseEntity,  Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class CoachCost extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default:0})
    cost: number;
}
import { BaseEntity,  Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class CoachInvitation extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    student_id: number;
    
    @Column()
    coach_id: number;
    
    @Column()
    status: string;

}
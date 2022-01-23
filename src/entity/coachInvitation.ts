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

    @Column()
    start_date: string;

    @Column()
    expire_date: string;

    @Column()
    invite_date: string;

    @Column()
    month_target: string;

    @Column({ type: "float" })
    know_easy_rate: number;

    @Column({ type: "float" })
    polite_rate: number;

    @Column({ type: "float" })
    start_easy_rate: number;

    @Column({ type: "float" })
    reply_rate: number;

    @Column({ type: "float" })
    sum_rate: number;
}
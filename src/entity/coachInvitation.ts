import { BaseEntity,  Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class CoachInvitation extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default:0})
    student_id: number;
    
    @Column({default:0})
    coach_id: number;
    
    @Column({default:""})
    status: string;

    @Column({default:""})
    start_date: string;

    @Column({default:""})
    expire_date: string;

    @Column({default:""})
    invite_date: string;

    @Column({default:""})
    month_target: string;

    @Column({ type: "float", default:0.00})
    know_easy_rate: number;

    @Column({ type: "float", default:0.00 })
    polite_rate: number;

    @Column({ type: "float", default:0.00 })
    start_easy_rate: number;

    @Column({ type: "float", default:0.00 })
    reply_rate: number;

    @Column({ type: "float", default:0.00 })
    sum_rate: number;

    @Column({default: 0})
    course: number;
}
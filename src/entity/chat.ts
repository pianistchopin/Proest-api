import { BaseEntity,  Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Chat extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default:0})
    room_id: number;

    @Column({default:0})
    student_id: number;

    @Column({default:0})
    coach_id: number;

    @Column({default:""})
    week_start_date: string;

    @Column({default:""})
    week_end_date: string;

    @Column({default:""})
    previous_student_message: string;

    @Column({default:""})
    previous_student_file: string;

    @Column({default:""})
    previous_student_file_thumb: string;

    @Column({default:""})
    previous_coach_message: string;

    @Column({default:""})
    previous_coach_file: string;

    @Column({default:""})
    previous_coach_file_thumb: string;

    @Column({default:""})
    week_student_message: string;

    @Column({default:""})
    week_student_file: string;

    @Column({default:""})
    week_student_file_thumb: string;

    @Column({default:""})
    week_coach_message: string;

    @Column({default:""})
    week_coach_file: string;

    @Column({default:""})
    week_coach_file_thumb: string;

    @Column({default:""})
    week_target: string;

    @Column({default:0})
    invitation_id: number;
}
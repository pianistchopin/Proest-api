import { BaseEntity,  Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Chat extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    room_id: number;

    @Column()
    student_id: number;

    @Column()
    coach_id: number;

    @Column()
    week_start_date: string;

    @Column()
    week_end_date: string;

    @Column()
    previous_student_message: string;

    @Column()
    previous_student_file: string;

    @Column()
    previous_student_file_thumb: string;

    @Column()
    previous_coach_message: string;

    @Column()
    previous_coach_file: string;

    @Column()
    previous_coach_file_thumb: string;

    @Column()
    week_student_message: string;

    @Column()
    week_student_file: string;

    @Column()
    week_student_file_thumb: string;

    @Column()
    week_coach_message: string;

    @Column()
    week_coach_file: string;

    @Column()
    week_coach_file_thumb: string;

    @Column()
    week_target: string;

    @Column()
    invitation_id: number;
}
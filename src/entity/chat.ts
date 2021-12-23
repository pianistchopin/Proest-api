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
    previous_goal_message: string;

    @Column()
    previous_goal_video: string;

    @Column()
    today_goal_message: string;

    @Column()
    today_goal_video: string;

    @Column()
    coach_goal_message: string;

    @Column()
    coach_goal_video: string;

}
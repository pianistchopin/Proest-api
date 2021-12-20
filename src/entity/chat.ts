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
    last_message: string;

    @Column()
    last_message_date: string;

    @Column()
    read_status: string;

    @Column()
    student_sender: number;
}
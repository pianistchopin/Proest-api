import { BaseEntity,  Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Coach extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    school_year: number;

    @Column()
    pitching_batting: number;

    @Column()
    position: number;

    @Column()
    baseball_career: string;

    @Column()
    avatar: string;

    @Column()
    profile: string;

    @Column()
    specialty: string;

    @Column()
    profile_video: string;

    @Column()
    payment: string;

    @Column()
    rating: number;

    @Column()
    access_token: string;

    @Column()
    invitation_code: string;
}
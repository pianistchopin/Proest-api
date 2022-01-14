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

    @Column("varchar", { length: 1000 })
    profile: string;

    @Column("varchar", { length: 1000 })
    specialty: string;

    @Column()
    profile_video: string;

    @Column()
    profile_video_thumb: string;

    @Column()
    payment: string;

    @Column({ type: "float" })
    rating: number;

    @Column()
    access_token: string;

    @Column()
    invitation_code: string;

    @Column()
    fcm_token: string;
    
    @Column()
    stripe_connect_id: string;

    @Column()
    stripe_customer_id: string;
}
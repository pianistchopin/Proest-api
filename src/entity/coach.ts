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

    @Column({default:0})
    school_year: number;

    @Column({default:0})
    pitching_batting: number;

    @Column({default:0})
    position: number;

    @Column({default:""})
    course: string;

    @Column({default:""})
    baseball_career: string;

    @Column({default:""})
    avatar: string;

    @Column("varchar", { length: 1000, default:"" })
    profile: string;

    @Column("varchar", { length: 1000, default:"" })
    specialty: string;

    @Column({default:""})
    profile_video: string;

    @Column({default:""})
    profile_video_thumb: string;

    @Column({default:""})
    payment: string;

    @Column({ type: "float", default:0.00})
    rating: number;

    @Column({default:""})
    access_token: string;

    @Column({default:""})
    invitation_code: string;

    @Column({default:""})
    fcm_token: string;
    
    @Column({default:""})
    stripe_account_id: string;

    @Column({default: 0})
    stripe_settings_complete: number;
}
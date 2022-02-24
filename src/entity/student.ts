import { BaseEntity,  Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Student extends BaseEntity{
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({default:0})
    coach_id: number;
    
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
    team: string;

    @Column({default:""})
    avatar: string;

    @Column({default:""})
    payment: string;

    @Column({default:""})
    access_token: string;
    
    @Column({default:""})
    expire_date: string;

    @Column({default:""})
    fcm_token: string;

    @Column({default:""})
    stripe_connect_id: string;

    @Column({default:""})
    stripe_customer_id: string;

    @Column({default:""})
    created_at: string;

    @Column({default:""})
    subscription_id: string;
}
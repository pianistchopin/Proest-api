import { BaseEntity,  Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Student extends BaseEntity{
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    coach_id: number;
    
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
    team: string;

    @Column()
    avatar: string;

    @Column()
    payment: string;

    @Column()
    access_token: string;
    
    @Column()
    expire_date: string;

    @Column()
    fcm_token: string;

    @Column()
    stripe_connect_id: string;

    @Column()
    stripe_customer_id: string;
}
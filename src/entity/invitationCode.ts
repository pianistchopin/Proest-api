import { BaseEntity,  Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class InvitationCode extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default:""})
    invitation_code: String;

}
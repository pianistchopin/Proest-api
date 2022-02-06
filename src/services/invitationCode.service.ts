import {InvitationCode} from "../entity/invitationCode"
import {UpdateInvitationCodeDto} from "../dtos/updateInvitationCode.dto";
import {CoachInvitation} from "@entity/coachInvitation";

export class InvitationCodeService {

    findAll = async () => {
        return await InvitationCode.find();
    }

    findOne = async (id: number) => {
        return await InvitationCode.findOne(id);
    }

    findInviteCode = async (invitation_code: number) => {
        return await InvitationCode.createQueryBuilder("InvitationCode")
            .select("*")
            .where("invitation_code = :invitation_code", { invitation_code: invitation_code })
            .getRawOne();
    }

    update = async (id: number, updateStudyDto: UpdateInvitationCodeDto) => {
        await InvitationCode.update(id, updateStudyDto);
    }

    remove = async (id: number) => {
        await InvitationCode.createQueryBuilder("InvitationCode")
            .delete()
            .where("id = :id", { id: id })
            .execute();
    }

    save = async (updateData: UpdateInvitationCodeDto): Promise<InvitationCode> => {
        const data = InvitationCode.create(updateData)
        return await InvitationCode.save(data);
    }

}

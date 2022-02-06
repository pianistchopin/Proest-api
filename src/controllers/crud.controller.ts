import {NextFunction, Request, Response} from "express";
import {StudyService} from "../services/study.service";
import {InvitationCodeService} from "../services/invitationCode.service";
import {UpdateStudyDto} from "../dtos/updateStudy.dto";
import {Coach} from "../entity/coach";
import { CoachService } from "../services/coach/coach.service";
import {UpdateInvitationCodeDto} from "@dtos/updateInvitationCode.dto";

export class CrudController{
    public studyService = new StudyService();
    public coachService = new CoachService();
    public invitationCodeService = new InvitationCodeService();
    getStudyList = async (req: Request, res: Response, next: NextFunction) => {

        const study_list = await this.studyService.findAll();
        res.render('student_curd.ejs', { study_list : study_list});
    }

    updateStudy = async (req: Request, res: Response, next: NextFunction) => {
        const updateStudyDto: UpdateStudyDto = JSON.parse(JSON.stringify(req.body));
        await this.studyService.update(updateStudyDto.id, updateStudyDto);
        res.redirect('/crud/study');
    }

    addStudyList =  async (req: Request, res: Response, next: NextFunction) => {
        const updateStudyDto: UpdateStudyDto = JSON.parse(JSON.stringify(req.body));
        console.log(req.body);
        await this.studyService.save(updateStudyDto);
        res.redirect('/crud/study');
    }

    deleteStudy = async (req: Request, res: Response, next: NextFunction) => {
        const study_id = req.body.id;

        let study_exist_flag = true;
        const all_coach: Coach[] = await this.coachService.findAllCoach();
        all_coach.forEach((coach) => {

            let studyArr = coach.study.split(",");
            let study_flag = studyArr.find(id => id === study_id);
            if(study_flag){
                study_exist_flag = false;
            }
        })
        console.log(study_exist_flag);
        if(study_exist_flag){
            await this.studyService.remove(study_id);
            res.status(200).json({ message: 'No data', status: 1});
        }
        else{
            res.status(200).json({ message: 'exit study data in coach', status: 0});
        }

    }


    getInvitationCodeList = async (req: Request, res: Response, next: NextFunction) => {
        const invitation_code_list = await this.invitationCodeService.findAll();
        res.render('invitation_code_curd.ejs', { invitation_code_list : invitation_code_list});
    }

    addInvitationCode = async (req: Request, res: Response, next: NextFunction) => {
        const updateInvitationCodeDto: UpdateInvitationCodeDto = JSON.parse(JSON.stringify(req.body));
        await this.invitationCodeService.save(updateInvitationCodeDto);
        res.redirect('/crud/invite_code');
    }
}
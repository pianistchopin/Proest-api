import {NextFunction, Request, Response} from "express";
import {CourseService} from "../services/course.service";
import {InvitationCodeService} from "../services/invitationCode.service";
import {UpdateCourseDto} from "../dtos/updateCourse.dto";
import {Coach} from "../entity/coach";
import { CoachService } from "../services/coach/coach.service";
import {UpdateInvitationCodeDto} from "@dtos/updateInvitationCode.dto";

export class CrudController{
    public courseService = new CourseService();
    public coachService = new CoachService();
    public invitationCodeService = new InvitationCodeService();
    getCourseList = async (req: Request, res: Response, next: NextFunction) => {

        const course_list = await this.courseService.findAll();
        res.render('student_curd.ejs', { course_list : course_list});
    }

    updateCourse = async (req: Request, res: Response, next: NextFunction) => {
        const updateCourseDto: UpdateCourseDto = JSON.parse(JSON.stringify(req.body));
        await this.courseService.update(updateCourseDto.id, updateCourseDto);
        res.redirect('/crud/course');
    }

    addCourseList =  async (req: Request, res: Response, next: NextFunction) => {
        const updateCourseDto: UpdateCourseDto = JSON.parse(JSON.stringify(req.body));
        console.log(req.body);
        await this.courseService.save(updateCourseDto);
        res.redirect('/crud/course');
    }

    deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
        const course_id = req.body.id;

        let course_exist_flag = true;
        const all_coach: Coach[] = await this.coachService.findAllCoach();
        all_coach.forEach((coach) => {

            let courseArr = coach.course.split(",");
            let course_flag = courseArr.find(id => id === course_id);
            if(course_flag){
                course_exist_flag = false;
            }
        })
        console.log(course_exist_flag);
        if(course_exist_flag){
            await this.courseService.remove(course_id);
            res.status(200).json({ message: 'No data', status: 1});
        }
        else{
            res.status(200).json({ message: 'exit course data in coach', status: 0});
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
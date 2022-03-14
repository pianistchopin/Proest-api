import {StudentService} from "../services/student/student.service";
import {CoachService} from "../services/coach/coach.service";
import {CourseService} from "../services/course.service";
import {CoachInvitationService} from "../services/coachInvitation.service";
import {UpdateStudentDto} from "../dtos/updateStudent.dto";
import {CoachInvitationDto} from "../dtos/coachInvitation.dto";
import moment from "moment";
import {CoachCostService} from "../services/coachCost.service";

const cron = require('node-cron');
const studentService = new StudentService();
const coachService = new CoachService();
const coachInvitationService = new CoachInvitationService();
const coachCostService = new CoachCostService();
const Stripe_Key = "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";
const stripe = require("stripe")(Stripe_Key);
const priceId = "price_1KX63gIoQDioSJRqWXZzinl2"

export const SubscriptionDateAndPayoutTask = cron.schedule('0 0 0 * * *', async () => {

    const all_student = await studentService.findAll();

    for (const student of all_student) {
        const date_flag = checkSubscriptionDate(student);
        if(date_flag){
            let sub_response = await createSubscription(priceId, student.stripe_customer_id);
            let updateStudentDto = new UpdateStudentDto();
            updateStudentDto.subscription_id = sub_response.id;
            await studentService.update(student.id, updateStudentDto);
        }
    }

    let coachCost_arr = await coachCostService.findAll();
    const one_coach_cost = coachCost_arr[0].cost;
    const all_coach = await coachService.findAllCoach();
    const cur_date = moment().format('YYYY-MM-DD');
    const pay_date = moment(cur_date).subtract(21, 'days').format("YYYY-MM-DD");
    for (const coach of all_coach) {
        let student_list = await coachInvitationService.getTrainingStudentList(coach.id, pay_date)
        let amount = one_coach_cost * student_list.length;
        await payout(coach.stripe_account_id, amount);

        let coachInvitationDto = new CoachInvitationDto();
        await coachInvitationService.updatePayStudent(coach.id, pay_date, coachInvitationDto);
    }
});

const checkSubscriptionDate = (student) => {
    const cur_date = moment().format('YYYY-MM-DD h:mm:ss');
    const expire_pending_date = moment(student.created_at).add(14, 'days').format("YYYY-MM-DD h:mm:ss");

    const flagExpiredate = moment(cur_date).isAfter(expire_pending_date);

    return flagExpiredate && !student.subscription_id && student.stripe_customer_id
}

const createSubscription = async (priceId:string, customerId: string) => {
    return await stripe.subscriptions.create({
        customer: customerId,
        items: [
            {
                price: priceId
            }
        ]
    });
}

const payout = async (connected_stripe_account_id, amount) => {
    return await stripe.transfers.create({
        amount: amount,
        currency: "JPY",
        destination: connected_stripe_account_id,
    });
}
import {StudentService} from "../services/student/student.service";
import {CoachService} from "../services/coach/coach.service";
import {CoachInvitationService} from "../services/coachInvitation.service";
import {UpdateStudentDto} from "../dtos/updateStudent.dto";
import moment from "moment";

const cron = require('node-cron');
const studentService = new StudentService();
const coachService = new CoachService();
const coachInvitationService = new CoachInvitationService();
const Stripe_Key = "sk_test_51KT3d2IoQDioSJRqskegkKIK0Wx7xffjNQVAkkWUKGshy4Gk9IJ4eFqh8YgpanQ8xMmIKFhSWjb1ahrPXOT7guKJ00FMxQ9k6j";
const stripe = require("stripe")(Stripe_Key);
const priceId = "price_1KTmxvIoQDioSJRqshTmSPRP"

export const SubscriptionDateTask = cron.schedule('0 0 0 * * *', async () => {

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
});

export const PayoutCoach = cron.schedule('0 0 0 1 * *', async () => {

    const one_coach_cost = 5500;
    const all_coach = await coachService.findAllCoach();
    const cur_date = moment().format('YYYY-MM-DD h:mm:ss');
    const expire_trial_date = moment(cur_date).subtract(14, 'days').format("YYYY-MM-DD h:mm:ss");

    for (const coach of all_coach) {

        let student_list = await coachInvitationService.getTrainingStudentList(coach.id, expire_trial_date)

        let amount = one_coach_cost * student_list.length;
        await payout(coach.stripe_account_id, amount);
    }
})

const checkSubscriptionDate = (student) => {
    const cur_date = moment().format('YYYY-MM-DD h:mm:ss');
    const expire_pending_date = moment(student.created_at).subtract(14, 'days').format("YYYY-MM-DD h:mm:ss");

    return moment(cur_date).isAfter(expire_pending_date);
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
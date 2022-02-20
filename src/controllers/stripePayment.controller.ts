import {NextFunction, Request, Response} from "express";
import {HttpException} from "../exceptions/HttpException";
import {RequestWithCoach, RequestWithStudent} from "../interfaces/auth.interface";
import {CoachService} from "../services/coach/coach.service";
import {StudentService} from "../services/student/student.service";
import {UpdateStudentDto} from "../dtos/updateStudent.dto";
import moment from "moment";

export class StripePaymentController{
    public Stripe_Key = "sk_test_51KT3d2IoQDioSJRqskegkKIK0Wx7xffjNQVAkkWUKGshy4Gk9IJ4eFqh8YgpanQ8xMmIKFhSWjb1ahrPXOT7guKJ00FMxQ9k6j";
    public stripe = require("stripe")(this.Stripe_Key);
    public priceId = "price_1KTmxvIoQDioSJRqshTmSPRP"
    public coachService = new CoachService();
    public studentService = new StudentService();


    createStripe = async (req: RequestWithStudent, res: Response, next: NextFunction) => {

        try{
            const student = req.student;
            const {
                cardNumber,
                cardExpMonth,
                cardExpYear,
                cardCVC,
              } = req.body;
    
            const customer = await this.createNewCustomer(student.email);
            const card = await this.addNewCard(cardNumber, cardExpMonth, cardExpYear, cardCVC, customer.id);

            const studentDto = new UpdateStudentDto();
            studentDto.stripe_connect_id = card.cardId;
            studentDto.stripe_customer_id = customer.id;

            const date_flag = this.checkSubscriptionDate(student);
            if(date_flag){
                let sub_response = await this.createSubscription(this.priceId, customer.id);
                studentDto.subscription_id = sub_response.id;
            }
            await this.studentService.update(student.id, studentDto);

            res.status(200).json({data: date_flag,  message: 'add card', status:1 });

        }catch(error){
            next(error);
        }
    }

    createNewCustomer = async (email: string) =>{
        try {
            const customer = await this.stripe.customers.create(
                {
                  email: email,
                }
              );
              return customer;
        }catch(error){
            throw new HttpException(200, "You're not userData");
        }
    }

    addNewCard = async (cardNumber:string, cardExpMonth:string, cardExpYear:string, cardCVC:string, customerId:string ) => {
        if (!cardNumber || !cardExpMonth || !cardExpYear || !cardCVC) {
            throw new HttpException(200, "Please Provide All Necessary Details to save the card");
        }

        const cardToken = await this.stripe.tokens.create({
            card: {
              number: cardNumber,
              exp_month: cardExpMonth,
              exp_year: cardExpYear,
              cvc: cardCVC
            },
        });

        const card = await this.stripe.customers.createSource(customerId, {
        source: `${cardToken.id}`,
        });

        return {tokenId:cardToken.id, cardId: card.id};
    }

    checkSubscriptionDate = (student) => {
        const now_date = moment().format('YYYY-MM-DD h:mm:ss');
        const expire_pending_date = moment(student.created_at).add(14, 'days').format("YYYY-MM-DD h:mm:ss");
        console.log(expire_pending_date);
        const date_flag = moment(now_date).isAfter(expire_pending_date);

        return date_flag;
    }

    createSubscription = async (priceId:string, customerId: string) => {
        const session = await this.stripe.subscriptions.create({
            customer: customerId,
            items: [
              {
                price: priceId
              }
            ]
        });
        return session;
    }

    subscription = async (req: RequestWithStudent, res: Response, next: NextFunction) => {
        const student = req.student;
        await this.createSubscription(this.priceId, student.stripe_customer_id);
        res.status(200).json({  message: 'subscription', status:1 });
    }

}
import {NextFunction, Request, Response} from "express";
import {HttpException} from "../exceptions/HttpException";
import {RequestWithCoach, RequestWithStudent} from "../interfaces/auth.interface";
import {CoachService} from "../services/coach/coach.service";
import {StudentService} from "../services/student/student.service";
import {UpdateStudentDto} from "../dtos/updateStudent.dto";

export class StripePaymentController{
    public Stripe_Key = "sk_test_51HwB2eJWOHWcUEhYDmAZdFrg5Hlu7ImRDdLyFJXGIasOMY3WBhAnfvyNevvtIVpkfSLW2boZw5zY4KGYE6OwxTc400cfLMI6W7";
    public stripe = require("stripe")(this.Stripe_Key);
    public priceId = "price_1KKJmWJWOHWcUEhYPBpcGIed"
    public coachService = new CoachService();
    public studentService = new StudentService();

    subscription_student = async (req: RequestWithStudent, res: Response, next: NextFunction) => {

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
    
            await this.coachService.update(student.id, studentDto);

            res.status(200).json({data: card,  message: 'add card', status:1 });

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

}
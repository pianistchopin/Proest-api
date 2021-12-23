import {Request, Router} from "express";
import { Routes } from "@interfaces/routes.interface";
import authMiddleware from "@middlewares/auth.middleware";
import AuthController from "@controllers/student/auth.controller";
import {ChatController} from "@controllers/chat.controller";
import {studentUpload} from "@utils/util";
import multer from "multer";
import {RequestWithStudent} from "@interfaces/auth.interface";

export class ChatRoute implements Routes {
    path: string = "/chat";
    router: Router = Router();

    chatController = new ChatController();

    constructor() {
        this.initializeRoutes();
    }

    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/student')
        },

        filename: function (req: Request, file: any, cb: any) {
            let extArray = file.mimetype.split("/");
            let extension = extArray[extArray.length - 1];
            cb(null, Date.now() + "." + extension);
        }
    });

    upload = multer({storage: this.storage});
    
    private initializeRoutes = () => {
        this.router.get(`${this.path}/manageChat`, this.upload.fields([{
            name: 'previous_file', maxCount: 1
        }, {
            name: 'today_file', maxCount: 1
        },{
            name: 'coach_file', maxCount: 1
        }]), this.chatController.manageChat);
    }
}
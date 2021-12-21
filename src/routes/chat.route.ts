import {Router} from "express";
import { Routes } from "@interfaces/routes.interface";
import authMiddleware from "@middlewares/auth.middleware";
import AuthController from "@controllers/student/auth.controller";
import {ChatController} from "@controllers/chat.controller";

export class ChatRoute implements Routes {
    path: string = "/chat";
    router: Router = Router();

    chatController = new ChatController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router.get(`${this.path}/manageChat`,authMiddleware, this.chatController.manageChat);
    }
}
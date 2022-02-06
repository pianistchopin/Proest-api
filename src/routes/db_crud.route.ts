import {Routes} from "../interfaces/routes.interface";
import {Router} from "express";
import {CrudController} from "../controllers/crud.controller";

class DbCrudRoute implements Routes {
    path: string = "/crud";
    router: Router = Router();

    crudController = new CrudController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router.get(`${this.path}/study`, this.crudController.getStudyList);
        this.router.post(`${this.path}/study`, this.crudController.addStudyList);
        this.router.post(`${this.path}/study/update`, this.crudController.updateStudy);
        this.router.post(`${this.path}/study/delete`, this.crudController.deleteStudy);

        this.router.get(`${this.path}/invite_code`, this.crudController.getInvitationCodeList);
        this.router.post(`${this.path}/invite_code`, this.crudController.addInvitationCode);
    }
}

export default DbCrudRoute;
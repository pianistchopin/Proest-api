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
        this.router.get(`${this.path}/course`, this.crudController.getCourseList);
        this.router.post(`${this.path}/course`, this.crudController.addCourseList);
        this.router.post(`${this.path}/course/update`, this.crudController.updateCourse);
        this.router.post(`${this.path}/course/delete`, this.crudController.deleteCourse);

        this.router.get(`${this.path}/invite_code`, this.crudController.getInvitationCodeList);
        this.router.post(`${this.path}/invite_code`, this.crudController.addInvitationCode);
    }
}

export default DbCrudRoute;
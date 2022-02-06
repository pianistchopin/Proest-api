
import App from './app';
import StudentRoute from "./routes/student.route";
import CoachRoute from "./routes/coach.route";
import {ChatRoute} from "./routes/chat.route";
import DbCrudRoute from "./routes/db_crud.route";

const app = new App([
    new StudentRoute(),
    new CoachRoute(),
    new ChatRoute(),
    new DbCrudRoute()
]);

app.listen();

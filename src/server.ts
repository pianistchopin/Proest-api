
import App from '@/app';
import StudentRoute from "@routes/student.route";
import CoachRoute from "@routes/coach.route";

const app = new App([
    new StudentRoute(),
    new CoachRoute(),
]);

app.listen();

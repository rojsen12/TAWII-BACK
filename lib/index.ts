import App from './app';
import IndexController from "./controllers/index.controller";
import NoticeController from './controllers/notice.controller';
import UserController from './controllers/user.controller';
import LessonController from "./controllers/lesson.controler";
import PostController from "./controllers/post.controller";

const app: App = new App([
   new NoticeController(),
   new LessonController(),
   new IndexController(),
   new UserController(),
   new PostController()
]);

app.listen();
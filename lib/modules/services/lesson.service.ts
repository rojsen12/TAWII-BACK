import {ILesson} from "../models/lesson.model"
import LessonModel from "../schemas/lesson.schema"

class LessonService {
    public async createLesson(postParams: ILesson) {
      try {
          const dataModel = new LessonModel(postParams);
          await dataModel.save();
      } catch (error){
          console.error('Wystąpił błąd podczas tworzenia danych:', error);
          throw new Error('Wystąpił błąd podczas tworzenia danych');
      }
    }

    public async deleteAllPosts() {
        try{
            await LessonModel.deleteMany();
        } catch(error) {
            console.error("Wystąpił błąd podczas usuwania danych:", error);
            throw new Error(("Wystąpił błąd podczas usuwania danych"));
        }
    }

    public async getAll(){
        try {
            const result = await LessonModel.find();
            return result;
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async getById(id: string){
        try {
            const result = await LessonModel.findOne({ _id: id });
            return result;
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

}

export default LessonService;
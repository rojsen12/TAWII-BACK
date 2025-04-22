import {INotice} from "../models/notice.model"
import NoticeModel from "../schemas/notice.schema"

class NoticeService {
    public async createNotice(postParams: INotice) {
        try {
            const dataModel = new NoticeModel(postParams);
            await dataModel.save();
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }

    public async deleteAllPosts() {
        try {
            await NoticeModel.deleteMany();
        } catch (error) {
            console.error("Wystąpił błąd podczas usuwania danych:", error);
            throw new Error(("Wystąpił błąd podczas usuwania danych"));
        }
    }

    public async getAll(){
        try {
            const result = await NoticeModel.find();
            return result;
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async getById(id: string){
        try{
            const result = await NoticeModel.findOne({_id:id})
            return result;
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

}

export default NoticeService;
import { execOne } from "@/app/lib/db";
import { Lesson, LessonSchema } from "./lessons/types";

export const getLesson = async (lesson_id: string) => {

    const sql = `select * 
    from lessons 
    where
        lesson_id = $1 and 
        active = true`;

    const params:string[] = [lesson_id];
    //console.log("getLesson", sql, params, LessonSchema);
    return  await execOne(sql, params, LessonSchema);

}
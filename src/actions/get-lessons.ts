
import { execSql } from "@/app/lib/db";
import { LessonSchema } from "./types";

export const getLessons = async () => {

    const sql = `select l.*,
            (select count(*)::int from activities a where a.lesson_id = l.lesson_id) as activity_count 
            from lessons l
            where l.active = true;
            `;
    const params:[] = [];

    return  await execSql(sql, params, LessonSchema);

}

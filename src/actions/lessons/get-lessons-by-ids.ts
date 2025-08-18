import { execSql } from "@/app/lib/db";
import { LessonSchema } from "./types";

/**
 * Fetch lessons by a list of UUID lessonIds, preserving input order.
 */
export const getLessonsByIds = async (lessonIds: string[]) => {
  if (!lessonIds || lessonIds.length === 0) {
    return await execSql(
      `select l.*,
              (select count(*)::int from activities a where a.lesson_id = l.lesson_id) as activity_count
       from lessons l
       where false;`,
      [],
      LessonSchema
    );
  }

  const sql = `
    select l.*,
           (select count(*)::int from activities a where a.lesson_id = l.lesson_id) as activity_count
    from lessons l
    where l.active = true
      and l.lesson_id = ANY($1::uuid[])
    order by array_position($1::uuid[], l.lesson_id);
  `;

  const params = [lessonIds];
  return await execSql(sql, params, LessonSchema);
};

"use server"



import { z } from "zod";

import { execSql } from "@/app/lib/db";

import { Unit, UnitSchema } from "./types";


export const getUnitsForCourse = async (courseId: string) => {

    const sql = `
        SELECT
        u.unit_id,
        u.title,
        u.course_id,
        c.title AS course_title,
        u.tags,
        u.active,
        u.created_by,
        u.created,
        u.order_by

        FROM units u

        LEFT JOIN courses c 
        ON u.course_id = c.course_id
        WHERE u.active = true and u.course_id = $1
        GROUP BY u.unit_id, c.title

        ORDER BY u.order_by;`

        const params:string[] = [courseId];
    
        return  await execSql(sql, params, UnitSchema);
}
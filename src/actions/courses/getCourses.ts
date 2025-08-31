"use server"

import { pool } from "@/app/lib/db";
import { z } from "zod";


import { CoursesSchema, type Courses } from "./types";

const ReturnValSchema = z.object({
    data: CoursesSchema.nullable(),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;


export const getCourses = async (): Promise<ReturnVal> => {

    let data = null, error = null;
    
    try{
        const query = `
            select c.course_id, c.title, c.nc_id, ncs.title as nc_title, c.tags, c.active, c.created, c.created_by, c.order_by 
            from courses c
            left join ncs on c.nc_id = ncs.nc_id
            where c.active = true
            order by c.order_by;
        `
        const result = await pool.query(query);

        data =  (result.rows.map((row:any) => ({
            ...row,
            // if `row.created` is already a Date
            created: row.created.toISOString()
          })) || [] ) as Courses;
    
    } catch(err) {
        
        if (err instanceof Error){
            console.error("getCourses: returns", data, error)
            error = err.message;
        }

    } finally {
        ////console.log("getNCsByID: returns", data, error)
        const result = ReturnValSchema.parse({data, error});
        //console.log("Result", result);
        return result;
    }
}
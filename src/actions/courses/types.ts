
import {z} from "zod";

export const CourseSchema = z.object({
  type: z.string().default("course"),
  course_id: z.string(),
  title: z.string(),
  nc_id: z.string().optional().nullable(), // now optional
  nc_title: z.string().optional().nullable(), // now optional
  tags: z.array(z.string()),
  active: z.boolean(),
  created: z.coerce.date(), // accepts string or Date
  created_by: z.string(),
  order_by: z.number().nullable(),
});

export const CoursesSchema = z.array(CourseSchema);

export type Course = z.infer<typeof CourseSchema>;
export type Courses = z.infer<typeof CoursesSchema>;

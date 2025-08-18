import {z, ZodType, ZodTypeAny} from "zod";


export const LessonSchema = z.object({
    lesson_id: z.string(), 
    title: z.string(), 
    description: z.string().nullable(), 
    tags: z.array(z.string()).nullable(),
    unit_id: z.string(), 
    active: z.boolean(), 
    created: z.date(),
    created_by: z.string(), 
    order_by: z.number(),
    activity_count: z.number()
});

export const LessonsSchema = z.array(LessonSchema);

export type Lesson = z.infer<typeof LessonSchema>;
export type Lessons = z.infer<typeof LessonsSchema>;




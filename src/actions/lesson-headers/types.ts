import {z, ZodType, ZodTypeAny} from "zod";


export const LessonHeaderSchema = z.object({
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

export const LessonHeadersSchema = z.array(LessonHeaderSchema);

export type LessonHeader = z.infer<typeof LessonHeaderSchema>;
export type LessonHeaders = z.infer<typeof LessonHeadersSchema>;
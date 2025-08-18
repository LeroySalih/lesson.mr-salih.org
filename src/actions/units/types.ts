import {z} from "zod";






export const UnitSchema = z.object({
    type: z.string().default("unit"),
    unit_id: z.string(),
    title: z.string(),
    course_id: z.string(),
    course_title: z.string().optional(),
    tags: z.array(z.string()),
    active: z.boolean(),
    created: z.coerce.date(),
    created_by: z.string(),
    order_by: z.number()
});

export const UnitsSchema = z.array(UnitSchema);

export type Unit = z.infer<typeof UnitSchema>;
export type Units = z.infer<typeof UnitsSchema>;
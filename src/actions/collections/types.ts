import {z} from "zod";


export const CollectionSchema = z.object({
    label: z.string(),
    lessons: z.array(z.string()).nullable()
});

export const CollectionsSchema = z.record(z.string(), CollectionSchema);


export type Collection = z.infer<typeof CollectionSchema>;
export type Collections = z.infer<typeof CollectionsSchema>; 
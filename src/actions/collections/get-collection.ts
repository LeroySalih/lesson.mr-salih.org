import {CollectionSchema, Collection, Collections} from "./types";
import {collections} from "./data";

export const getCollection = (collectionId: string) => {
    return CollectionSchema.parse(collections[collectionId]) ;
}
import {CollectionsSchema, Collection, Collections} from "./types";
import {collections} from "./data";


export const getCollections = () => {
    return CollectionsSchema.parse(collections) ;
}
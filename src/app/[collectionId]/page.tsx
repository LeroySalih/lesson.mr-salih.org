import {Page, PageHeading} from "@/components/page";
import {Collection} from "@/actions/collections/types";
import { getCollection } from "@/actions/collections/get-collection";
import { getLessonsByIds } from "@/actions/lessons/get-lessons-by-ids";

const CollectionsPage = async ({params} : {params: Promise<{collectionId: string}>}) => {

    const {collectionId} = await params;

    const collection = getCollection(collectionId);

    if (collection == null) {
        return <div>Collection Not found</div>
    }

    const lessons = await getLessonsByIds(collection.lessons || []);

    return <Page>
        <PageHeading><span>{collection.label}</span></PageHeading>
        <pre>{JSON.stringify(lessons, null, true)}</pre>
        </Page>
}

export default CollectionsPage;
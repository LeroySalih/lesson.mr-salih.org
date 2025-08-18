import {Lesson} from "@/actions/lessons/types";

const LessonHeader = ({lesson}:{lesson: Lesson}) => {

    return <pre>{JSON.stringify(lesson, null, 2)}</pre>
}

export default LessonHeader;
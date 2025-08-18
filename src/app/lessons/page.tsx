import { getLessons } from "@/actions/lessons/get-lessons";
import { getLesson } from "@/actions/get-lesson";
import React from "react";

import Link from 'next/link';

import {LessonHeader} from "./lesson-header";

const Page = async () => {

    // const {data, error} = await getLesson("3ff9452a-2e65-449a-a0f4-296d19ea7b32");
    const {data, error} = await getLessons();

    if (error)
        return <pre className="">Error!{JSON.stringify(error, null, 2)}</pre>

    return  <div className="min-h-[calc(100svh-var(--header-h))]  
    min-w-[1000px] w-[80%] mx-auto
    
    ">
        <div>All Lessons</div>

        <div className="grid grid-cols-[1fr_2fr]">
            <div>title</div>
            <div>Activities</div>
            {
                data && data.map((d, i) => (<React.Fragment key={i}>
                        <div >
                           <Link href={`/lessons/${d.lesson_id}`}>{d.title}</Link> 
                        </div>
                        <div >{d.activity_count}</div>
                    </React.Fragment>))
            }
        </div>

    </div>

}

export default Page;
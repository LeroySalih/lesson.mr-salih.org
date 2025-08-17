import { ReactNode } from "react";

const Page = async ({params} : {params: Promise<{lessonid: string}>}) => {

    const {lessonid} = await params;

    return <div className="min-h-[calc(100svh-var(--header-h))]  
    min-w-[1000px] w-[80%] mx-auto
    
    ">
        <Card>
            <CardTitle>Design & Techology &gt; Materials</CardTitle>
            <div className="mt-4 font-bold text-6xl">Metals ({lessonid})</div>
        </Card>

        <Card>
            <CardTitle>LO & SC</CardTitle>
        </Card>

        <div className="grid grid-cols-[1fr_2fr] gap-4 w-full">
            <div className="p-4">
                <Card>
                    <CardTitle>Sections</CardTitle>
                </Card>
            </div>
            <div className="p-4">
                <Card>
                    <CardTitle>Section 1</CardTitle>
                </Card>

                <Card>
                    <CardTitle>Section 2</CardTitle>
                </Card>
            </div>
        </div>


    </div>
}


export default Page; 


const CardTitle = ({children}: {children: ReactNode}) => {
    return <div className="border-slate-200 border-b-[0.5px]">{children}</div>
}

const Card = ({children}: {children: ReactNode})=> {

    return <div className="bg-white m-2 p-4 border-[1px] border-slate-400 rounded-xl">
        {children}
        </div>
}
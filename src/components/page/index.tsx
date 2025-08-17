import {ReactNode} from "react";


const classDiv = (cn: string) => {

    // return a formatted div
    return ({children}:{children: ReactNode}) => {
        return <div className={cn}>{children}</div>
    }
}

export const Page = classDiv("page");
export const PageHeading = classDiv("page-heading");

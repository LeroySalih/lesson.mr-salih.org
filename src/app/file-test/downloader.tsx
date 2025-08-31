"use server"
import { getFiles } from "@/actions/file"
import { DownloadButton } from "./down-load-btn";
import { DownloadAllButton } from "./down-load-all-btn";

const Downloader = async ({path: clientPath}: {path: string}) => {

    const {data: files, error: filesError} = await getFiles(clientPath);

    return <div>
            <div>{
                files && files.map((f,i) => <div key={f}><DownloadButton name={f}/></div>)
            }</div>
            <DownloadAllButton />
            </div>
}


export default Downloader;
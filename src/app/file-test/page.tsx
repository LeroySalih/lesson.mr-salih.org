
import Uploader from "./uploader";
import dynamic from 'next/dynamic';
import ClientOnly from "./clientOnly";
import { getFiles } from "@/actions/file";
import { DownloadButton } from "./down-load-btn";
import { DownloadAllButton } from "./down-load-all-btn";
import Downloader from "./downloader";


const FilePage = async () => {
    const clientPath = "activity/pupilId";

    const {data: files, error} = await getFiles();

    return <div><div>File Test Page</div>
        
        <Downloader path={clientPath}/>
                
        <ClientOnly>
            <Uploader path={clientPath}/>
        </ClientOnly>
        
    </div>
}

export default FilePage;
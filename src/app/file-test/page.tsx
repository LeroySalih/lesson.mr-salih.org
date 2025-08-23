
import Uploader from "./uploader";
import dynamic from 'next/dynamic';
import ClientOnly from "./clientOnly";
import { getFiles } from "@/actions/file";
import { DownloadButton } from "./down-load-btn";
import { DownloadAllButton } from "./down-load-all-btn";


const FilePage = async () => {

    const {data: files, error} = await getFiles();

    return <div><div>File Test Page</div>
        {
            files.map((f,i) => <div key={f}><DownloadButton name={f}/></div>)
        }

        <DownloadAllButton />
                
        <ClientOnly>
            <Uploader/>
        </ClientOnly>
        <pre>
            {JSON.stringify(files, null, 2)}
        </pre>
    </div>
}

export default FilePage;
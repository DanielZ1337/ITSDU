import { useEffect, memo, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import useOfficeDocumentByElementId from '../../queries/resources/useOfficeDocumentByElementID';
import { Loader } from "@/components/ui/loader";

function OfficeDocuments() {
    const { elementId } = useParams();
    if (!elementId) {
        return <p>Invalid ID</p>;
    }
    const { isLoading, isError, data } = useOfficeDocumentByElementId(elementId)

    const handleSubmit = useCallback((accessToken: string, downloadUrl: string) => {
        const accessTokenInput = document.createElement('input');
        accessTokenInput.name = 'access_token';
        accessTokenInput.value = accessToken;
        accessTokenInput.type = 'hidden';

        const formId = "office_form"

        const oldForm = document.getElementById(formId);
        if (oldForm) {
            oldForm.remove();
        }
        const form = document.createElement('form');
        form.name = 'office_form';
        form.id = 'office_form';
        form.target = 'office_frame';
        form.action = downloadUrl;
        form.method = 'POST';

        document.body.appendChild(form);
        form.appendChild(accessTokenInput);

        const frameholder = document.getElementById('ctl00_MainFormContent_FileRepoViewer_ctl00');
        const office_frame = document.createElement('iframe');
        office_frame.name = 'office_frame';
        office_frame.id = 'office_frame';
        office_frame.title = 'Office Frame';
        office_frame.setAttribute('allowfullscreen', 'true');

        office_frame.setAttribute('frameborder', '0');
        office_frame.setAttribute('seamless', 'seamless');
        office_frame.setAttribute('style', 'width:100%;height:100%');

        frameholder?.appendChild(office_frame);

        form.submit();

        return () => {
            const oldForm = document.getElementById('office_form');
            if (oldForm) {
                oldForm.remove();
            }
            const oldFrame = document.getElementById('office_frame');
            if (oldFrame) {
                oldFrame.remove();
            }
        }
    }, []);

    const memoizedData = useMemo(() => data, [data]);

    useEffect(() => {
        if (memoizedData) {
            const accessToken = memoizedData.accessToken;
            const downloadUrl = memoizedData.downloadUrl;
            if (accessToken && downloadUrl) {
                return handleSubmit(accessToken, downloadUrl);
            }
        }
    }, [memoizedData, handleSubmit]);

    if (isLoading || !memoizedData) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader size={"md"} className={"m-auto"} />
            </div>
        )
    }

    if (isError && !isLoading) {
        return (
            <p>{isError}</p>
        )
    }

    return (
        <div id="ctl00_MainFormContent_FileRepoViewer_ctl00" className="h-full w-full">
            {/* {!isLoading && !error && accessToken && downloadUrl && (
                <iframe
                    name="office_frame"
                    id="office_frame"
                    title="Office Frame"
                    allowFullScreen
                    frameBorder="0"
                    seamless
                    style={{ width: '100%', height: '100%' }}
                    src={downloadUrl}
                ></iframe>
            )} */}
        </div>
    );
}

export default memo(OfficeDocuments);

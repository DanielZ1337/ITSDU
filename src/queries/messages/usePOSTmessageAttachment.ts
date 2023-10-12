import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import axios from "axios";
import {POSTmessageAttachment, POSTmessageAttachmentApiUrl} from "@/types/api-types/messages/POSTmessageAttachment.ts";

export default function usePOSTmessageAttachment(queryConfig?: UseMutationOptions<POSTmessageAttachment, Error, File[], string[]>) {

    return useMutation(['POSTmessageAttachment'], async (files) => {
        await new Promise(resolve => setTimeout(resolve, 10000));
        const formData = new FormData()
        files.forEach(file => {
            formData.append(`${file.name}`, file)
        })
        const res = await axios.post(POSTmessageAttachmentApiUrl(), formData, {
            params: {
                'access_token': localStorage.getItem('access_token'),
            }
        });

        console.log(res);

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    }, {
        ...queryConfig
    })
}
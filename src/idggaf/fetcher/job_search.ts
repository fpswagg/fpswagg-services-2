import axios from "axios";

import { JSearchJobData, JSearchJobDetails, JSearchSearchParam, JSearchDetailsParam } from "src/types";
import { rapidapiKey } from "src/variables";

export class JSearch {
    static async search(data: string | JSearchSearchParam) {
        return await perform_get<JSearchJobData[], JSearchSearchParam>("https://jsearch.p.rapidapi.com/search", typeof data === "string" ? { query: data } : data);
    }

    static async details(data: string | JSearchDetailsParam) {
        return [await perform_get<[JSearchJobDetails], JSearchDetailsParam>("https://jsearch.p.rapidapi.com/job-details", typeof data === "string" ? { job_id: data } : data)][0];
    }
}

export default JSearch;

type perform_result<T, M> = {
    status: string,
    request_id: string,
    parameters: M,
    data: T
}

export async function perform_get<T, M>(url: string, params?: M) {
    const { data: result } = await axios.request<perform_result<T, M>>({
        method: "GET",
        url,
        params,
        headers: {
            'x-rapidapi-key': rapidapiKey,
            'x-rapidapi-host': 'jsearch.p.rapidapi.com'
        }
    });

    return result.data;
}
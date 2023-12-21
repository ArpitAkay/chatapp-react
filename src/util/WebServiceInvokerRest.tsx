import axios, { AxiosResponse } from "axios";

interface Config {
    method: string;
    url: string;
    headers?: any;
    data?: any;
    params?: any;

}

export const WebServiceInvokerRest = async <T, U, V, X>(
    hostname: string, 
    urlContent: string, 
    method: string, 
    headers: T, 
    requestBody: U, 
    requestParams: V
    ): Promise<X> => {
    const config: Config = {
        method: method,
        url: hostname + urlContent,
    }

    if (headers) {
        config.headers = headers;
    }

    if (requestBody) {
        config.data = requestBody;
    }

    if (requestParams) {
        config.params = requestParams;
    }

    axios.interceptors.request.use(
        function (requestConfig) {
            console.log("Request sent:", requestConfig);
            return requestConfig;
        },
        function (error) {
            return Promise.reject(error);
        }
    );

    let response: any;
    try {
        response = await axios(config);
    }
    catch (err: any) {
        response = err.response;
    }

    axios.interceptors.response.use(
        function (response: AxiosResponse) {
            console.log("Response received:", response);
            return response;
        },
        function (error) {
            return Promise.reject(error);
        }
    );

    return response;
}
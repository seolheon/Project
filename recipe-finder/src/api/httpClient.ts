import axios from "axios"



export type ResponseType = 
  | 'arraybuffer' 
  | 'blob' 
  | 'document' 
  | 'json' 
  | 'text' 
  | 'stream'

export interface IRequest {
    url: string
    method?: string
    responseType?: ResponseType
    headers?: any
    params?: any
    data?: any
    paramsSerializer?: (params: object | string) => string
}

const makeRequest = ({
    url = "/",
    method = "get",
    responseType = "json",
    headers,
    params,
    data,
    paramsSerializer,
} : IRequest) =>
    axios({
        url,
        method,
        responseType,
        headers: { ...headers },
        params,
        data,
        paramsSerializer,
    })

    export default makeRequest

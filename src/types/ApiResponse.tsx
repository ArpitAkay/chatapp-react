export interface RESTException {
  detail: string;
  instance: string;
  status: number;
  title: string;
  type: string;
}

export interface APIResponse {
    config: object;
    data: any;
    headers: object;
    request: object;
    status: number;
} 
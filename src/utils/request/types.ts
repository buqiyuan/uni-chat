export interface RequestOptions extends Omit<UniApp.RequestOptions, 'method'> {
  baseURL?: string
  // method?: UniApp.RequestOptions['method'] | 'PATCH'
  [key: string]: any
}

export interface RequestConfig extends Omit<RequestOptions, 'url'> {
  baseURL?: string
  [key: string]: any
}

export type ResponseResult = UniApp.RequestSuccessCallbackResult | UniApp.GeneralCallbackResult

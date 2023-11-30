export enum APIErrorsSource {
  TEST = "TEST",
  BRIGHTID_CONNECTION_ERROR = "BRIGHTID_CONNECTION_ERROR",
}

export type APIError = {
  message: string
  source: APIErrorsSource
  statusCode: number
}

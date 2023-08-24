import { AxiosRequestConfig } from "axios";
import { Attachment, GlobalResult } from "../types/Types.ts";
import instance from "./index.ts";

export function upload(file: File, config?: AxiosRequestConfig | undefined): Promise<GlobalResult<Attachment>> {
  const data = new FormData()
  data.append("file", file)
  return instance.post('/attachment', data, config)
}

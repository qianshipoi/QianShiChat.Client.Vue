import { AxiosRequestConfig } from "axios";
import { Attachment, GlobalResult } from "../types/Types";
import instance from "./index";

export function upload(file: File, config?: AxiosRequestConfig | undefined): Promise<GlobalResult<Attachment>> {
  const data = new FormData()
  data.append("file", file)
  return instance.post('/attachment', data, config)
}

export function bindTusFile(fileId: string): Promise<GlobalResult<Attachment>> {
  return instance.put(`/attachment/bind-tus-file/${fileId}`)
}

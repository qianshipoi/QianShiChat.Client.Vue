import { DetailedError, HttpRequest, Upload } from 'tus-js-client'

const END_POINT = import.meta.env.VITE_APP_BASE_URL + "/api/tusfiles";

export class TusUpload {
  file: File;
  upload?: Upload;
  _onProgress?: (bytesSent: number, bytesTotal: number) => void;
  _onSuccess?: (fileId: string) => void;
  _onError?: (error: Error | DetailedError) => void;
  _authorizationFactory?: () => string;

  constructor(file: File) {
    this.file = file;
  }

  setProgress(callback: (bytesSent: number, bytesTotal: number) => void): TusUpload {
    this._onProgress = callback;
    return this;
  }

  setSuccess(callback: (fileId: string) => void): TusUpload {
    this._onSuccess = callback;
    return this;
  }

  setError(callback: (error: Error | DetailedError) => void): TusUpload {
    this._onError = callback;
    return this;
  }

  addAuthorizationFactory(factory: () => string): TusUpload {
    this._authorizationFactory = factory
    return this;
  }

  build(): TusUpload {
    this.upload = new Upload(this.file, {
      endpoint: END_POINT,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      chunkSize: 1024 * 1024 * 10,
      metadata: {
        filename: this.file.name,
        filetype: this.file.type
      },
      onError: this._onError,
      onProgress: this._onProgress,
      onSuccess: () => {
        const lastIndex = this.upload?.url?.lastIndexOf('/')!
        const fileId = this.upload?.url?.substring(lastIndex + 1)!;
        this._onSuccess && this._onSuccess(fileId);
      },
      onBeforeRequest: (req: HttpRequest) => {
        req.setHeader("Client-Type", "VueClient")
        // req.setHeader("Authorization", "Bearer [token]");
        !!this._authorizationFactory && req.setHeader("Authorization", this._authorizationFactory())
      }
    })
    return this;
  }

  start() {
    if (!this.upload) {
      throw new Error('uninitialized.')
    }
    this.upload?.findPreviousUploads().then((previousUploads) => {
      if (previousUploads.length) {
        this.upload?.resumeFromPreviousUpload(previousUploads[0]);
      }
      this.upload?.start();
    })
  }

  pause() {
    this.upload?.abort();
  }
}

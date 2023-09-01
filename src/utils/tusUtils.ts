import tus from 'tus-js-client'

const END_POINT = import.meta.env.VITE_APP_BASE_URL + "/tusfiles";

export class TusUpload {
  file: File;
  upload?: tus.Upload;
  _onProgress?: (bytesSent: number, bytesTotal: number) => void;
  _onSuccess?: () => void;
  _onError?: (error: Error | tus.DetailedError) => void;
  _authorizationFactory?: () => string;

  constructor(file: File) {
    this.file = file;
  }

  setProgress(callback: (bytesSent: number, bytesTotal: number) => void): TusUpload {
    this._onProgress = callback;
    return this;
  }

  setSuccess(callback: () => void): TusUpload {
    this._onSuccess = callback;
    return this;
  }

  setError(callback: (error: Error | tus.DetailedError) => void): TusUpload {
    this._onError = callback;
    return this;
  }

  addAuthorizationFactory(factory: () => string): TusUpload {
    this._authorizationFactory = factory
    return this;
  }

  build(): TusUpload {
    this.upload = new tus.Upload(this.file, {
      endpoint: END_POINT,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      metadata: {
        filename: this.file.name,
        filetype: this.file.type
      },
      onError: this._onError,
      onProgress: this._onProgress,
      onAfterResponse: (_: tus.HttpRequest, resp: tus.HttpResponse) => {
        console.log(resp);
      },
      onSuccess: () => {
        this._onSuccess && this._onSuccess();
      },
      onBeforeRequest: (req: tus.HttpRequest) => {
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

/**
 * 文件大小 字节转换单位
 * @param size
 * @returns {string|*}
 */
export const filterSize = (size: number): string => {

  if (!size) return '';
  if (size < pow1024(1)) return size + ' B';
  if (size < pow1024(2)) return (size / pow1024(1)).toFixed(2) + ' KB';
  if (size < pow1024(3)) return (size / pow1024(2)).toFixed(2) + ' MB';
  if (size < pow1024(4)) return (size / pow1024(3)).toFixed(2) + ' GB';
  return (size / pow1024(4)).toFixed(2) + ' TB'
}

// 求次幂
function pow1024(num: number): number {
  return Math.pow(1024, num)
}


export const downloadFile = (url: string, filename?: string): void => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename ?? "true";
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export const getFileExt = (filename: string): string => {
  const lastIndex = filename.lastIndexOf('.');
  if (lastIndex === -1) return '';
  return filename.substring(lastIndex)
}


export function createChunks(file: File, chunkSzie: number) {
  const result: Blob[] = []

  for (let i = 0;i < file.size;i += chunkSzie) {
    result.push(file.slice(i, i + chunkSzie))
  }

  return result;
}

export function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file);
    reader.onload = function () {
      resolve(reader.result as string)
    }
    reader.onerror = function () {
      reject()
    }
  })
}

export function base64ToFile(base64: string, filename: string, type: string) {
  console.log(base64);

  let arr = base64.split(",")!;
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type });
}


export function generateUUID(): string {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
};

export function delay(time: number): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(1), time)
  })
}

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

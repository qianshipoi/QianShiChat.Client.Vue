import { useEventListener } from "@vueuse/core";
import { ElNotification } from "element-plus";
import { filterSize } from '../../utils/index'

export const useRichText = (messageEditor: Ref<HTMLElement | null | undefined>) => {
  useEventListener(messageEditor, 'keydown', (event) => {
    if (event.code !== 'Backspace') {
      return;
    }
    event.preventDefault()
    if (messageEditor.value?.hasChildNodes()) {
      const lastNode = messageEditor.value.childNodes[messageEditor.value.childNodes.length - 1]
      console.log(lastNode.nodeName);
      if (lastNode.nodeName === '#text') {
        const textNode = (lastNode as HTMLTextAreaElement)
        const content = textNode.textContent?.trim();
        if (!content) {
          messageEditor.value?.removeChild(lastNode);
          return;
        }
        textNode.textContent = content.substring(0, content.length - 1);
      } else {
        messageEditor.value?.removeChild(lastNode);
      }
    }
  })

  useEventListener(messageEditor, 'paste', (event) => {
    event.preventDefault();
    console.log(event.clipboardData);

    const text = event.clipboardData?.getData('text/plain')
    if (!text) {
      return;
    }
    addText(text)
    const file = event.clipboardData!.files[0];
    console.log(file);
  })

  function getFileFromEntryRecursively(entry: FileSystemEntry) {
    if (entry.isFile) {
      (entry as FileSystemFileEntry).file(
        file => {
          console.log(file.name);
        },
        e => console.error(e))
    } else {
      let reader = (entry as FileSystemDirectoryEntry).createReader()
      console.log(entry.name);
      reader.readEntries(
        entries => {
          entries.forEach(enrty => getFileFromEntryRecursively(enrty))
        }, e => {
          console.log(e);
        })
    }
  }

  const includeFolder = (items: DataTransferItemList | null | undefined) => {
    if (!items) return
    for (let i = 0;i <= items.length - 1;i++) {
      let item = items[i];
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry()
        if (entry?.isDirectory) {
          return true
        }
      }
    }
    return false
  }

  useEventListener(messageEditor, 'drop', async (event) => {
    event.preventDefault();
    if (includeFolder(event.dataTransfer?.items)) {
      ElNotification.warning('不支持文件夹')
      return;
    }
    const files = event.dataTransfer?.files
    if (files && files?.length > 0) {
      for (let i = 0;i < files.length;i++) {
        const file = files[i];
        addFile(file);
      }
      return;
    }
    const text = event.dataTransfer?.getData('text/plain');
    if (!text) return;
    if (await isImage(text)) {
      addImage(text)
    } else {
      addText(text);
    }
  })

  const addText = (text: string) => {
    const span: HTMLSpanElement = document.createElement('span')
    span.innerText = text;
    messageEditor.value?.appendChild(span)
  }

  const addImage = (url: string) => {
    const img: HTMLImageElement = document.createElement('img')
    img.src = url;
    messageEditor.value?.appendChild(img)
  }

  type FileInfo = {
    file: File,
    div: HTMLDivElement
  }

  const files: FileInfo[] = []

  const addFile = (file: File) => {
    const div: HTMLDivElement = document.createElement('div');
    div.style.width = '240px';
    div.style.height = '80px';
    div.style.display = 'inline-grid';
    div.style.gridTemplateColumns = '1fr auto';
    div.style.gap = '8px'
    div.style.padding = '8px';
    div.style.borderRadius = '6px';
    div.style.overflow = 'hidden';
    div.style.backgroundColor = '#FFFFFF';
    div.style.verticalAlign = 'middle'
    div.contentEditable = 'false'

    const baseInfoDiv: HTMLDivElement = document.createElement('div');
    baseInfoDiv.style.display = 'flex';
    baseInfoDiv.style.flexDirection = 'column'
    baseInfoDiv.style.justifyContent = 'center'

    const name: HTMLSpanElement = document.createElement('span')
    name.innerText = file.name
    name.style.fontSize = '12px'
    baseInfoDiv.appendChild(name);
    const size: HTMLSpanElement = document.createElement('span')
    size.innerText = filterSize(file.size)
    size.style.fontSize = '12px'

    baseInfoDiv.appendChild(size);

    div.appendChild(baseInfoDiv)

    const icon: HTMLDivElement = document.createElement('div');
    icon.style.width = '48px';
    icon.style.height = '48px';
    icon.style.backgroundColor = '#0099FF';
    icon.style.borderRadius = '6px';
    div.appendChild(icon);

    files.push({ file, div });

    messageEditor.value?.appendChild(div)
  }

  const isImage = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url
      img.onload = function () {
        resolve(true)
      }
      img.onerror = function () {
        resolve(false)
      }
    })
  }
}

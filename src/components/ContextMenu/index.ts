import ContextMenu, { ContextMenuProps, MenuAction } from "./ContextMenu.vue";
import { h, render } from 'vue'

type Cur = {
  id: number;
  destroy: () => void
}

let curInstance: Cur | null = null
let seed = 1
const contextMenu = (e: MouseEvent, actions: MenuAction[], onClick: (action: MenuAction) => void) => {
  curInstance && curInstance.destroy()
  curInstance = null;
  let id = seed++
  const container = document.createElement('div')
  const appendTo = document.body;

  const props: ContextMenuProps = {
    actions,
    visible: true,
    onClick,
    onClose: () => {
      curInstance && curInstance.destroy()
    }
  }

  const vnode = h(ContextMenu, props)

  render(vnode, container)

  appendTo.appendChild(container.firstElementChild!);

  const curMenu = vnode.el as HTMLElement

  const { offsetWidth, offsetHeight } = curMenu

  const { clientWidth } = appendTo

  const { clientX, clientY } = e

  const leftOrRight = clientWidth - clientX > offsetWidth ? 'left' : 'right'
  const topOrBottom = window.innerHeight - clientY > offsetHeight ? 'top' : 'bottom'
  const offsetLeft = Math.abs(clientWidth - clientX)
  curMenu!.style[leftOrRight] = leftOrRight === 'left' ? `${clientX + 20}px` : `${offsetLeft}px`
  curMenu!.style[topOrBottom] = topOrBottom === 'bottom' ? '2px' : `${clientY}px`

  const instance = {
    id,
    destroy: () => {
      curInstance = null
      render(null, container)
    }
  }
  curInstance = instance
  return instance
}

export default contextMenu

import { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import type { pageIndex } from '../../../types/types'
const GardLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 100px);
  align-items: center;
  justify-items: center;
  gap: 20px;
`
const GardLayoutItem = styled.div`
  border: 1px solid #eee;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 100px;
  user-select: none;
  transform: translate3d(0, 0, 0);
`

const DraggableLayout: pageIndex = function () {
  const nodeRef = useRef<HTMLDivElement | null>(null)
  const draggableNode = useRef<HTMLDivElement | null>(null)
  const [config, setConfig] = useState({ currentX: 0, currentY: 0, currentTop: 0, currentLeft: 0 })
  const [list, setList] = useState([1, 2, 3, 4, 5, 6, 7, 8])
  const clearEffect = useCallback(() => {
    if (!nodeRef.current) return
    nodeRef.current.style.backgroundColor = 'transparent'
    nodeRef.current = null
    if (draggableNode.current) {
      draggableNode.current.remove()
    }
    draggableNode.current = null
    setConfig(() => ({ currentLeft: 0, currentTop: 0, currentX: 0, currentY: 0 }))
  }, [setConfig])
  return (
    <GardLayout
      onPointerMove={(e) => {
        if (!nodeRef.current) return
        nodeRef.current.style.backgroundColor = 'skyblue'
        if (draggableNode.current === null) {
          draggableNode.current = nodeRef.current.cloneNode(true) as HTMLDivElement
          draggableNode.current.className = nodeRef.current.classList.value + ' draggable-active'
          const { width, height, top, left } = nodeRef.current.getBoundingClientRect()
          draggableNode.current.style.width = `${width}px`
          draggableNode.current.style.height = `${height}px`
          draggableNode.current.style.opacity = `0.4`
          setConfig(() => ({ currentX: e.clientX, currentY: e.clientY, currentLeft: left, currentTop: top }))
          return
        }
        const newNode = draggableNode.current
        newNode.style.position = 'absolute'
        newNode.style.top = '0px'
        newNode.style.left = '0px'
        newNode.style.transform = `translate3d(
          ${config.currentLeft + (e.clientX - config.currentX)}px,${config.currentTop + (e.clientY - config.currentY)}px,0`
        newNode.style.pointerEvents = 'none'
        document.body.appendChild(newNode)
      }}
      onPointerUp={clearEffect}
      onPointerLeave={clearEffect}
    >
      {list.map((value) => (
        <GardLayoutItem
          key={value}
          onPointerDown={(e) => {
            nodeRef.current = e.target as HTMLDivElement
          }}
          onPointerOver={(e) => {
            const newNode = draggableNode.current
            const node = e.target as HTMLDivElement
            if (!newNode) return
            const prevKey = newNode.getAttribute('data-value')!
            const nextKey = node.getAttribute('data-value')!
            if (newNode && prevKey !== nextKey) {
              let prevIndex = 0,
                nextIndex = 0
              for (let i = 0; i < list.length; i++) {
                if (String(list[i]) === prevKey) {
                  prevIndex = i
                } else if (String(list[i]) === nextKey) {
                  nextIndex = i
                }
              }
              const tempList: number[] = []
              let i = 0
              while (i < list.length) {
                if (i === prevIndex) {
                  i++
                  continue
                }
                // prevIndex < nextIndex ????????????nextIndex??????
                if (prevIndex < nextIndex) {
                  tempList.push(list[i])
                  if (i === nextIndex) {
                    tempList.push(Number(prevKey))
                  }
                  // prevIndex > nextIndex ????????????nextIndex??????
                } else {
                  if (i === nextIndex) {
                    tempList.push(Number(prevKey))
                  }
                  tempList.push(list[i])
                }
                i++
              }
              setList(() => tempList)
            }
          }}
          data-value={value}
        >
          {value}
        </GardLayoutItem>
      ))}
    </GardLayout>
  )
}
DraggableLayout._pagesTitle = '??????????????????'
export default DraggableLayout

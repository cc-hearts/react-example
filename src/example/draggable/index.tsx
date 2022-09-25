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
  transition: all 0.1s ease-in;
`

// TODO: 动画效果未添加

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
  }, [])
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
        ;(newNode.style.top = config.currentTop + (e.clientY - config.currentY) + 'px'),
          (newNode.style.left = config.currentLeft + (e.clientX - config.currentX) + 'px')
        newNode.style.pointerEvents = 'none'
        document.body.appendChild(newNode)
        // 克隆一份组件 然后移动位置
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
            if (!newNode) return
            const node = e.target as HTMLDivElement
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
                if (i !== prevIndex && i !== nextIndex) {
                  tempList.push(list[i])
                } else {
                  tempList.push(Number(i === prevIndex ? nextKey : prevKey))
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
DraggableLayout._pagesTitle = '拖拽案例布局'
export default DraggableLayout

import type { pageIndex } from '../types/types'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`
export default function App() {
  // 导入首页
  const [indexList, setIndexList] = useState<pageIndex[]>([])
  useEffect(() => {
    const modules = import.meta.glob('./example/**/index.(ts|tsx|js|jsx)')
    Object.keys(modules).forEach(async (keys) => {
      const moduleIndex = await modules[keys]()
      setIndexList((state) => {
        return [...state, moduleIndex.default as pageIndex]
      })
    })
  }, [])
  return (
    <>
      {indexList.map((Children, index) => {
        return (
          <Title key={index}>
            <Children />
          </Title>
        )
      })}
    </>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import get from 'lodash.get'

const RenderEditorJs = ({ data: propData, index } : {data: string; index: string}) => {
  const [data, setData] = useState(propData)
  const editorCore = useRef(null)

  let ReactEditorJS
  let dataParse: any

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setData(propData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dataParse = JSON.parse(propData)
    editorCore.current?.render(dataParse)
  }, [propData])

  const handleInitialize = useCallback((instance) => {
    editorCore.current = instance
  }, [])

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createReactEditorJS } = require('react-editor-js')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { EDITOR_JS_TOOLS } = require('@/utils/editorTools')

    ReactEditorJS = createReactEditorJS()

    dataParse = data && JSON.parse(data)

    const blocks = get(dataParse, 'blocks')

    blocks && (dataParse.blocks = blocks?.filter(block => ['image', 'paragraph', 'list', 'quote', 'linkTool', 'header', 'delimiter', 'table'].includes(block.type)))

    return mounted
      ? (
        data
          ? <ReactEditorJS tools={EDITOR_JS_TOOLS} defaultValue={dataParse} readOnly={true} holder={index} onInitialize={handleInitialize}>
            <div id={index} />
          </ReactEditorJS>
          : <div></div>
      )
      : (
        <div>
          Need render on client
        </div>
      )
  }

  return (
    <div>
      Need render on client
    </div>
  )
}

export default RenderEditorJs

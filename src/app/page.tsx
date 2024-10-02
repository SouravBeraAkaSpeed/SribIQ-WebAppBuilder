import Layout from '@/components/MainLayout/Layout'
import EditorProvider from '@/providers/editor/editor-provider'
import React from 'react'

const Page = () => {
  return (
    <main className='h-screen w-screen m-0 '>

      <EditorProvider>
        <div className='w-screen h-screen m-0 '>
          <Layout />
        </div>
      </EditorProvider>
    </main>
  )
}

export default Page
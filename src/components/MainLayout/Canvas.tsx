"use client"
import { useEditor } from '@/providers/editor/editor-provider'
import React from 'react'
import Recursive from '../Recursive/Recursive'

const Canvas = () => {
    const { state } = useEditor()
    

    return (
        <div className={`${state.pages[state.currentPageIndex].editor.device === "Desktop" && 'min-w-full max-w-full'}  ${state.pages[state.currentPageIndex].editor.device === "Tablet" && 'min-w-[70%] max-w-[70%]'}  ${state.pages[state.currentPageIndex].editor.device === "Mobile" && 'min-w-[40%] max-w-[40%]'} ${!state.pages[state.currentPageIndex].editor.previewMode && 'rounded-[20px]'} use-automation-zoom-in   min-h-full  overflow-auto flex flex-col bg-white border-2 p-0 m-0 text-black`}>

            {Array.isArray(state.pages[state.currentPageIndex].editor.elements) &&
                state.pages[state.currentPageIndex].editor.elements.map((childElement) => (
                    <Recursive
                        key={childElement.id}
                        element={childElement}
                    />
                ))}



        </div>
    )
}

export default Canvas
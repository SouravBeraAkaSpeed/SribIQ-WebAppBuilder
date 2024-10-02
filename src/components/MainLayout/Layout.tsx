"use client"
import React from 'react'
import Navbar from '../Navbar/Navbar'
import LeftSideBar from './LeftSideBar'
import Canvas from './Canvas'
import RightSideBar from './RightSideBar'
import { useEditor } from '@/providers/editor/editor-provider'
import ToolTip from '../ToolTip'
import { Eye, EyeOff } from 'lucide-react'

const Layout = () => {

    const { state, dispatch } = useEditor()

    return (
        <div className='flex flex-col m-0 h-screen w-screen items-center justify-center '>


            {state.pages[state.currentPageIndex].editor.previewMode ?
                (
                    <div className='w-screen h-full m-0 p-0'>
                        <div className='fixed top-10 right-10 w-[50px] z-400 h-[50px]'>
                            <ToolTip tooltip='Preview Off'>
                                <div onClick={() => {
                                    dispatch({
                                        type: 'TOGGLE_PREVIEW_MODE'
                                    })
                                }} className='flex p-2   bg-white border-2 border-black rounded-[10px] text-black  cursor-pointer'>
                                    {state.pages[state.currentPageIndex].editor.previewMode ? <EyeOff /> : <Eye />}
                                </div>
                            </ToolTip>
                        </div>
                        <Canvas />
                    </div>
                ) :
                (<div className='flex flex-col m-0 h-screen w-screen'>
                    <div className='flex w-full h-[59px] justify-center '>
                        <Navbar />
                    </div>

                    <div className='flex space-x-4 px-6 py-6 w-full h-full bg-transparent'>

                        <div className='flex flex-col rounded-[20px] bg-black h-full w-[20%]'>
                            <LeftSideBar />
                        </div>

                        <div className='flex flex-col items-center justify-center rounded-[20px] h-full w-[60%]'>
                            <Canvas />
                        </div>

                        <div className='flex flex-col rounded-[20px] bg-black h-full w-[20%]'>
                            <RightSideBar />
                        </div>
                    </div>
                </div>)}


        </div>
    )
}

export default Layout
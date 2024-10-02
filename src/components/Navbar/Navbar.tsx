"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ArrowLeft, Eye, EyeOff, Laptop, LucidePhone, Moon, MoonIcon, Phone, Redo, Smartphone, Sparkles, SunIcon, Tablet, TabletSmartphone, Undo } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import ToolTip from '../ToolTip'
import { DeviceTypes, useEditor } from '@/providers/editor/editor-provider'

const Navbar = () => {
    const router = useRouter()

    const { state, dispatch } = useEditor();


    return (
        <div className='w-[90%] h-full m-2 rounded-[30px] text-white bg-black  items-center justify-center flex'>
            <div className='flex border-r-[1px] border-r-gray-500 items-center space-x-2 px-4 pl-24 justify-center'>



                <ToolTip tooltip='Ai Magic | Prompt the website you need'>
                    <Sparkles size={28} className='m-0 p-1 rounded-full border-2' />
                </ToolTip>

                <div className='mx-1'>
                    Ai
                </div>

            </div>

            <div className='mx-4 flex items-center space-x-2'>
                <ToolTip tooltip='Go back'>
                    <ArrowLeft className='cursor-pointer' onClick={() => router.push("/neura-ai")} />
                </ToolTip>
                <div className='flex flex-col'>
                    <div className='flex text-sm'>
                        Neura Ai - [ Task Mode ]
                    </div>

                    <div className='flex text-xs font-bold text-gray-500'>
                        Go back
                    </div>

                </div>
            </div>


            <div className='flex items-center justify-center flex-1 '>
                <Tabs value={state.pages[state.currentPageIndex].editor.device} onValueChange={(value) => {

                    dispatch({
                        type: 'CHANGE_DEVICE',
                        payload: {
                            device: value as DeviceTypes
                        }

                    })

                }} className="w-1/2 flex bg-transparent items-center justify-center">
                    <TabsList className='bg-transparent flex items-center justify-center'>

                        <TabsTrigger value="Desktop"> <Laptop /></TabsTrigger>


                        <TabsTrigger value="Tablet">  <Tablet /></TabsTrigger>


                        <TabsTrigger value="Mobile"> <Smartphone /> </TabsTrigger>

                    </TabsList>
                </Tabs>
            </div>

            <div className='flex items-center justify-center px-3'>
                <div className='flex items-center justify-center border-r-[1px] px-2 border-r-gray-500 '>
                    <ToolTip tooltip='Undo'>
                        <div className='flex p-2 cursor-pointer'>
                            <Undo className={`${!(state.pages[state.currentPageIndex].history.currentIndex > 0) && 'text-gray-500'}`} onClick={() => {
                                if ((state.pages[state.currentPageIndex].history.currentIndex > 0)) {
                                    dispatch({ type: 'UNDO' })
                                }
                            }} />
                        </div>
                    </ToolTip>
                    <ToolTip tooltip='Redo'>
                        <div className='flex p-2 cursor-pointer'>
                            <Redo className={`${!(state.pages[state.currentPageIndex].history.currentIndex < state.pages[state.currentPageIndex].history.history.length - 1) && 'text-gray-500'}`} onClick={() => {
                                if ((state.pages[state.currentPageIndex].history.currentIndex < state.pages[state.currentPageIndex].history.history.length - 1)) {
                                    dispatch({ type: 'REDO' })
                                }
                            }} />
                        </div>
                    </ToolTip>
                </div>

                <div className='flex items-center justify-center border-r-[1px] px-2 border-r-gray-500'>
                    <ToolTip tooltip='change theme'>
                        <div className='flex p-2 cursor-pointer'>
                            <SunIcon />
                        </div>
                    </ToolTip>
                    <ToolTip tooltip='Preview'>
                        <div onClick={() => {
                            dispatch({
                                type: 'TOGGLE_PREVIEW_MODE'
                            })
                        }} className='flex p-2  cursor-pointer'>
                            {state.pages[state.currentPageIndex].editor.previewMode ? <EyeOff /> : <Eye />}
                        </div>
                    </ToolTip>
                </div>

                <div className='flex items-center justify-center px-2 '>
                    <Button className='bg-transparent border-2 rounded-full hover:shadow-md hover:shadow-purple-400 px-10 mx-4'>
                        Deploy
                    </Button>
                </div>


            </div>

        </div>
    )
}

export default Navbar
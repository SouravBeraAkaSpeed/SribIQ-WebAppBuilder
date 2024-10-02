"use client"
import { cn } from '@/lib/utils'
import { Plus, Search } from 'lucide-react'
import React, { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'


interface RecursiveAccordionProps {
    elements: EditorElement[];
}


const RecursiveAccordion: React.FC<RecursiveAccordionProps> = ({ elements }) => {
    const { state, dispatch } = useEditor()

    return (
        <>
            <Accordion type="multiple" className="w-full max-h-[50%]" >
                {elements.map((element) => (
                    <AccordionItem key={element.id} value={element.id} onMouseEnter={() => {
                        dispatch({
                            type: 'CHANGE_CLICKED_ELEMENT',
                            payload: {
                                elementDetails: element
                            }
                        })
                    }}>
                        <AccordionTrigger>{element.name}</AccordionTrigger>
                        <AccordionContent className="flex flex-col pl-4 mt-3">
                            {Array.isArray(element.content) ? (
                                <RecursiveAccordion elements={element.content} />
                            ) : (
                                <div>
                                    {element.content.href && <a href={element.content.href}>{element.content.innerText}</a>}
                                    {element.content.src && <> <img src={element.content.src} alt={element.content.innerText} /> {element.content.innerText}</>}
                                    {element.content.innerText && !element.content.href && !element.content.src && (
                                        <span>{element.content.innerText}</span>
                                    )}
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>


        </>
    );
};

const LeftSideBar = () => {

    const { state, dispatch } = useEditor()
    const [isEditing, setIsEditing] = useState(false);

    const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'CHANGE_PROJECT_NAME',
            payload: {
                name: e.target.value
            }
        })
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };


    return (
        <div className='w-full h-full flex flex-col bg-transparent px-4 py-2 text-white'>

            <div className='w-full  h-fit border-gray-500 flex  p-2 text-sm my-3 '>
                {isEditing ? (
                    <input
                        type="text"
                        value={state.projectName}
                        onChange={handleContentChange}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className=" w-[85%] p-2 rounded-[10px] bg-transparent text-white border-0"
                    />
                ) : (
                    <div
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer text-sm text-gray-500"
                    >
                        Project : {state.projectName}
                    </div>
                )}
            </div>

            <div className="relative w-full flex max-w-sm h-fit ">
                <input
                    type="text"
                    placeholder="Search"
                    // value={value}
                    // onChange={onChange}
                    className={cn(
                        'w-full px-4 py-2 pr-10 border-2 text-white border-gray-800  bg-transparent rounded-full shadow-md shadow-black',
                        'focus:outline-none focus:ring-2 text-white focus:ring-gray-500 focus:border-transparent'
                    )}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>


            <div className='w-full border-b-[1px] h-fit border-gray-500 flex  p-2 text-sm mt-5  '>
                <div className='flex flex-1'>Pages</div>
                <div className='flex text-gray-500 cursor-pointer'>
                    <Plus onClick={() => {
                        dispatch({
                            type: 'ADD_PAGE'
                        })
                    }} />
                </div>
            </div>

            <div className='w-full min-h-[220px] overflow-y-auto nobg-scrollbar mb-3  border-gray-500 flex flex-col  py-5  space-y-4 text-sm   '>

                {state.pages.map((page, index) => (
                    <div key={index} onClick={() => {
                        dispatch({
                            type: 'CHANGE_PAGE',
                            payload: {
                                change_index: index
                            }
                        })
                    }} className={`flex cursor-pointer rounded-full px-4 p-2 ${state.currentPageIndex === index && 'border-[1px] bg-gray-500  border-gray-500'}`}>{page.pageName}</div>
                ))}

            </div>

            <div className='w-full flex h-fit border-b-[1px] items-center  border-gray-500 '>
                <div className='flex p-2 w-full space-x-2 items-center justify-between'>
                    <div className='flex'>
                        Layers
                    </div>
                    <Search size={20} className='text-gray-500' />
                </div>
            </div>


            <div className='flex flex-col w-full h-full mt-10 overflow-y-auto nobg-scrollbar'>

                <div className='flex flex-col w-full p-2 space-y-4 items-center h-full justify-start overflow-y-auto nobg-scrollbar'>
                    <RecursiveAccordion elements={state.pages[state.currentPageIndex].editor.elements} />

                </div>
            </div>




        </div>
    )
}

export default LeftSideBar
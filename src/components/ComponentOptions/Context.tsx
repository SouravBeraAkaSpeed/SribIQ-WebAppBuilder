"use client"
import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { EditorElement, ResponsiveStyles, useEditor } from "@/providers/editor/editor-provider"
import { Copy } from "lucide-react"
import ToolTip from "../ToolTip"
import { v4 } from "uuid"

export function Options({ children, element }: { children: React.ReactNode, element: EditorElement }) {

    const { state, dispatch } = useEditor()
    return (
        <ContextMenu>
            <ContextMenuTrigger typeof="div">
                <ToolTip tooltip="right click">
                    {children}
                </ToolTip>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-60">

                {element.type !== "__body" && (

                    <ContextMenuItem onClick={() => {
                        dispatch({
                            type: 'COPY_ELEMENT',
                            payload: {
                                elementDetails: element
                            }
                        })
                    }} inset className="cursor-pointer">
                        Copy Element
                        <ContextMenuShortcut>⌘E</ContextMenuShortcut>
                    </ContextMenuItem>
                )}
                <ContextMenuItem onClick={() => {

                    if (state.pages[state.currentPageIndex].LastCopiedElement) {

                        dispatch({
                            type: 'ADD_ELEMENT',
                            payload: {
                                containerId: element.id,
                                elementDetails: {
                                    ...state.pages[state.currentPageIndex].LastCopiedElement as EditorElement,
                                    id: v4()
                                }
                            }
                        })
                    }
                }} inset className="cursor-pointer">
                    Paste Element
                    <ContextMenuShortcut>⌘P</ContextMenuShortcut>
                </ContextMenuItem>

                <ContextMenuItem inset onClick={() => {
                    dispatch({
                        type: 'COPY_STYLES',
                        payload: {
                            elementStyles: element.styles
                        }
                    })
                }} className="cursor-pointer">
                    Copy Styles
                    <ContextMenuShortcut>⌘S</ContextMenuShortcut>
                </ContextMenuItem>

                {element.type !== "__body" && (
                    <>
                        <ContextMenuItem inset onClick={() => {

                            if (state.pages[state.currentPageIndex].LastCopiedStyles) {

                                const new_element = {
                                    ...state.pages[state.currentPageIndex].editor.selectedElement,
                                    styles: state.pages[state.currentPageIndex].LastCopiedStyles as ResponsiveStyles
                                }

                                dispatch({
                                    type: 'UPDATE_ELEMENT',
                                    payload: {
                                        elementDetails: new_element
                                    }
                                })
                            }
                        }} className="cursor-pointer">
                            Paste Styles
                            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => {
                            dispatch({
                                type: 'DELETE_ELEMENT',
                                payload: {
                                    elementDetails: element
                                }
                            })
                        }} inset className="cursor-pointer">
                            Delete Element
                            <ContextMenuShortcut>⌘D</ContextMenuShortcut>
                        </ContextMenuItem>
                    </>
                )}
                {/* <ContextMenuSub>
                    <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-48">
                        <ContextMenuItem>
                            Save Page As...
                            <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                        <ContextMenuItem>Name Window...</ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem>Developer Tools</ContextMenuItem>
                    </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSeparator />
                <ContextMenuCheckboxItem checked>
                    Show Bookmarks Bar
                    <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
                </ContextMenuCheckboxItem>
                <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
                <ContextMenuSeparator />
                <ContextMenuRadioGroup value="pedro">
                    <ContextMenuLabel inset>People</ContextMenuLabel>
                    <ContextMenuSeparator />
                    <ContextMenuRadioItem value="pedro">
                        Pedro Duarte
                    </ContextMenuRadioItem>
                    <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
                </ContextMenuRadioGroup> */}
            </ContextMenuContent>
        </ContextMenu>
    )
}

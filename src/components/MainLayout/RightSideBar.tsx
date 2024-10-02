"use client"
import { AlignCenter, AlignHorizontalJustifyCenterIcon, AlignHorizontalJustifyEndIcon, AlignHorizontalJustifyStart, AlignHorizontalSpaceAround, AlignHorizontalSpaceBetween, AlignJustify, AlignLeft, AlignRight, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, AlignVerticalJustifyStart, AlignVerticalJustifyStartIcon, ChevronsLeftRightIcon, Code, Code2, Copy, Cylinder, CylinderIcon, Database, ImagePlus, LucideCylinder, LucideImageDown, Palette, Plus, Settings, Trash, Trash2, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ToolTip from '../ToolTip'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Slider } from '../ui/slider'
import { EditorBtns } from '@/lib/constants'
import TextPlaceholder from '../ComponentPlaceholders/TextPLaceholder'
import ContainerPlaceholder from '../ComponentPlaceholders/ContainerPlaceholder'
import TwoColumnsPlaceholder from '../ComponentPlaceholders/TwoColumnsPlaceholder'
import VideoPlaceholder from '../ComponentPlaceholders/VideoPlaceholder'
import CheckoutPlaceholder from '../ComponentPlaceholders/CheckoutPlaceholder'
import ContactFormComponentPlaceholder from '../ComponentPlaceholders/ContactFormComponentPlaceholder'
import LinkPlaceholder from '../ComponentPlaceholders/LinkPlaceholder'
import { DeviceTypes, ObjectFit, PositionType, ResponsiveStyles, TextAlign, useEditor } from '@/providers/editor/editor-provider'
import { stat } from 'fs'
import { toast } from '../ui/use-toast'
import { Textarea } from '../ui/textarea'
import ImagePlaceholder from '../ComponentPlaceholders/ImagePLaceHolder'
import ThreeColumnsPlaceholder from '../ComponentPlaceholders/ThreeColumnsPlaceholder'
import FourQuatersPlaceholder from '../ComponentPlaceholders/FourQuatersPlaceholder'
import ColorPicker from 'react-pick-color';
import { Badge } from '../ui/badge'
import { URL } from 'url'
import EmbedPlaceholder from '../ComponentPlaceholders/EmbedPLaceHolder'

const RightSideBar = () => {

    const [CurrentTab, setCurrentTab] = useState("Styles")
    const [isEditing, setIsEditing] = useState(false);
    const { state, dispatch } = useEditor()
    const [isTextColorPicker, setIsTextColorPicker] = useState(false)
    const [isBgColorPicker, setIsBgColorPicker] = useState(false)
    const [cssInput, setCssInput] = useState<string>(JSON.stringify(state.pages[state.currentPageIndex].editor.selectedElement.styles));

    function isValidJSON(styles: ResponsiveStyles) {
        try {
            JSON.parse(JSON.stringify(styles));
            return true;
        } catch (e) {
            return false;
        }
    }

    function isValidJSONString(jsonString: string) {
        try {
            JSON.parse(jsonString);
            return true;
        } catch (e) {
            return false;
        }
    }

    useEffect(() => {


        if (isValidJSON(state.pages[state.currentPageIndex].editor.selectedElement.styles)) {

            setCssInput(JSON.stringify(state.pages[state.currentPageIndex].editor.selectedElement.styles))
        }


    }, [state.pages[state.currentPageIndex].editor.selectedElement.styles])




    const elements: {
        Component: React.ReactNode
        label: string
        id: EditorBtns
        group: 'layout' | 'elements'
    }[] = [
            {
                Component: <TextPlaceholder />,
                label: 'Text',
                id: 'text',
                group: 'elements',
            },

            {
                Component: <ContainerPlaceholder />,
                label: 'Container',
                id: 'container',
                group: 'layout',
            },
            {
                Component: <TwoColumnsPlaceholder />,
                label: '2 Columns',
                id: '2Col',
                group: 'layout',
            },
            {
                Component: <FourQuatersPlaceholder />,
                label: '4 Quaters',
                id: '4Quaters',
                group: 'layout',
            },
            {
                Component: <ThreeColumnsPlaceholder />,
                label: '3 Columns',
                id: '3Col',
                group: 'layout'
            },
            {
                Component: <ImagePlaceholder />,
                label: 'Image',
                id: 'image',
                group: 'elements',
            },
            {
                Component: <VideoPlaceholder />,
                label: 'Video',
                id: 'video',
                group: 'elements',
            },
            {
                Component: <ContactFormComponentPlaceholder />,
                label: 'Contact',
                id: 'contactForm',
                group: 'elements',
            },
            {
                Component: <CheckoutPlaceholder />,
                label: 'Checkout',
                id: 'paymentForm',
                group: 'elements',
            },
            {
                Component: <LinkPlaceholder />,
                label: 'Link',
                id: 'link',
                group: 'elements',
            },
            {
                Component: <EmbedPlaceholder />,
                label: 'Embed',
                id: 'embed',
                group: 'elements',
            },
        ]

    const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'CHANGE_PAGE_NAME',
            payload: {
                name: e.target.value,
                index: state.currentPageIndex
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

    const parseJsonCssInput = (input: string): ResponsiveStyles | null => {
        try {
            const styles = JSON.parse(input) as ResponsiveStyles;
            return styles;
        } catch (error) {
            console.error('Invalid JSON:', error);
            return null;
        }
    };


    const getResponsiveStyles = (styles: {
        default: React.CSSProperties;
        mobile?: React.CSSProperties;
        tablet?: React.CSSProperties;
        desktop?: React.CSSProperties;
    }) => {
        if (typeof window !== "undefined") {
            if (window.matchMedia("(max-width: 450px)").matches || state.pages[state.currentPageIndex].editor.device === "Mobile") {
                return { ...styles.default, ...styles.mobile };
            } else if (window.matchMedia("(max-width: 900px)").matches || state.pages[state.currentPageIndex].editor.device === "Tablet") {
                return { ...styles.default, ...styles.tablet };
            } else {
                return { ...styles.default, ...styles.desktop };
            }
        } else {

            return styles.default;
        }
    };



    const updateStylesForDevice = (
        currentStyles: ResponsiveStyles,
        deviceType: DeviceTypes,
        newStyles: React.CSSProperties
    ): ResponsiveStyles => {
        const updatedStyles = { ...currentStyles };

        switch (deviceType) {
            case 'Mobile':
                updatedStyles.mobile = { ...updatedStyles.mobile, ...newStyles };
                break;
            case 'Tablet':
                updatedStyles.tablet = { ...updatedStyles.tablet, ...newStyles };
                break;
            case 'Desktop':
                updatedStyles.desktop = { ...updatedStyles.desktop, ...newStyles };
                break;
            default:
                updatedStyles.default = { ...updatedStyles.default, ...newStyles };
        }

        return updatedStyles;
    };



    return (
        <div className='w-full h-full flex flex-col bg-transparent  text-white'>

            <div className='flex w-full h-[50px] items-center justify-between p-4 border-b-[1px] border-gray-500'>
                <div className='flex flex-1'>
                    {isEditing ? (
                        <input
                            type="text"
                            value={state.pages[state.currentPageIndex].pageName}
                            onChange={handleContentChange}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className=" w-[85%] p-2 rounded-[10px] bg-transparent text-white border-0"
                        />
                    ) : (
                        <div
                            onClick={() => setIsEditing(true)}
                            className="cursor-pointer"
                        >
                            {state.pages[state.currentPageIndex].pageName}
                        </div>
                    )}
                </div>
                <div className='flex items-center justify-center space-x-3'>
                    <ToolTip tooltip='Nextjs Code'>
                        <Code2 size={20} onClick={async () => {
                            await navigator.clipboard.writeText(state.pages[state.currentPageIndex].pageName)

                            toast({
                                title: "Copied!!"
                            })
                        }} />
                    </ToolTip>
                    <ToolTip tooltip='Copy title'>
                        <Copy size={20} onClick={async () => {
                            await navigator.clipboard.writeText(state.pages[state.currentPageIndex].pageName)

                            toast({
                                title: "Copied!!"
                            })
                        }} />
                    </ToolTip>
                    <ToolTip tooltip='Delete Page'>
                        <Trash2 size={20} onClick={() => {
                            dispatch({
                                type: 'DELETE_PAGE',
                                payload: {
                                    deleteIndex: state.currentPageIndex
                                }
                            })
                        }} />
                    </ToolTip>
                </div>

            </div>

            <div className='flex w-full h-full space-x-0 items-center justify-start overflow-hidden'>

                <div className='flex flex-1 flex-col h-full border-0 w-[83%] items-start space-y-2 justify-start p-4  border-gray-500'>

                    {CurrentTab === "Styles" && (
                        <>
                            <div className='flex text-sm w-full'>
                                Styles
                            </div>
                            <div className='flex text-xs w-full text-gray-500'>
                                Show your creativity! You can customize every component as you like.
                            </div>

                            <Accordion
                                type="multiple"
                                className="w-full bg-transparent overflow-y-auto nobg-scrollbar max-h-full space-y-4"
                                defaultValue={['Typography', 'Embed', 'Background', 'Custom', 'Effects', 'Dimensions', 'Decorations', 'Position', 'Flexbox', 'Image', 'Animations']}
                            >
                                {state.pages[state.currentPageIndex].editor.selectedElement.type === 'image' && (

                                    <AccordionItem
                                        value="Image"
                                        className="w-full"
                                    >
                                        <AccordionTrigger className="!no-underline">Image</AccordionTrigger>
                                        <AccordionContent className="flex flex-col gap-2 w-full bg-transparent p-2">

                                            <div className="flex flex-col gap-2 w-full">
                                                <p className="text-muted-foreground">Object-Fit</p>
                                                <Select value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).objectFit || ""} onValueChange={(value) => {
                                                    dispatch({
                                                        type: 'UPDATE_ELEMENT',
                                                        payload: {
                                                            elementDetails: {
                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                styles: {
                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { objectFit: value as ObjectFit })

                                                                }
                                                            }
                                                        }
                                                    })
                                                }}>
                                                    <SelectTrigger className="w-full bg-transparent">
                                                        <SelectValue placeholder="Select the Object fit" />
                                                    </SelectTrigger>
                                                    <SelectContent className='bg-black text-white'>
                                                        <SelectGroup className='bg-transparent'>
                                                            <SelectItem value="fill">Fill</SelectItem>
                                                            <SelectItem value="contain">Contain</SelectItem>
                                                            <SelectItem value="cover">Cover</SelectItem>
                                                            <SelectItem value="none">None</SelectItem>
                                                            <SelectItem value="scale-down">Scale-down</SelectItem>


                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>

                                            </div>

                                            <div className="flex  w-full items-center justify-center">

                                                <div className='w-full space-y-2 bg-transparent'>
                                                    <Label className="text-muted-foreground">Src</Label>
                                                    <div className='flex space-x-2 w-full items-center justify-between'>

                                                        <Input
                                                            placeholder="https://image-url.com/"
                                                            id="imageSrc"
                                                            className='bg-transparent text-xs'
                                                            value={(state.pages[state.currentPageIndex].editor.selectedElement.content as { href?: string | undefined; innerText?: string | undefined; src?: string | undefined; }).src}
                                                            onChange={(e) => {
                                                                dispatch({
                                                                    type: 'UPDATE_ELEMENT',
                                                                    payload: {
                                                                        elementDetails: {
                                                                            ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                            content: {
                                                                                ...state.pages[state.currentPageIndex].editor.selectedElement.content,
                                                                                src: e.target.value
                                                                            }

                                                                        }
                                                                    }
                                                                })
                                                            }}
                                                        />

                                                        <ToolTip tooltip='Add Image'>
                                                            <ImagePlus className='cursor-pointer' />
                                                        </ToolTip>
                                                    </div>
                                                </div>
                                            </div>



                                        </AccordionContent>
                                    </AccordionItem>
                                )}

                                <AccordionItem
                                    value="Typography"
                                    className="w-full"
                                >
                                    <AccordionTrigger className="!no-underline">Typography</AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-2 w-full bg-transparent p-2">
                                        <div className="flex flex-col gap-2 w-full">
                                            <p className="text-muted-foreground">Text Align</p>
                                            <Tabs value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).textAlign || ""} onValueChange={(value) => {

                                                dispatch({
                                                    type: 'UPDATE_ELEMENT',
                                                    payload: {
                                                        elementDetails: {
                                                            ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                            styles: {
                                                                ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { textAlign: value as TextAlign })
                                                            }
                                                        }
                                                    }
                                                })
                                            }} >
                                                <TabsList className="flex items-center flex-row justify-between border-[0.9px] border-gray-500 rounded-md bg-transparent h-fit gap-4">
                                                    <TabsTrigger
                                                        value="left"
                                                        className={` w-10 h-10 p-0 data-[state=active]:bg-muted`}
                                                    >
                                                        <AlignLeft size={18} />
                                                    </TabsTrigger>
                                                    <TabsTrigger
                                                        value="right"
                                                        className={`w-10 h-10 p-0 data-[state=active]:bg-muted`}
                                                    >
                                                        <AlignRight size={18} />
                                                    </TabsTrigger>
                                                    <TabsTrigger
                                                        value="center"
                                                        className={` w-10 h-10 p-0 data-[state=active]:bg-muted`}
                                                    >
                                                        <AlignCenter size={18} />
                                                    </TabsTrigger>
                                                    <TabsTrigger
                                                        value="justify"
                                                        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                                                    >
                                                        <AlignJustify size={18} />
                                                    </TabsTrigger>
                                                </TabsList>
                                            </Tabs>
                                        </div>
                                        <div className="flex flex-col gap-2 w-full">
                                            <p className="text-muted-foreground">Font Family</p>
                                            <Select value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).fontFamily || ""} onValueChange={(value) => {
                                                dispatch({
                                                    type: 'UPDATE_ELEMENT',
                                                    payload: {
                                                        elementDetails: {
                                                            ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                            styles: {
                                                                ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { fontFamily: value })

                                                            }
                                                        }
                                                    }
                                                })
                                            }}>
                                                <SelectTrigger className="w-full bg-transparent">
                                                    <SelectValue placeholder="Select a font family" />
                                                </SelectTrigger>
                                                <SelectContent className='bg-black text-white'>
                                                    <SelectGroup className='bg-transparent'>
                                                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                                                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                                        <SelectItem value="Arial">Arial</SelectItem>
                                                        <SelectItem value="Tahoma">Tahoma</SelectItem>
                                                        <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                                                        <SelectItem value="Georgia">Georgia</SelectItem>
                                                        <SelectItem value="Courier New">Courier New</SelectItem>
                                                        <SelectItem value="Brush Script MT">Brush Script MT</SelectItem>
                                                        <SelectItem value="Verdana">Verdana</SelectItem>


                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>

                                        </div>

                                        <div className="flex gap-2 w-full items-center justify-center">
                                            <div className='flex-1 flex-col items-center space-y-2 justify-center w-[75%]'>
                                                <Label className="text-muted-foreground">Weight</Label>
                                                <Select
                                                    value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).fontWeight as string || ""}
                                                    onValueChange={(value) => {
                                                        dispatch({
                                                            type: 'UPDATE_ELEMENT',
                                                            payload: {
                                                                elementDetails: {
                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                    styles: {
                                                                        ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                        ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { fontWeight: value })

                                                                    }
                                                                }
                                                            }
                                                        })
                                                    }}


                                                >
                                                    <SelectTrigger className="w-full bg-transparent">
                                                        <SelectValue placeholder="Select a weight" />
                                                    </SelectTrigger>
                                                    <SelectContent className='bg-black text-white'>
                                                        <SelectGroup className='bg-transparent'>
                                                            <SelectItem value="100">100</SelectItem>
                                                            <SelectItem value="200">200</SelectItem>
                                                            <SelectItem value="300">300</SelectItem>
                                                            <SelectItem value="400">400</SelectItem>
                                                            <SelectItem value="500">500</SelectItem>
                                                            <SelectItem value="600">600</SelectItem>
                                                            <SelectItem value="lighter">Lighter</SelectItem>
                                                            <SelectItem value="normal">Regular</SelectItem>
                                                            <SelectItem value="bold">Bold</SelectItem>
                                                            <SelectItem value="bolder">Bolder</SelectItem>
                                                            <SelectItem value="900">900</SelectItem>


                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className='w-[30%] space-y-2 bg-transparent'>
                                                <Label className="text-muted-foreground">Size</Label>
                                                <Input
                                                    placeholder="12px"
                                                    id="fontSize"
                                                    className='bg-transparent text-xs'
                                                    value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).fontSize as number || ""}
                                                    onChange={(e) => {
                                                        dispatch({
                                                            type: 'UPDATE_ELEMENT',
                                                            payload: {
                                                                elementDetails: {
                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                    styles: {
                                                                        ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                        ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { fontSize: e.target.value })

                                                                    }
                                                                }
                                                            }
                                                        })
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 w-full">
                                            <p className="text-muted-foreground">Text Color</p>

                                            <div className='flex space-x-2 w-full items-center justify-between'>

                                                <Input
                                                    placeholder="#fff"
                                                    id="textcolor"
                                                    className='bg-transparent text-xs'
                                                    value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).color || ""}
                                                    onChange={(e) => {
                                                        dispatch({
                                                            type: 'UPDATE_ELEMENT',
                                                            payload: {
                                                                elementDetails: {
                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                    styles: {
                                                                        ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                        ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { color: e.target.value })

                                                                    }
                                                                }
                                                            }
                                                        })
                                                    }}
                                                />

                                                <ToolTip tooltip='Pick color'>
                                                    <Palette className='cursor-pointer' onClick={() => setIsTextColorPicker((prev) => !prev)} />
                                                </ToolTip>
                                            </div>

                                            {isTextColorPicker && (
                                                <div className='w-[300px] z-100 h-[320px] fixed top-[40%] right-[10%] '>
                                                    <div className="absolute bg-white p-2  text-md rounded-full font-bold flex space-x-2 -top-[30px] -right-[7px] !text-black cursor-pointer" onClick={() => setIsTextColorPicker((prev) => !prev)}>

                                                        <X size={16}
                                                        />


                                                    </div>
                                                    <ColorPicker className='w-full h-full' color={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).color || ""} onChange={(color) => {
                                                        dispatch({
                                                            type: 'UPDATE_ELEMENT',
                                                            payload: {
                                                                elementDetails: {
                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                    styles: {
                                                                        ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                        ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { color: color.hex })

                                                                    }
                                                                }
                                                            }
                                                        })
                                                    }} />
                                                </div>
                                            )}

                                        </div>
                                    </AccordionContent>
                                </AccordionItem>


                                <AccordionItem
                                    value="Background"
                                    className="w-full"
                                >
                                    <AccordionTrigger className="!no-underline">Background</AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-2 w-full bg-transparent p-2">
                                        {/* Work from here */}
                                        <div className="flex flex-col gap-2 w-full">
                                            <p className="text-muted-foreground">Position</p>
                                            <Select value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).backgroundPosition as string || 'center'} onValueChange={(value) => {

                                                dispatch({
                                                    type: 'UPDATE_ELEMENT',
                                                    payload: {
                                                        elementDetails: {
                                                            ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                            styles: {
                                                                ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { backgroundPosition: value })

                                                            }
                                                        }
                                                    }
                                                })
                                            }}>
                                                <SelectTrigger className="w-full bg-transparent">
                                                    <SelectValue placeholder="Select a position" />
                                                </SelectTrigger>
                                                <SelectContent className='bg-black text-white'>
                                                    <SelectGroup className='bg-transparent'>
                                                        <SelectItem value="left top">left top</SelectItem>
                                                        <SelectItem value="left center">left center</SelectItem>
                                                        <SelectItem value="left bottom">left bottom</SelectItem>
                                                        <SelectItem value="right top">right top</SelectItem>
                                                        <SelectItem value="right center">right center</SelectItem>
                                                        <SelectItem value="right bottom">right bottom</SelectItem>
                                                        <SelectItem value="center top">center top</SelectItem>
                                                        <SelectItem value="center">center</SelectItem>



                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>

                                        </div>

                                        <div className="flex flex-col gap-2 w-full">
                                            <p className="text-muted-foreground">Background Color</p>

                                            <div className='flex space-x-2 w-full items-center justify-between'>

                                                <Input
                                                    placeholder="#fff"
                                                    id="color"
                                                    className='bg-transparent text-xs'
                                                    value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).backgroundColor || ""}
                                                    onChange={(e) => {
                                                        dispatch({
                                                            type: 'UPDATE_ELEMENT',
                                                            payload: {
                                                                elementDetails: {
                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                    styles: {
                                                                        ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                        ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { backgroundColor: e.target.value })

                                                                    }
                                                                }
                                                            }
                                                        })
                                                    }}
                                                />

                                                <ToolTip tooltip='Pick color'>
                                                    <Palette className='cursor-pointer' onClick={() => setIsBgColorPicker((prev) => !prev)} />
                                                </ToolTip>
                                            </div>

                                            {isBgColorPicker && (
                                                <div className='w-[300px] z-100 h-[320px] fixed top-[40%] right-[10%] '>
                                                    <div className="absolute bg-white p-2  text-md rounded-full font-bold flex space-x-2 -top-[30px] -right-[7px] !text-black cursor-pointer" onClick={() => setIsBgColorPicker((prev) => !prev)}>

                                                        <X size={16}
                                                        />


                                                    </div>
                                                    <ColorPicker className='w-full h-full' color={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).backgroundColor || ""} onChange={(color) => {
                                                        dispatch({
                                                            type: 'UPDATE_ELEMENT',
                                                            payload: {
                                                                elementDetails: {
                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                    styles: {
                                                                        ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                        ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { backgroundColor: color.hex })

                                                                    }
                                                                }
                                                            }
                                                        })
                                                    }} />
                                                </div>
                                            )}

                                        </div>
                                        <div className='w-full space-y-2 bg-transparent'>
                                            <Label className="text-muted-foreground">Background Image</Label>
                                            <div className='flex space-x-2 w-full items-center justify-between'>

                                                <Input
                                                    placeholder="https://image-url.com/"
                                                    id="imageSrc"
                                                    className='bg-transparent text-xs'
                                                    value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).backgroundImage?.replace('url(', '').replace(')', '')}
                                                    onChange={(e) => {
                                                        dispatch({
                                                            type: 'UPDATE_ELEMENT',
                                                            payload: {
                                                                elementDetails: {
                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                    styles: {
                                                                        ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                        ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { backgroundImage: `url(${e.target.value})` })
                                                                    }

                                                                }
                                                            }
                                                        })
                                                    }}
                                                />

                                                <ToolTip tooltip='Add Image'>
                                                    <ImagePlus className='cursor-pointer' />
                                                </ToolTip>
                                            </div>
                                        </div>


                                    </AccordionContent>
                                </AccordionItem>


                                <AccordionItem
                                    value="Custom"
                                    className="w-full"
                                >
                                    <AccordionTrigger className="!no-underline">Custom</AccordionTrigger>
                                    <AccordionContent className='
                                    flex flex-col space-y-2'>

                                        <div className="flex flex-col gap-2 w-full">
                                            <p className="text-muted-foreground">Css</p>
                                            <Textarea
                                                rows={4}
                                                placeholder='{"cssProperty1":"Value1","cssProperty2":"Value2","cssProperty3":"Value3"}'
                                                className='bg-transparent text-white w-full'
                                                value={cssInput}
                                                onChange={(e) => {
                                                    setCssInput(e.target.value)
                                                    if (isValidJSONString(e.target.value)) {

                                                        const parsedStyles = parseJsonCssInput(e.target.value);
                                                        dispatch({
                                                            type: 'UPDATE_ELEMENT',
                                                            payload: {
                                                                elementDetails: {
                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                    styles: {
                                                                        ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                        ...parsedStyles
                                                                    }
                                                                }
                                                            }
                                                        });
                                                    }
                                                }}


                                            />

                                        </div>

                                        {/* {state.pages[state.currentPageIndex].editor.selectedElement.type === "image" && (

                                            <div className="flex flex-col gap-2 w-full">
                                                <p className="text-muted-foreground">Image Src</p>
                                                <Input

                                                    placeholder='https://image-url.com/image.png'
                                                    className='bg-transparent text-white w-full'
                                                    value={(state.pages[state.currentPageIndex].editor.selectedElement.content as { href?: string | undefined; innerText?: string | undefined; src?: string | undefined; }).src || ""}
                                                    onChange={(e) => {

                                                        dispatch({
                                                            type: 'UPDATE_ELEMENT',
                                                            payload: {
                                                                elementDetails: {
                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                    content: {
                                                                        ...state.pages[state.currentPageIndex].editor.selectedElement.content,
                                                                        src: e.target.value

                                                                    }
                                                                }
                                                            }
                                                        });
                                                    }}


                                                />

                                            </div>
                                        )} */}

                                    </AccordionContent>
                                </AccordionItem>




                                <AccordionItem
                                    value="Effects"
                                    className="w-full"
                                >
                                    <AccordionTrigger className="!no-underline">Effects</AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-2 w-full bg-transparent p-2">
                                        <div className="flex flex-col gap-2 w-full">
                                            <div className="flex flex-col gap-2  w-full">
                                                <p className="text-muted-foreground">Opacity</p>
                                                <Input
                                                    placeholder='30'
                                                    className='bg-transparent text-white w-full'
                                                    value={Math.abs((getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).opacity as number) * 100 || 0)}
                                                    onChange={(e) => {
                                                        dispatch({
                                                            type: 'UPDATE_ELEMENT',
                                                            payload: {
                                                                elementDetails: {
                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                    styles: {
                                                                        ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                        ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { opacity: parseInt(e.target.value) / 100 })

                                                                    }
                                                                }
                                                            }
                                                        })
                                                    }}


                                                />
                                            </div>

                                        </div>
                                    </AccordionContent>

                                </AccordionItem>



                                <AccordionItem
                                    value="Dimensions"
                                    className="w-full"
                                >
                                    <AccordionTrigger className="!no-underline">
                                        Dimensions
                                    </AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-2 w-full h-full bg-transparent p-2">
                                        <div className="flex flex-col gap-2 w-full h-full">
                                            <div className="flex flex-col gap-2 h-full">
                                                <div className="flex gap-4 flex-col">
                                                    <div className="flex gap-4 ">
                                                        <div className='flex flex-col space-y-2'>
                                                            <Label className="text-muted-foreground">Height</Label>
                                                            <Input
                                                                id="height"
                                                                placeholder="12px"
                                                                className='bg-transparent text-white'
                                                                value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).height || ""}
                                                                onChange={(e) => {
                                                                    dispatch({
                                                                        type: 'UPDATE_ELEMENT',
                                                                        payload: {
                                                                            elementDetails: {
                                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                                styles: {
                                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { height: e.target.value })

                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }}


                                                            />
                                                        </div>
                                                        <div className='flex flex-col space-y-2'>
                                                            <Label className="text-muted-foreground">Width</Label>
                                                            <Input
                                                                placeholder="12px"
                                                                id="width"
                                                                className='bg-transparent text-white'
                                                                value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).width || ""}
                                                                onChange={(e) => {
                                                                    dispatch({
                                                                        type: 'UPDATE_ELEMENT',
                                                                        payload: {
                                                                            elementDetails: {
                                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                                styles: {
                                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { width: e.target.value })

                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }}

                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4 ">
                                                        <div className='flex flex-col space-y-2'>
                                                            <Label className="text-muted-foreground">MinHeight</Label>
                                                            <Input
                                                                id="minheight"
                                                                placeholder="12px"
                                                                className='bg-transparent text-white'
                                                                value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).minHeight || ""}
                                                                onChange={(e) => {
                                                                    dispatch({
                                                                        type: 'UPDATE_ELEMENT',
                                                                        payload: {
                                                                            elementDetails: {
                                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                                styles: {
                                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { minHeight: e.target.value })

                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }}


                                                            />
                                                        </div>
                                                        <div className='flex flex-col space-y-2'>
                                                            <Label className="text-muted-foreground">MinWidth</Label>
                                                            <Input
                                                                placeholder="12px"
                                                                id="minwidth"
                                                                className='bg-transparent text-white'
                                                                value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).minWidth || ""}
                                                                onChange={(e) => {
                                                                    dispatch({
                                                                        type: 'UPDATE_ELEMENT',
                                                                        payload: {
                                                                            elementDetails: {
                                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                                styles: {
                                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { minWidth: e.target.value })

                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }}

                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-4 ">
                                                        <div className='flex flex-col space-y-2'>
                                                            <Label className="text-muted-foreground">MaxHeight</Label>
                                                            <Input
                                                                id="maxheight"
                                                                placeholder="12px"
                                                                className='bg-transparent text-white'
                                                                value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).maxHeight || ""}
                                                                onChange={(e) => {
                                                                    dispatch({
                                                                        type: 'UPDATE_ELEMENT',
                                                                        payload: {
                                                                            elementDetails: {
                                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                                styles: {
                                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { maxHeight: e.target.value })

                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }}


                                                            />
                                                        </div>
                                                        <div className='flex flex-col space-y-2'>
                                                            <Label className="text-muted-foreground">MaxWidth</Label>
                                                            <Input
                                                                placeholder="12px"
                                                                id="maxwidth"
                                                                className='bg-transparent text-white'
                                                                value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).maxWidth
                                                                    || ""}
                                                                onChange={(e) => {
                                                                    dispatch({
                                                                        type: 'UPDATE_ELEMENT',
                                                                        payload: {
                                                                            elementDetails: {
                                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                                styles: {
                                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { maxWidth: e.target.value })

                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }}

                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <p>Margin px</p>
                                                <div className="flex gap-4 flex-col">
                                                    <div className="flex gap-4">
                                                        <div className='flex flex-col space-y-2'>
                                                            <Label className="text-muted-foreground">Top</Label>
                                                            <Input
                                                                id="marginTop"
                                                                placeholder="12px"
                                                                className='bg-transparent text-white'
                                                                value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).marginTop || ""}
                                                                onChange={(e) => {
                                                                    dispatch({
                                                                        type: 'UPDATE_ELEMENT',
                                                                        payload: {
                                                                            elementDetails: {
                                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                                styles: {
                                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { marginTop: e.target.value })

                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }}


                                                            />
                                                        </div>
                                                        <div className='flex flex-col space-y-2'>
                                                            <Label className="text-muted-foreground">Bottom</Label>
                                                            <Input
                                                                placeholder="12px"
                                                                id="marginBottom"
                                                                className='bg-transparent text-white'
                                                                value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).marginBottom || ""}
                                                                onChange={(e) => {
                                                                    dispatch({
                                                                        type: 'UPDATE_ELEMENT',
                                                                        payload: {
                                                                            elementDetails: {
                                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                                styles: {
                                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { marginBottom: e.target.value })

                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }}


                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <div className='flex flex-col space-y-2'>
                                                            <Label className="text-muted-foreground">Left</Label>
                                                            <Input
                                                                placeholder="12px"
                                                                id="marginLeft"
                                                                className='bg-transparent text-white'
                                                                value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).marginLeft || ""}
                                                                onChange={(e) => {
                                                                    dispatch({
                                                                        type: 'UPDATE_ELEMENT',
                                                                        payload: {
                                                                            elementDetails: {
                                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                                styles: {
                                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { marginLeft: e.target.value })

                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                        <div className='flex flex-col space-y-2'>
                                                            <Label className="text-muted-foreground">Right</Label>
                                                            <Input
                                                                placeholder="12px"
                                                                id="marginRight"
                                                                className='bg-transparent text-white'
                                                                value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).marginRight
                                                                    || ""}
                                                                onChange={(e) => {
                                                                    dispatch({
                                                                        type: 'UPDATE_ELEMENT',
                                                                        payload: {
                                                                            elementDetails: {
                                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                                styles: {
                                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { marginRight: e.target.value })

                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 h-full">
                                                <p>Padding px</p>
                                                <div className="flex gap-4 flex-col">
                                                    <div className="flex gap-4">
                                                        <div className='flex flex-col space-y-2'>
                                                            <Label className="text-muted-foreground">Top</Label>
                                                            <Input
                                                                placeholder="12px"
                                                                id="paddingTop"
                                                                className='bg-transparent text-white'
                                                                value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).paddingTop || ""}
                                                                onChange={(e) => {
                                                                    dispatch({
                                                                        type: 'UPDATE_ELEMENT',
                                                                        payload: {
                                                                            elementDetails: {
                                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                                styles: {
                                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { paddingTop: e.target.value })

                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                        <div className='flex flex-col space-y-2'>
                                                            <Label className="text-muted-foreground">Bottom</Label>
                                                            <Input
                                                                placeholder="12px"
                                                                id="paddingBottom"
                                                                className='bg-transparent text-white'
                                                                value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).paddingBottom || ""}
                                                                onChange={(e) => {
                                                                    dispatch({
                                                                        type: 'UPDATE_ELEMENT',
                                                                        payload: {
                                                                            elementDetails: {
                                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                                styles: {
                                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { paddingBottom: e.target.value })

                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <div className='flex flex-col space-y-2'>
                                                            <Label className="text-muted-foreground">Left</Label>
                                                            <Input
                                                                placeholder="12px"
                                                                id="paddingLeft"
                                                                className='bg-transparent text-white'
                                                                value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).paddingLeft || ""}
                                                                onChange={(e) => {
                                                                    dispatch({
                                                                        type: 'UPDATE_ELEMENT',
                                                                        payload: {
                                                                            elementDetails: {
                                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                                styles: {
                                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { paddingLeft: e.target.value })

                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                        <div className='flex flex-col space-y-2'>
                                                            <Label className="text-muted-foreground">Right</Label>
                                                            <Input
                                                                placeholder="12px"
                                                                id="paddingRight"
                                                                className='bg-transparent text-white'
                                                                value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).paddingRight || ""}
                                                                onChange={(e) => {
                                                                    dispatch({
                                                                        type: 'UPDATE_ELEMENT',
                                                                        payload: {
                                                                            elementDetails: {
                                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                                styles: {
                                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { paddingRight: e.target.value })

                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>


                                <AccordionItem
                                    value="Position"
                                    className="w-full"
                                >
                                    <AccordionTrigger className="!no-underline">
                                        Position
                                    </AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-2 w-full h-full bg-transparent p-2">
                                        <div className="flex flex-col gap-2 w-full h-full">
                                            <div className="flex flex-col gap-2 h-full">
                                                <div className="flex flex-col gap-2 w-full">
                                                    <p className="text-muted-foreground">Type</p>
                                                    <Select value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).position as string || 'initial'} onValueChange={(value) => {

                                                        dispatch({
                                                            type: 'UPDATE_ELEMENT',
                                                            payload: {
                                                                elementDetails: {
                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                    styles: {
                                                                        ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                        ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { position: value as PositionType })

                                                                    }
                                                                }
                                                            }
                                                        })
                                                    }}>
                                                        <SelectTrigger className="w-full bg-transparent">
                                                            <SelectValue placeholder="Select a type" />
                                                        </SelectTrigger>
                                                        <SelectContent className='bg-black text-white'>
                                                            <SelectGroup className='bg-transparent'>
                                                                <SelectItem value="absolute">absolute</SelectItem>
                                                                <SelectItem value="fixed">fixed</SelectItem>
                                                                <SelectItem value="relative">relative</SelectItem>
                                                                <SelectItem value="static">static</SelectItem>
                                                                <SelectItem value="sticky">sticky</SelectItem>
                                                                <SelectItem value="initial">initial</SelectItem>
                                                                <SelectItem value="inherit">inherit</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>

                                                </div>
                                                <p>Values</p>
                                                <div className="flex gap-4 flex-col">
                                                    <div className="flex gap-4">
                                                        <div className='flex flex-col space-y-2'>
                                                            <Label className="text-muted-foreground">Top</Label>
                                                            <Input
                                                                id="Top"
                                                                placeholder="12px"
                                                                className='bg-transparent text-white'
                                                                value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).top || ""}
                                                                onChange={(e) => {
                                                                    dispatch({
                                                                        type: 'UPDATE_ELEMENT',
                                                                        payload: {
                                                                            elementDetails: {
                                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                                styles: {
                                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { top: e.target.value })

                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }}


                                                            />
                                                        </div>
                                                        <div className='flex flex-col space-y-2'>
                                                            <Label className="text-muted-foreground">Bottom</Label>
                                                            <Input
                                                                placeholder="12px"
                                                                id="Bottom"
                                                                className='bg-transparent text-white'
                                                                value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).bottom || ""}
                                                                onChange={(e) => {
                                                                    dispatch({
                                                                        type: 'UPDATE_ELEMENT',
                                                                        payload: {
                                                                            elementDetails: {
                                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                                styles: {
                                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { bottom: e.target.value })

                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }}


                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <div className='flex flex-col space-y-2'>
                                                            <Label className="text-muted-foreground">Left</Label>
                                                            <Input
                                                                placeholder="12px"
                                                                id="Left"
                                                                className='bg-transparent text-white'
                                                                value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).left || ""}
                                                                onChange={(e) => {
                                                                    dispatch({
                                                                        type: 'UPDATE_ELEMENT',
                                                                        payload: {
                                                                            elementDetails: {
                                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                                styles: {
                                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { left: e.target.value })

                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                        <div className='flex flex-col space-y-2'>
                                                            <Label className="text-muted-foreground">Right</Label>
                                                            <Input
                                                                placeholder="12px"
                                                                id="Right"
                                                                className='bg-transparent text-white'
                                                                value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).right
                                                                    || ""}
                                                                onChange={(e) => {
                                                                    dispatch({
                                                                        type: 'UPDATE_ELEMENT',
                                                                        payload: {
                                                                            elementDetails: {
                                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                                styles: {
                                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { right: e.target.value })

                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <p>Z-Index</p>
                                                <div className='flex space-x-2 w-full items-center justify-between'>

                                                    <Input
                                                        placeholder="25"
                                                        id="zindex"
                                                        className='bg-transparent text-xs'
                                                        value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).zIndex || ""}
                                                        onChange={(e) => {
                                                            dispatch({
                                                                type: 'UPDATE_ELEMENT',
                                                                payload: {
                                                                    elementDetails: {
                                                                        ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                        styles: {
                                                                            ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                            ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { zIndex: e.target.value })

                                                                        }
                                                                    }
                                                                }
                                                            })
                                                        }}
                                                    />


                                                </div>


                                            </div>

                                        </div>
                                    </AccordionContent>
                                </AccordionItem>


                                <AccordionItem
                                    value="Flexbox"
                                    className="w-full"
                                >
                                    <AccordionTrigger className="!no-underline">Flexbox</AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-2 w-full h-full space-y-3 bg-transparent p-2">
                                        <div className="flex items-center justify-between">
                                            <Input
                                                className="h-4 w-4 bg-transparent text-white"
                                                placeholder="px"
                                                type="checkbox"
                                                id="display"
                                                checked={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).display === "none" ? true : false}
                                                onChange={(e) => {
                                                    dispatch({
                                                        type: 'UPDATE_ELEMENT',
                                                        payload: {
                                                            elementDetails: {
                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                styles: {
                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { display: e.target.checked ? 'none' : 'block' })

                                                                }
                                                            }
                                                        }
                                                    })
                                                }}

                                            />
                                            <Label className="text-muted-foreground">Hidden</Label>
                                        </div>
                                        <Label className="text-muted-foreground">Justify Content</Label>
                                        <Tabs
                                            className="flex flex-col gap-2 w-full h-full"
                                            onValueChange={(value) => {
                                                dispatch({
                                                    type: 'UPDATE_ELEMENT',
                                                    payload: {
                                                        elementDetails: {
                                                            ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                            styles: {
                                                                ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { justifyContent: value })

                                                            }
                                                        }
                                                    }
                                                })
                                            }
                                            }
                                            value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).justifyContent || ""}
                                        >
                                            <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                                                <TabsTrigger
                                                    value="space-between"
                                                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                                                >
                                                    <AlignHorizontalSpaceBetween size={18} />
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="space-evenly"
                                                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                                                >
                                                    <AlignHorizontalSpaceAround size={18} />
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="center"
                                                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                                                >
                                                    <AlignHorizontalJustifyCenterIcon size={18} />
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="start"
                                                    className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                                                >
                                                    <AlignHorizontalJustifyStart size={18} />
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="end"
                                                    className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                                                >
                                                    <AlignHorizontalJustifyEndIcon size={18} />
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                        <Label className="text-muted-foreground">Align Items</Label>
                                        <Tabs
                                            onValueChange={(value) => {
                                                dispatch({
                                                    type: 'UPDATE_ELEMENT',
                                                    payload: {
                                                        elementDetails: {
                                                            ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                            styles: {
                                                                ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { alignItems: value })

                                                            }
                                                        }
                                                    }
                                                })
                                            }
                                            }
                                            value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).alignItems || ""}
                                            className="flex flex-col gap-2 w-full h-full"
                                        >
                                            <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                                                <TabsTrigger
                                                    value="flex-start"
                                                    className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                                                >
                                                    <AlignVerticalJustifyStart size={18} />
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="center"
                                                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                                                >
                                                    <AlignVerticalJustifyCenter size={18} />
                                                </TabsTrigger>

                                                <TabsTrigger
                                                    value="flex-end"
                                                    className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                                                >
                                                    <AlignVerticalJustifyEnd size={18} />
                                                </TabsTrigger>


                                            </TabsList>
                                        </Tabs>
                                        <div className="flex items-center justify-between">
                                            <Input
                                                className="h-4 w-4 bg-transparent text-white"
                                                placeholder="px"
                                                type="checkbox"
                                                id="display"
                                                checked={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).display === "flex" ? true : false}
                                                onChange={(e) => {
                                                    dispatch({
                                                        type: 'UPDATE_ELEMENT',
                                                        payload: {
                                                            elementDetails: {
                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                styles: {
                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { display: e.target.checked ? 'flex' : 'block' })

                                                                }
                                                            }
                                                        }
                                                    })
                                                }}

                                            />
                                            <Label className="text-muted-foreground">Flex Element</Label>
                                        </div>


                                        <div className="flex flex-col items-start space-y-4">
                                            <Label className="text-muted-foreground"> Direction</Label>
                                            <Input
                                                placeholder="row or column"
                                                id="flexDirection"
                                                className='bg-transparent text-white'
                                                value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).flexDirection || ""}
                                                onChange={(e) => {
                                                    dispatch({
                                                        type: 'UPDATE_ELEMENT',
                                                        payload: {
                                                            elementDetails: {
                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                styles: {
                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { flexDirection: e.target.value as "row" | "column" })

                                                                }
                                                            }
                                                        }
                                                    })
                                                }}

                                            />
                                        </div>



                                    </AccordionContent>
                                </AccordionItem>


                                <AccordionItem
                                    value="Animations"
                                    className="w-full"
                                >
                                    <AccordionTrigger className="!no-underline">Animations</AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-2 w-full bg-transparent p-2">

                                        <div className="flex flex-col gap-2 w-full">
                                            <p className="text-muted-foreground">Type</p>
                                            <Select value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).animationName || ""} onValueChange={(value) => {
                                                dispatch({
                                                    type: 'UPDATE_ELEMENT',
                                                    payload: {
                                                        elementDetails: {
                                                            ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                            styles: {
                                                                ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { animationName: value })

                                                            }
                                                        }
                                                    }
                                                })
                                            }}>
                                                <SelectTrigger className="w-full bg-transparent">
                                                    <SelectValue placeholder="Select the animation" />
                                                </SelectTrigger>
                                                <SelectContent className='bg-black text-white'>
                                                    <SelectGroup className='bg-transparent'>
                                                        <SelectItem value="fadeIn">fadeIn</SelectItem>
                                                        <SelectItem value="fadeOut">fadeOut</SelectItem>
                                                        <SelectItem value="slideInLeft">slideInLeft</SelectItem>
                                                        <SelectItem value="slideInRight">slideInRight</SelectItem>
                                                        <SelectItem value="slideInUp">slideInUp</SelectItem>
                                                        <SelectItem value="slideInDown">slideInDown</SelectItem>
                                                        <SelectItem value="bounce">bounce</SelectItem>
                                                        <SelectItem value="bounceIn">bounceIn</SelectItem>
                                                        <SelectItem value="bounceOut">bounceOut</SelectItem>
                                                        <SelectItem value="zoomIn">zoomIn</SelectItem>
                                                        <SelectItem value="zoomOut">zoomOut</SelectItem>
                                                        <SelectItem value="rotateIn">rotateIn</SelectItem>
                                                        <SelectItem value="rotateOut">rotateOut</SelectItem>
                                                        <SelectItem value="flipInX">flipInX</SelectItem>
                                                        <SelectItem value="flipOutX">flipOutX</SelectItem>
                                                        <SelectItem value="flipInY">flipInY</SelectItem>
                                                        <SelectItem value="flipOutY">flipOutY</SelectItem>
                                                        <SelectItem value="pulse">pulse</SelectItem>
                                                        <SelectItem value="swing">swing</SelectItem>
                                                        <SelectItem value="shake">shake</SelectItem>
                                                        <SelectItem value="hinge">hinge</SelectItem>
                                                        <SelectItem value="rubberBand">rubberBand</SelectItem>
                                                        <SelectItem value="flash">flash</SelectItem>
                                                        <SelectItem value="jello">jello</SelectItem>
                                                        <SelectItem value="tada">tada</SelectItem>
                                                        <SelectItem value="wobble">wobble</SelectItem>
                                                        <SelectItem value="heartBeat">heartBeat</SelectItem>
                                                        <SelectItem value="lightSpeedIn">lightSpeedIn</SelectItem>
                                                        <SelectItem value="lightSpeedOut">lightSpeedOut</SelectItem>
                                                        <SelectItem value="rollIn">rollIn</SelectItem>
                                                        <SelectItem value="rollOut">rollOut</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>

                                        </div>
                                        <div className="flex flex-col gap-2 w-full">
                                            <p className="text-muted-foreground">Flow</p>
                                            <Tabs value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).animationTimingFunction || ""} onValueChange={(value) => {

                                                dispatch({
                                                    type: 'UPDATE_ELEMENT',
                                                    payload: {
                                                        elementDetails: {
                                                            ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                            styles: {
                                                                ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { animationTimingFunction: value as TextAlign })
                                                            }
                                                        }
                                                    }
                                                })
                                            }} >
                                                <TabsList className="flex items-center flex-row justify-between border-[0.9px] border-gray-500 rounded-md bg-transparent h-fit gap-4">
                                                    <TabsTrigger
                                                        value="ease"
                                                        className={` w-10 h-10 p-0 data-[state=active]:bg-muted`}
                                                    >
                                                        ES
                                                    </TabsTrigger>
                                                    <TabsTrigger
                                                        value="ease-in"
                                                        className={`w-10 h-10 p-0 data-[state=active]:bg-muted`}
                                                    >
                                                        E-in
                                                    </TabsTrigger>
                                                    <TabsTrigger
                                                        value="ease-out"
                                                        className={` w-11 h-10 p-0 data-[state=active]:bg-muted`}
                                                    >
                                                        E-out
                                                    </TabsTrigger>
                                                    <TabsTrigger
                                                        value="linear"
                                                        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                                                    >
                                                        LR
                                                    </TabsTrigger>
                                                </TabsList>
                                            </Tabs>
                                        </div>

                                        <div className='flex flex-col gap-2 w-full'>
                                            <p className="text-muted-foreground">Duration</p>
                                            <Input
                                                placeholder="1s"
                                                id="textcolor"
                                                className='bg-transparent text-xs'
                                                value={getResponsiveStyles(state.pages[state.currentPageIndex].editor.selectedElement.styles).animationDuration || ""}
                                                onChange={(e) => {
                                                    dispatch({
                                                        type: 'UPDATE_ELEMENT',
                                                        payload: {
                                                            elementDetails: {
                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                styles: {
                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.styles,
                                                                    ...updateStylesForDevice(state.pages[state.currentPageIndex].editor.selectedElement.styles, state.pages[state.currentPageIndex].editor.device, { animationDuration: e.target.value })

                                                                }
                                                            }
                                                        }
                                                    })
                                                }}
                                            />

                                        </div>



                                    </AccordionContent>
                                </AccordionItem>


                                <AccordionItem
                                    value="Embed"
                                    className="w-full"
                                >
                                    <AccordionTrigger className="!no-underline">Embed</AccordionTrigger>
                                    <AccordionContent className='
                                    flex flex-col space-y-2'>

                                        <div className="flex flex-col gap-2 w-full">
                                            <p className="text-muted-foreground">Embedding Code</p>
                                            <Textarea
                                                rows={4}
                                                placeholder='<Script/>...'
                                                className='bg-transparent text-white w-full'
                                                value={(state.pages[state.currentPageIndex].editor.selectedElement.content as { href?: string; innerText?: string; src?: string; embed?: string; }).embed}
                                                onChange={(e) => {

                                                    dispatch({
                                                        type: 'UPDATE_ELEMENT',
                                                        payload: {
                                                            elementDetails: {
                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                content: {
                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.content,
                                                                    embed: e.target.value
                                                                }
                                                            }
                                                        }
                                                    });

                                                }}

                                            />

                                        </div>

                                        <div className="flex flex-col gap-2 w-full">
                                            <p className="text-muted-foreground">Embedding Url</p>
                                            <Input

                                                placeholder='https://spline.com/3d-modal...'
                                                className='bg-transparent text-white w-full'
                                                value={(state.pages[state.currentPageIndex].editor.selectedElement.content as { href?: string; innerText?: string; src?: string; embed?: string; }).src}
                                                onChange={(e) => {

                                                    dispatch({
                                                        type: 'UPDATE_ELEMENT',
                                                        payload: {
                                                            elementDetails: {
                                                                ...state.pages[state.currentPageIndex].editor.selectedElement,
                                                                content: {
                                                                    ...state.pages[state.currentPageIndex].editor.selectedElement.content,
                                                                    src: e.target.value
                                                                }
                                                            }
                                                        }
                                                    });

                                                }}

                                            />

                                        </div>



                                    </AccordionContent>
                                </AccordionItem>

                            </Accordion>
                        </>
                    )}


                    {CurrentTab === "Components" && (
                        <>

                            <div className='flex text-sm w-full'>
                                Components
                            </div>
                            <div className='flex text-xs w-full text-gray-500'>
                                You can drag and drop components on the canvas.
                            </div>


                            <Accordion
                                type="multiple"
                                className="w-full bg-transparent overflow-y-auto nobg-scrollbar max-h-full space-y-2"
                                defaultValue={['Layout', 'Elements']}
                            >
                                <AccordionItem
                                    value="Layout"
                                    className="w-full space-y-2"
                                >
                                    <AccordionTrigger className="!no-underline">Layout</AccordionTrigger>
                                    <AccordionContent className="flex flex-wrap gap-2 ">
                                        {elements
                                            .filter((element) => element.group === 'layout')
                                            .map((element) => (
                                                <div
                                                    key={element.id}
                                                    className="flex-col items-center justify-center flex"
                                                >
                                                    {element.Component}
                                                    <span className="text-muted-foreground">{element.label}</span>
                                                </div>
                                            ))}
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem
                                    value="Elements"
                                    className="w-full space-y-2"
                                >
                                    <AccordionTrigger className="!no-underline">Elements</AccordionTrigger>
                                    <AccordionContent className="flex flex-wrap items-center justify-center gap-2 ">
                                        {elements
                                            .filter((element) => element.group === 'elements')
                                            .map((element) => (
                                                <div
                                                    key={element.id}
                                                    className="flex-col items-center justify-center flex"
                                                >
                                                    {element.Component}

                                                    <span className="text-muted-foreground "> {element.label === "Checkout" ? '(In Dev)' : `${element.label}`}</span>
                                                </div>
                                            ))}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </>
                    )}


                </div>
                <Tabs defaultValue={CurrentTab} onValueChange={(value) => setCurrentTab(value)} className="w-fit h-full border-l-[1px] border-gray-500  bg-transparent">
                    <TabsList className='bg-transparent flex flex-col h-fit w-[50px]  space-y-3'>
                        <TabsTrigger value="Styles" className='w-[40px] p-1 m-0'><Settings /></TabsTrigger>
                        <TabsTrigger value="Components" className='w-[40px] p-1 m-0'><Plus /></TabsTrigger>
                        <TabsTrigger value="Media" className='w-[40px] p-1 m-0'><Database /></TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>







        </div >
    )
}

export default RightSideBar
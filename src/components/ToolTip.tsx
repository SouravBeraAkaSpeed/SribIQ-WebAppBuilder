import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const ToolTip = ({ children, tooltip }: { children: React.ReactNode, tooltip: string }) => {

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>{children}</TooltipTrigger>
                <TooltipContent>
                    {tooltip}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

    )
}

export default ToolTip
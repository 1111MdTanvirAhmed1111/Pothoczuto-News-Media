import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";

import Link from "next/link"


function Logos({icons}) {
  return (
    <TooltipProvider>
    {icons.map((icon, index) => (
      <Tooltip key={index}>
        <TooltipTrigger asChild>
          <Link href={icon.href}>
            <div className="p-3 my-4 transition-all duration-300 hover:bg-green-400/10 hover:shadow-inner hover:shadow-green-400/30 hover:rounded-lg group">
              <icon.icon className="mx-auto cursor-pointer w-6 h-6 transition-all duration-300 group-hover:text-green-500 group-hover:scale-110" />
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-green-500 text-white border-green-600"
        >
          <p>{icon.label}</p>
        </TooltipContent>
      </Tooltip>
    ))}
  </TooltipProvider>
  )
}

export default Logos
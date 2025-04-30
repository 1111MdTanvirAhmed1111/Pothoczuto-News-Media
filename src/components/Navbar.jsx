"use client"

import Link from "next/link"
import { Noto_Sans_Bengali } from "next/font/google"
import { MessageCircleMore, Users } from "lucide-react"


const bengali = Noto_Sans_Bengali({ 
  subsets: ["bengali"],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

function Navbar() {
  return (
 <div className="text-green-400 py-3 border-b border-green-400">
<div className="mx-auto w-[96%] flex items-center justify-between">



               {/* Logo */}
               <div className="flex items-center transition-transform duration-300">
              <Link href="/" className="flex flex-col">
                <span className={`text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent ${bengali.className}`}>
                  পথচ্যুত
                </span>
              </Link>
            </div>


      <div className="flex">

      </div>


      <div className="flex">
      <MessageCircleMore className="mx-1" />
      <Users className="mx-1"/>
      </div>

</div>
 </div>
  )
}

export default Navbar
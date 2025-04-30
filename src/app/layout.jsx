import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Sidebar from '@/components/kits/Sidebar'
import Navbar from '@/components/Navbar'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Suspense } from 'react';



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  title: "পথচ্যুত",
  description: "আমাদের মত পথ হারা সকল মানুষের জন্য আল্লাহ পাঠিয়েছেন ইসলাম। তবে পাশ্চ্যাত্তের লাগাতার আগ্রাশনের পথে আমরা আরো পথ থেকে সরে গিয়েছি। ইসলামের ইতিহাস, পাশ্চাত্যের ব্যার্থ সমাজ, কবরের সদকায়ে জারিয়ার জন্যের আমাদের এই আয়োজন। আল্লাহকে খুশি করার নিয়তে উম্মাহর সাথে থাকুন, নিজের সর্বচ্চ দিয়ে সাহায্য করুন। জাজাকুমুল্লাহ খাইরান।",
  keywords: "pothoczuto,পথচ্যুত,ওমায়ের,তানভীর,মুখবদ্ধ",
  icons: {
    icon: [
      { url: '/favicon.ico' },

    ],
   
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  authors: [{ name: "তানভীর " }],
  metadataBase: new URL('https://pothoczuto.xyz'),
  openGraph: {
    title: "পথচ্যুত",
    description: "আমাদের মত পথ হারা সকল মানুষের জন্য আল্লাহ পাঠিয়েছেন ইসলাম।",
    url: 'https://pothoczuto.xyz',
    siteName: 'পথচ্যুত',
    locale: 'bn_BD',
    type: 'website',
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >

      <div className="flex h-[100vh] ">

        <div className="basis-[4%] mr-[4%]  ">
        <Sidebar />
        </div>

          <div className=" basis-[94%]  ">
        

        <div className="h-[10vh]">
        <Navbar/>
        </div>

        <div className="overflow-y-scroll h-[90vh]">


          {children}
          </div>
          </div>

        
      </div>
        


        </ThemeProvider>
      </body>
    </html>
  );
}

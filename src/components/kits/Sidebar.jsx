import Link from "next/link";
import {
  BadgePlus,
  BellRing,
  BookText,
  CircleUserRound,
  House,
  Search,
  Settings,
} from "lucide-react";
import Logos from './KitParts/Logos';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function Sidebar() {
  const icons = [
    {
      icon: House,
      label: "Home",
      href: "/",
    },
    {
      icon: BookText,
      label: "News",
      href: "/news",
    },
    {
      icon: CircleUserRound,
      label: "Profile",
      href: "/profile",
    },
    {
      icon: BellRing,
      label: "Notifications",
      href: "/notifications",
    },
    {
      icon: Search,
      label: "Search",
      href: "/search",
    },
    {
      icon: BadgePlus,
      label: "Create",
      href: "/create",
    },
  ];

  const bottomIcons = [
    {
      icon: Settings,
      label: "Settings",
      href: "/settings",
    },
  ];

  return (
    <div className="text-green-400 w-fit mx-auto flex transition-all justify-between flex-col h-[100vh] my-auto box-border  bg-transparent border-r-1 border-green-500">
      <div className="space-y-8 mt-6">
      <Logos icons={icons} />
      </div>

      <div className="mb-6">
        <Logos icons={bottomIcons} />
      </div>
    </div>
  );
}

export default Sidebar;

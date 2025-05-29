"use client"
import { User2, ChevronUp, Home, Plus, Settings } from "lucide-react";
import { useSidebar } from "./ui/sidebar";  // ✅ Import sidebar context
import Link from "next/link";
import { Button } from "./ui/button";
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
 
  {
    title: "Record Savings",
    url: "/add-drug",
    icon: Plus,
  },
   {
    title: "View Savings",
    url: "/add-drug",
    icon: Plus,
  },
  {
    title: "Admin",
    url: "/admin",
    icon: Settings,
  },
]

const AppSidebar = () => {
  const { open, toggleSidebar } = useSidebar();  // ✅ Extract sidebar state

  return (
    <aside className={`bg-gray-900 text-white w-64 flex flex-col h-screen ${open ? "block" : "hidden"}`}>
      <header className="py-4 px-6 flex items-center">
        <Link className="ml-2 font-bold" href="/">
         Shah
        </Link>
    
      </header>

      <nav className="mt-4 flex-1">
        <ul>
          {items.map(({ title, url, icon: Icon, className }) => (
            <li key={title}>
              <Link href={url} className={`flex items-center gap-2 px-6 py-2 hover:bg-gray-800 ${className || ""}`}>
                <Icon className="w-5 h-5" />
                <span>{title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <footer className="p-6 border-t border-gray-800 flex items-center justify-between">
        <User2 className="w-5 h-5" />
        <span>Shah</span>
        <ChevronUp className="w-4 h-4 text-gray-500" />
      </footer>
    </aside>
  );
};

export default AppSidebar;

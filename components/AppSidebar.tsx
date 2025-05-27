import {
  Home,
  Settings,
  User2,
  ChevronUp,
  Plus,
  Projector,
  PoundSterling, // 💷 Icon for drug costs
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Record Savings", url: "/add-drug", icon: Plus },
  { title: "View Savings", url: "/view-all", icon: Projector },
  {
    title: "Drug Costs",
    url: "/drug-costs",
    icon: PoundSterling,
  },
  { title: "Admin", url: "/admin", icon: Settings },
];

const AppSidebar = () => {
  return (
    <aside className="bg-gray-900 text-white w-64 flex flex-col h-screen">
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
        <span>John Doe</span>
        <ChevronUp className="w-4 h-4 text-gray-500" />
      </footer>
    </aside>
  );
};

export default AppSidebar;

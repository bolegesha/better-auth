import { Columns2, LucideIcon } from 'lucide-react'
import { FC } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface SidebarItem {
    icon: LucideIcon;
    label: string;
    href?: string;
    onClick?: () => void;
}

interface SidebarProps {
    items: SidebarItem[];
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    onItemClick: (section: string) => void;
}

export const Sidebar: FC<SidebarProps> = ({ items, isCollapsed, setIsCollapsed, onItemClick }) => {
    const handleItemClick = (item: SidebarItem) => {
        if (item.onClick) {
            item.onClick();
        } else if (item.href) {
            onItemClick(item.href.replace('#', ''));
        }
    };

    return (
        <TooltipProvider delayDuration={0}>
            <div className="relative">
                <div
                    className={`
                        min-h-screen bg-[#F5F5F7] border-r border-[#E5E5EA] transition-all duration-300
                        ${isCollapsed ? 'w-20' : 'w-[280px]'}
                    `}
                >
                    {/* Added pt-16 to push the nav items down */}
                    <nav className="p-4 pt-16">
                        {/* Increased space-y-6 for more vertical spacing between items */}
                        <ul className="space-y-4">
                            {items.map((item) => (
                                <li key={item.label}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() => handleItemClick(item)}
                                                className="w-full text-left-600 flex items-center p-3 hover:bg-white rounded-xl transition-colors duration-300 focus:outline-none"
                                            >
                                                <item.icon
                                                    size={20}
                                                    className="text-[#00358E] flex-shrink-0"
                                                />
                                                <span
                                                    className={`
                                                        ml-3 text-[15px] font-medium text-[#00358E] transition-opacity duration-300
                                                        ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
                                                    `}
                                                >
                                                    {item.label}
                                                </span>
                                            </button>
                                        </TooltipTrigger>
                                        {isCollapsed && (
                                            <TooltipContent
                                                side="right"
                                                className="bg-white text-[#00358E]-bold border border-[#E5E5EA]"
                                            >
                                                <p className="text-[13px] font-medium">{item.label}</p>
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* Collapse/Expand Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute top-4 -right-4 p-2 bg-white rounded-full shadow-md hover:bg-[#F5F5F7] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 z-50 ml-4"
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <Columns2
                        size={20}
                        className={`text-[#00358E] transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                    />
                </button>
            </div>
        </TooltipProvider>
    )
}
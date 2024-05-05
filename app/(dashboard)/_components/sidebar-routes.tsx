"use client"
import {Layout, Compass,List, BarChart, Shield, Settings, Edit2} from 'lucide-react'
import { SidebarItem } from './sidebar-item'
import { usePathname } from 'next/navigation';

const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/",
    },
    {
        icon: Compass,
        label: "Browse",
        href: "/search",
    },
    {
        icon: Edit2,
        label: "Blog",
        href: "/blog",
    },
    {
        icon: Shield,
        label: "Upgrade",
        href: "/upgrade",

    },
    {
        icon: Settings,
        label: "Settings",
        href: '/settings',
    }
];

const teacherRoutes = [
    {
        icon: List,
        label: "Courses",
        href: "/teacher/courses",
    },
    // {
    //     icon: BarChart,
    //     label: "Analytics",
    //     href: "/teacher/analytics",
    // },
    
];


export const SidebarRoutes = () => {
    
    const pathname = usePathname();

    const isTeacherPage = pathname?.includes("/teacher");

    const routes = isTeacherPage? teacherRoutes : guestRoutes

    
    
    return (
        <div className='flex flex-col w-full'>
            {routes.map((route) =>(
                <SidebarItem
                key={route.href}
                icon={route.icon}
                label={route.label}
                href={route.href}
                />
            ))}
        </div>
    )
}
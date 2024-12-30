'use client'
import { ModeToggle } from '@/components/ModeToggle'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Header = () => {
    const path = usePathname();
    return (
        <div className='flex p-4 items-center justify-between bg-secondary dark:bg-slate-950 border rounded-md shadow-md'>
            <Link href="/"><Image src={'/logo.png'} width={30} height={30} alt='logo' /></Link>
            <ul className='hidden md:flex gap-6'>
                <Link href="/dashboard">
                    <li
                        className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                    ${path == '/dashboard' && 'font-bold text-primary'}  
                    `}
                    >Dashboard</li>
                </Link>
                <Link href="/dashboard/resume">
                    <li
                        className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                    ${path == '/dashboard/resume' && 'font-bold text-primary'}  
                    `}
                    >Resume</li>
                </Link>
                <Link href="/dashboard/about">
                    <li
                        className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                    ${path == '/dashboard/how' && 'font-bold text-primary'}  
                    `}
                    >How it Works ?</li>
                </Link>
            </ul>
            <div className='flex items-center justify-between gap-5'>
                <ModeToggle />
                <UserButton />
            </div>
        </div>
    )
}

export default Header
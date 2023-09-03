import { ClerkProvider, currentUser } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import React from 'react';
import '../globals.css';
import Topbar from '@/components/shared/Topbar';
import LeftSidebar from '@/components/shared/LeftSidebar';
import RightSidebar from '@/components/shared/RightSidebar';
import Bottombar from '@/components/shared/Bottombar';
import { Metadata } from 'next';
import { fetchUser } from '@/lib/actions/user.actions';
import { getUnreadCount } from '@/lib/actions/activity.actions';
import { useState } from 'react';
export const metadata : Metadata = {
    title: 'Ota',
    description: 'Revolutionising the way developers communicate',
    icons: '/favicon.ico'
};

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({ children }: { children: React.ReactNode })
{
    return(
        <ClerkProvider>
            <html lang='en'>
                <body className={ `${inter.className}`}>
                    <Topbar/>
                    <main className='flex flex-row'>
                        <LeftSidebar/>
                            <section className='main-container'>
                                <div className='w-full max-w-4xl'>
                                    {children}
                                </div>
                            </section>
                        <RightSidebar/>
                    </main>
                    <Bottombar/>
                </body>
            </html>
        </ClerkProvider>
    );
}
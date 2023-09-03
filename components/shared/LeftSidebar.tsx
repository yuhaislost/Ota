"use client"

import { sidebarLinks } from '@/constants';
import { getUnreadCount } from '@/lib/actions/activity.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import { SignOutButton, SignedIn, currentUser, useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

function LeftSidebar(){

    const [unreadActivityCount, setActivityCount] = useState(0);

    const router = useRouter();
    const pathName = usePathname();
    const userId = useAuth().userId;

    async function refreshData()
    {
        if (!userId) return null;
        const userInfo = await fetchUser(userId);
        const unreadCount = await getUnreadCount(userInfo._id);

        setActivityCount(unreadCount);
    }

    useEffect(()=>{
        refreshData();
    }, []);

    return (
        <section className="custom-scrollbar leftsidebar">
            <div className="flex w-full flex-1 flex-col gap-6 px-6">
                { sidebarLinks.map(link => {
                    const linkActive = (pathName.includes(link.route) && link.route.length > 1) || pathName === link.route;
                    
                    if (link.route === '/profile')
                    {
                        link.route = `${link.route}/${userId}`;
                    }

                    return (
                        <Link href={link.route} key={link.label} className={`leftsidebar_link relative ${linkActive && 'bg-primary-500'}`}>
                            <Image src={link.imgURL} alt={link.label} width={24} height={24}/>
                            {(link.route === '/activity' && unreadActivityCount > 0) && <span className='text-white text-small-regular w-[22px] h-[22px] bg-red-600 text-center p-0 m-0 absolute rounded-full translate-x-3 -translate-y-2 transition'>{ unreadActivityCount > 99 ? '99+': unreadActivityCount}</span>}
                            <p className='text-light-1 max-lg:hidden'>{link.label}</p>
                        </Link>
                    );
                    
                })}
            </div>
            <div className='mt-auto px-6'>
                <SignedIn>
                    <SignOutButton signOutCallback={() => router.push('/sign-in')}>
                        <div className='flex cursor-pointer gap-4 p-4'>
                            <Image src='/assets/logout.svg' alt='logout' width={24} height={24}/>
                            <p className='text-light-2 max-lg:hidden'>Logout</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </section>
    );
};

export default LeftSidebar;
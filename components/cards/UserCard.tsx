'use client'
import Image from 'next/image';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
interface Props{
    id: string,
    name: string,
    username: string,
    profileImage: string,
    userType: string,
};

function UserCard({id, name, username, profileImage, userType}: Props)
{
    const router = useRouter();

    return(
        <article className="user-card">
            <div className="user-card_avatar">
                <Image src={profileImage} alt={`${username}'s profile`} width={48} height={48} className='rounded-full'/>
                <div className='flex-1 text-ellipsis'>
                    <h4 className='text-base-semibold text-light-1'>{name}</h4>
                    <p className='text-small-medium text-gray-1'>@{username}</p>
                </div>
            </div>
            <Button onClick={() => router.push(`/profile/${id}`)}className='bg-neutral-50 text-dark-1 hover:!bg-neutral-400 transition !duration-300'>View</Button>
        </article>
    )
}

export default UserCard;
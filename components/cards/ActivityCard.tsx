'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props{
    id: string,
    userId: string,
    username: string,
    profileImage: string,
    replyThreadId: string,
    replyThreadText: string,
    parentThreadId: string,
    timestamp: number,
};

function ActivityCard({id, userId, username, profileImage, replyThreadId, replyThreadText, parentThreadId, timestamp}: Props)
{
    const router = useRouter();

    return(
        <article id={id} className="cursor-pointer flex flex-row text-small-regular items-center justify-between">
            <div className="flex flex-row items-center gap-[1ch]">
                <div className="flex flex-row items-center gap-4" onClick={()=>router.push(`/profile/${userId}`)}>
                    <div>
                        <Image src={profileImage} alt={`${username}'s profile`} height={48} width={48} className="rounded-full"/>
                    </div>
                    <p className="text-white text-small-semibold overflow-hidden truncate">@{username}</p>
                </div>
                <p className="text-white text-base-regular overflow-hidden truncate" onClick={()=>router.push(`/thread/${parentThreadId}`)}> replied: {replyThreadText} </p>
            </div>
            <p className="text-white" onClick={()=>router.push(`/thread/${parentThreadId}`)} >{timestamp} days ago</p>
        </article>
    );
}

export default ActivityCard;
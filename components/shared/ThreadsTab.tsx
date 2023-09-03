import { fetchUserThreads } from "@/lib/actions/thread.actions";
import ThreadCard from "../cards/ThreadCard";
import { createCommentMap } from "@/lib/utils";

interface Props{
    currentUserId: string,
    accountId: string,
    accountType: string,
    threads?: any[]
};

async function ThreadsTab({currentUserId, accountId, accountType, threads}: Props)
{

    if(!threads)
    {
        threads = await fetchUserThreads(accountId);
    }

    const threadCommentMap: any = await createCommentMap(threads);
    console.log(threads);


    return(
        <section className="mt-9 flex flex-col gap-10">
            {threads.map((thread) => (
                <ThreadCard key={thread._id} id={thread._id} currentUserId={currentUserId} parentId={thread.parentId} content={thread.text}
                    author={thread.author} community={thread.community} createdAt={thread.createdAt} comments={threadCommentMap.get(thread._id)}
                />
            ))}
        </section>
    )
}

export default ThreadsTab;

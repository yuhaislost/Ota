import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/form/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchAllCommentsTreeBFS } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import mongoose from 'mongoose';
import { redirect } from "next/navigation";

async function Page({ params }:  { params: { id: string}}){

    if (!params.id) return null;

    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded)
    {
        redirect('/onboarding');
    }

    const thread = await fetchThreadById(new mongoose.Types.ObjectId(params.id));
    const threadCommentMap: any = await fetchAllCommentsTreeBFS(thread._id);

    return(
        <section className="relative">
            <div>
                {
                <ThreadCard 
                key={thread.id} id={thread.id} currentUserId={user?.id || ""} parentId={thread.parentId} content={thread.text} author={thread.author} 
                community={thread.community} createdAt={thread.createdAt} comments={threadCommentMap.get(thread._id)}
                />
                }
            </div>
            <div className="mt-7">
                <Comment threadId={thread.id} currentUserImg={userInfo.profileImage} currentUserId={JSON.stringify(userInfo._id)}/>
            </div>
            <div className='mt-10'>
                {
                    threadCommentMap.get(thread._id).map((comment: any) => (<ThreadCard id={comment.id} key={comment.id} currentUserId={user?.id || ""} parentId={comment.parentId} 
                    content={comment.text} author={comment.author} community={comment.community} createdAt={comment.createdAt} comments={threadCommentMap.get(comment._id)} isComment="true"
                    />))
                }
            </div>
        </section>
    );
}

export default Page;
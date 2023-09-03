//app/page.tsx
import { fetchThreads } from "@/lib/actions/thread.actions";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import { fetchThreadComments } from "@/lib/actions/thread.actions";
import ThreadCard from "@/components/cards/ThreadCard";

export default async function Home() {
  const user = await currentUser();
  const threadsResult = await fetchThreads(1, 20);
  const commentsMap = new Map<string, any>();
  for (let i = 0; i < threadsResult.fetchedThreads.length; i++)
  {
    const commentData = await fetchThreadComments(threadsResult.fetchedThreads[i]._id, 1, 20);
    let comments: any = commentData.comments;
    if (comments.length === 0)
    {
      commentsMap.set(threadsResult.fetchedThreads[i]._id, null);
    }
    else{
      commentsMap.set(threadsResult.fetchedThreads[i]._id, comments);
    }
  };


  console.log(threadsResult.fetchedThreads);


  //BIG NONONO CAUSES HYDRATION ERROR WHEN CALLED TO GENERATE CARDS
  // async function cardGenerator(thread: any)
  // {
  //   if (comments.length === 0)
  //   {
  //     comments = null; 
  //   }

  //   return(
  //     <ThreadCard 
  //       key={thread.id} id={thread.id} currentUserId={user?.id || ""} parentId={thread.parentId} content={thread.text} author={thread.author} 
  //       community={thread.community} createdAt={thread.createdAt} comments={comments}
  //     />
  //   );
  // }

  

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {
          threadsResult.fetchedThreads.length === 0 ? (
            <p className="no-result">No Threads found</p>
          ): (
              threadsResult.fetchedThreads.map((thread) =>  (
              <ThreadCard 
                key={thread.id} id={thread.id} currentUserId={user?.id || ""} parentId={thread.parentId} content={thread.text} author={thread.author} 
                community={thread.community} createdAt={thread.createdAt} comments={commentsMap.get(thread._id)}
              />)))
        }
      </section>
    </>
  );
}
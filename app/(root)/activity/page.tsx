import ActivityCard from "@/components/cards/ActivityCard";
import { getRecentActivity, updateAllUnread } from "@/lib/actions/activity.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

async function Page()
{
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    const activities = await getRecentActivity(userInfo._id);

    await updateAllUnread(userInfo._id);
    
    
    
    return(
        <section>
            <h1 className="head-text mb-10">Activity</h1>
            <section className="mt-10 flex flex-col gap-5">
                {
                    activities.length > 0 ? (activities.map((activity) => {

                        const time = Math.round((Date.now() - new Date(activity.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                        return(
                        <ActivityCard 
                        id={activity._id} key={activity._id} userId={activity.replyUser.id} username={activity.replyUser.username}
                        profileImage={activity.replyUser.profileImage} replyThreadId={activity.replyThread._id}
                        replyThreadText={activity.replyThread.text} parentThreadId={activity.parentThread} timestamp={time}
                        />);
                    }
                    )) : (<p className="!text-base-regular text-light-2">Looks like you don&apos;t have any activities</p>)
                }
            </section>
        </section>
    )
}

export default Page;
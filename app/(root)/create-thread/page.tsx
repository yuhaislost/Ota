import PostThread from "@/components/form/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from 'next/navigation';


async function Page()
{
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    if (!userInfo.onboarded)
    {
        redirect('/onboarding');
    }

    return (
        <section className="flex flex-col gap-20 px-6 md:px-12 lg:px-20">
            <h1 className="head-text">Create Thread</h1>

            <PostThread userId={userInfo._id}/>
        </section>
    );
};

export default Page;
import { currentUser } from "@clerk/nextjs";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import UserCard from "@/components/cards/UserCard";

async function Page()
{
    const user = await currentUser();
    if (!user) return null;

    const currentUserInfo = await fetchUser(user.id);
    if (!currentUserInfo?.onboarded)
    {
        redirect('/onboarding');
    }

    const {users: fetchedUsers, isNext} = await fetchUsers(user.id, '', 'desc', 1, 20);

    return(
        <section>
            <h1 className="head-text mb-10">Search</h1>
        </section>
    )
}

export default Page;
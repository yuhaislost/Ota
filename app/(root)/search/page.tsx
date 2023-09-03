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

            <div className="mt-14 flex flex-col gap-9">
                {
                    fetchedUsers.length === 0 ? (
                        <p className="no-result">No Users</p>
                    ) : (
                        <>
                            {fetchedUsers.map((fetchedUser) => (<UserCard key={fetchedUser.id} id={fetchedUser.id} name={fetchedUser.name} username={fetchedUser.username}
                                profileImage={fetchedUser.profileImage} userType="User"
                            />))}
                        </>
                    )
                }
            </div>
        </section>
    )
}

export default Page;
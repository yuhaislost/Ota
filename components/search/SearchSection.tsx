'use client';

import { useEffect, useState } from "react";
import { fetchUsers } from "@/lib/actions/user.actions";
import UserCard from "../cards/UserCard";

interface Props{
    userId: string
};

function SearchSection({ userId }: Props)
{
    const [fetchedResults, setFetchedResults] = useState<any>({});

    async function fetchQueryUsers()
    {
        setFetchedResults(await fetchUsers(userId, '', 'desc', 1, 20));
    }

    useEffect(() => {
        fetchQueryUsers();
    }
    , [fetchQueryUsers]);

    return (
        <>
             <div className="mt-14 flex flex-col gap-9">
                {
                    fetchedResults.users.length === 0 ? (
                        <p className="no-result">No Users</p>
                    ) : (
                        <>
                            {fetchedResults.users.map((fetchedUser : any) => (<UserCard key={fetchedUser.id} id={fetchedUser.id} name={fetchedUser.name} username={fetchedUser.username}
                                profileImage={fetchedUser.profileImage} userType="User"
                            />))}
                        </>
                    )
                }
            </div>
        </>
    );
}

export default SearchSection;
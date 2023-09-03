'use server'

import { connectToDb } from "../mongoose";
import User from '../models/UserModel';
import { revalidatePath } from "next/cache";
import { FilterQuery, SortOrder } from "mongoose";
import Thread from "../models/ThreadModel";


export async function updateUser(userID: string, username: string, name: string, bio: string, profileImage: string, path: string) : Promise<void> {
    try{
        connectToDb();

        await User.findOneAndUpdate({ id: userID}, {
            username: username.toLocaleLowerCase(),
            name: name,
            biography: bio,
            profileImage: profileImage,
            onboarded: true,
        }, {upsert: true});
    
        if (path === 'profile/edit')
        {
            revalidatePath(path);
        }
    }catch(error : any)
    {
        throw new Error(`User creation or modification failed. Error: ${error.message}`);
    }

}

export async function fetchUser(userID: string)
{
    try{
        connectToDb();

        return await User.findOne({ id: userID});
        // .populate({path: 'communities', model: Community})
    }catch(error : any)
    {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}

export async function fetchUsers(userId: string, searchString: string = "", sortBy: SortOrder ="desc", page: number = 1, pageSize: number  = 20)
{
    const skip = (page - 1) * pageSize;
    
    try{
        connectToDb();
        const regex = new RegExp(searchString, 'i');
        const query: FilterQuery<typeof User> = { id: {$ne: userId}};
        if (searchString.trim() !== '')
        {
            query.$or = [
                {
                    username: {$regex: regex}
                },
                {
                    name: {$regex: regex}
                }
            ];
        }

        const sortOptions = { createdAt: sortBy };

        const userQuery = User.find(query).sort(sortOptions).skip(skip).limit(pageSize);

        const totalUsersCount = await User.countDocuments(query);
        const users = await userQuery;

        const isNext = totalUsersCount > skip + users.length;
        return {users, isNext};

    }catch(error: any)
    {
        throw new Error(`Intenral Server Error: ${error.message}`);
    }
}
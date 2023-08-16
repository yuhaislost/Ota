'use server'

import { connectToDb } from "../mongoose";
import User from '../models/UserModel';
import { revalidatePath } from "next/cache";


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
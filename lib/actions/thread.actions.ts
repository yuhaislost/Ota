'use server'

import { revalidatePath } from "next/cache";
import Thread from "../models/ThreadModel";
import { connectToDb } from "../mongoose";

export async function createThread(text: string, author: string, communityId:  string | null, path: string){
    try{
        connectToDb();

        const thread = await Thread.create({
            text: text,
            author: author,
            community: null,
        });
    
        revalidatePath(path);
    }catch(error: any)
    {
        throw new Error(`Internal Server Error. Error: ${error.message}`);
    }
}
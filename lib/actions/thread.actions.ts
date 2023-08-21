'use server'

import { revalidatePath } from "next/cache";
import Thread from "../models/ThreadModel";
import { connectToDb } from "../mongoose";
import User from "../models/UserModel";
import { ObjectId } from "mongodb";

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

export async function fetchThreads(page = 1, pageSize = 20)
{
    connectToDb();

    const skip = (page - 1) * pageSize;

    try{ 
        const threadQuery = Thread.find({ parentId: {$in: [null, undefined]}}).sort({createdAt: 'desc'}).skip(skip).limit(pageSize).populate({path: 'author', model: User});

        const totalThreadCount = await Thread.countDocuments({parentId: {$in: [null, undefined]}});

        const fetchedThreads = await threadQuery.exec();

        const nextPage = totalThreadCount > skip + fetchedThreads.length;

        return {fetchedThreads, nextPage};

    }catch(error: any)
    {
        throw new Error(`Internal Server Error. Error: ${error.message}`);
    }
}

export async function fetchThreadComments(threadId: ObjectId, page = 1, pageSize = 20)
{
    connectToDb();
    const skip = (page - 1) * pageSize;

    try{
        const commentsQuery = Thread.find({parentId: threadId}).sort({createdAt: 'desc'}).skip(skip).limit(pageSize).populate({path: 'author', model: User});
        const comments = await commentsQuery.exec();
        const totalCommentCount = await Thread.countDocuments({parentId: threadId});

        const nextPage = totalCommentCount > skip + comments.length;

        return {comments, nextPage};

    }catch(error: any)
    {
        throw new Error(`Internal Server Error: ${error.message}`);
    }
}
'use server'

import { revalidatePath } from "next/cache";
import Thread from "../models/ThreadModel";
import { connectToDb } from "../mongoose";
import User from "../models/UserModel";
import { ObjectId } from "mongodb";

export async function createThread(text: string, author: string, parentId: string | null, communityId:  string | null, path: string){
    try{
        connectToDb();

        const thread = await Thread.create({
            text: text,
            author: author,
            community: null,
            parentId: parentId
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

export async function fetchAllComments(threadId: ObjectId)
{
    connectToDb();

    try{
        const comments = await Thread.find({parentId: threadId}).sort({createdAt: 'desc'}).populate({path: 'author', model: User, select: '_id id name image'});

        return comments

    }catch(error: any)
    {
        throw new Error(`Internal Server Error: ${error.message}`);
    }
}

export async function fetchThreadById(threadId: ObjectId)
{
    connectToDb();

    try{

        const thread = await Thread.findById(threadId).populate({
            path: 'author',
            model: User,
            select: '_id id name profileImage'
        });

        if (thread === null)
        {
            throw new Error("Thread Not Found!");
        }

        return thread;

    }catch(error: any)
    {
        throw new Error(`Internal Server Error: ${error.message}`);
    }

}

export async function createCommentThread(threadId: string, commentText: string, userId: string, path: string)
{
    connectToDb();

    try{

        const parentThread = await Thread.findById(threadId);

        if (!parentThread)
        {
            throw new Error('Parent Thread Not Found: You cannot add a comment to a non-existing thread');
        }

        const comment = await Thread.create({
            text: commentText,
            author: userId,
            community: parentThread.community,
            parentId: parentThread._id
        });
        
        revalidatePath(path);

        return comment;

    }catch(error: any)
    {
        throw new Error(`Internal Server Error: ${error.message}`);
    }
}
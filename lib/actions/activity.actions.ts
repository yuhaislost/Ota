'use server'

import mongoose from "mongoose";
import { connectToDb } from "../mongoose";
import Activity from "../models/ActivityModel";
import Thread from '@/lib/models/ThreadModel';
import User from '@/lib/models/UserModel';
import { revalidatePath } from "next/cache";

export async function createActivity(parentThreadId: mongoose.Types.ObjectId, parentUserId: mongoose.Types.ObjectId | null, replyThreadId: mongoose.Types.ObjectId, 
    replyUserId: mongoose.Types.ObjectId, read = false)
{
    try{

        connectToDb();

        let parentThread;

        if (!parentUserId)
        {
            parentThread = await Thread.findById(parentThreadId);
            parentUserId = parentThread.author;
        }
        
        if (replyUserId === parentUserId) return null;

        const activity = await Activity.create({parentThread: parentThreadId, parentUser: parentUserId, replyThread: replyThreadId, replyUser: replyUserId,  read: read});

        return activity;
    }catch(error: any)
    {
        throw new Error(`Internal Server Error: ${error.message}`);
    }
}


export async function getRecentActivity(userId: string)
{
    try{

        connectToDb();
        let timeframe: any = Date.now() - 1000 * 60 * 60 * 24 * 30;

        const recentActivity = await Activity.find(
            {
                parentUser: userId,
                $or:
                [
                    {read: false},
                    {createdAt: {$gte: timeframe}}
                ]
        
            }
        ).sort({'createdAt': 'desc'}).populate({path: 'replyUser', model: User, select: 'id _id name username profileImage'}).populate({path: 'replyThread', model: Thread, select: '_id text'});

        console.log(recentActivity);
        return recentActivity;

    }catch(error: any)
    {
        throw new Error(`Internal Server Error: ${error.message}`);
    }
}

export async function updateAllUnread(userId: string)
{
    try{
        connectToDb();

        const activities = Activity.updateMany({parentUser: userId, read: false}, {read: true});

        // revalidatePath(path);

        return activities;
    }catch(error: any)
    {
        throw new Error(`Internal Server Error: ${error.message}`);
    }
}

export async function getUnreadCount(userId: string)
{
    try{
        connectToDb();

        const unreadCount = Activity.countDocuments({parentUser: userId, read: false});

        return unreadCount;

    }catch(error: any){
        throw new Error(`Internal Server Error: ${error.message}`)
    }
}
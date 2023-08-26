'use client';

import * as z from 'zod';
import { commentValidation } from "@/lib/validation/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createCommentThread, createThread } from '@/lib/actions/thread.actions';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Image from 'next/image';

interface Props{
    threadId: string,
    currentUserImg: string,
    currentUserId: string
};

function Comment({ threadId, currentUserImg, currentUserId}: Props)
{
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(commentValidation),
        defaultValues:{
            thread: "",
            accountId: currentUserId,
        }
    });

    async function onSubmit(values: z.infer<typeof commentValidation>)
    {
        await createCommentThread(threadId, values.thread, JSON.parse(values.accountId), pathname);
        form.reset();
        // router.push(`/thread/${threadId}`);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col md:flex-row justify-center gap-8 relative mt-10'>
                <FormField control={form.control} name='thread' render={({ field }) => (
                    <FormItem className='flex flex-row justify-center items-center gap-3 w-full'>
                        <FormLabel> <Image src={currentUserImg} alt='Profile User' width={48} height={48} className='rounded-full object-cover'/> </FormLabel>
                        <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1 !m-0'>
                            <Input type='text' placeholder='Comment...' className='no-focus text-light-1  outline-none h-12 px-4' {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}/>
                <Button type='submit' className='bg-neutral-50 text-dark-1 hover:!bg-neutral-400 transition !duration-300 !h-auto'>Comment</Button>
            </form>
        </Form>
    );
}

export default Comment;
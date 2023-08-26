'use client'

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { threadValidation } from '@/lib/validation/thread';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { updateUser } from '@/lib/actions/user.actions';
import { usePathname, useRouter } from 'next/navigation';
import { createThread } from '@/lib/actions/thread.actions';


function PostThread({ userId }: {userId: string}){

    const router = useRouter();
    const pathname = usePathname();
    
    const form = useForm({
        resolver: zodResolver(threadValidation),
        defaultValues: {
            thread: '',
            accountId: userId
        }
    });

    async function onSubmit(values: z.infer<typeof threadValidation>){
        await createThread(values.thread, values.accountId, null, null, pathname);
        router.push('/');
    }

    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10 relative">
                <FormField control={form.control} name="thread" render={( { field }) => (
                    <FormItem className='flex flex-col gap-3 w-full'>
                        <FormLabel className='text-base-semibold text-light-2 '>Content</FormLabel>
                        <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                            <Textarea rows={8} {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                    )}
                />
                <Button type="submit" className='bg-neutral-50 text-dark-1 hover:!bg-neutral-400 transition !duration-300'>Post Thread</Button>
            </form>
        </Form>
    );
}

export default PostThread;
'use client'
import * as z from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { userValidation } from "@/lib/validation/user";

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
import { Input } from "@/components/ui/input";
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';
import { updateUser } from '@/lib/actions/user.actions';
import { usePathname, useRouter } from 'next/navigation';

interface Props{
    user: {
        id: string,
        objectId: string,
        username: string,
        name: string,
        bio: string,
        image: string,
    },
    btnTitle: string
};

const AccountProfile = ({user, btnTitle}: Props) => {
    
    const form = useForm({
        resolver: zodResolver(userValidation),
        defaultValues: {
            profile_photo: user?.image || '',
            name: user?.name || '',
            username: user?.username || '',
            bio: user?.bio || '',
        }
    });

    const [files, setFiles] = useState<File[]>([]);
    const { startUpload } = useUploadThing('media');

    const router = useRouter();
    const pathName = usePathname();

      // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof userValidation>) {
        const blob = values.profile_photo;

        const hasImageChanged = isBase64Image(blob);

        if (hasImageChanged)
        {
            const imgRes = await startUpload(files);

            if (imgRes && imgRes[0].fileUrl)
            {
                values.profile_photo = imgRes[0].fileUrl;
            }
        }

        await updateUser(user.id, values.username, values.name, values.bio, values.profile_photo, pathName);

        if (pathName === '/profile/edit')
        {
            router.back();
        } else {
            router.push('/');
        }
    }

    function handleImage(event : ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void)
    {
        event.preventDefault();
        const fileReader = new FileReader();

        if (event.target.files && event.target.files.length > 0)
        {
            const file = event.target.files[0];
            setFiles(Array.from(event.target.files));
            if (!file.type.includes('image'))
            {
                return;
            }

            fileReader.onload = async (e) => {
                const imageDataUrl = e.target?.result?.toString() || '';
                fieldChange(imageDataUrl);
            }

            fileReader.readAsDataURL(file);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10 relative">
                <FormField
                control={form.control}
                name="profile_photo"
                render={({ field }) => (
                    <FormItem className='flex flex-col md:flex-row items-center gap-4 '>
                        <FormLabel className='account-form_image-label'>
                            {
                            field.value ? (<Image src={field.value} alt='profile_photo' width={96} height={96} priority className='rounded-full w-[96px] h-[96px] !object-cover'/>) : 
                            (<Image src="/assets/profile.svg" alt='profile_photo' width={24} height={24} className='object-contain'/>)
                            }
                        </FormLabel>
                        <FormControl className='flex-1 text-base-semibold text-gray-200'>
                            <Input type='file' accept='image/*' placeholder='Upload an image' className='bg-inherit border-none file:py-2 file:px-5 file:rounded-md hover:file:bg-neutral-400 file:transition file:duration-400 file:mr-5 file:text-dark-1 hover:file:!cursor-pointer file:bg-neutral-50 h-full' onChange={(event) => handleImage(event, field.onChange)} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem className='flex flex-col gap-3 w-full'>
                        <FormLabel className='text-base-semibold text-light-2 '>Name</FormLabel>
                        <FormControl>
                            <Input type="text" className='account-form_input no-focus text-small-regular' {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem className='flex flex-col gap-3 w-full'>
                        <FormLabel className='text-base-semibold text-light-2'>Username</FormLabel>
                        <FormControl>
                            <Input type="text" className='account-form_input no-focus text-small-regular' {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                    <FormItem className='flex flex-col gap-3 w-full'>
                        <FormLabel className='text-base-semibold text-light-2'>Bio</FormLabel>
                        <FormControl className='flex-1 text-base-semibold text-gray-200'>
                            <Textarea rows={5} className='account-form_input !no-focus text-small-regular p-2' {...field} />
                        </FormControl>
                        <FormDescription className='text-[14px] leading-5 text-gray-500'>This is your bio it will be your short introduction to the world! So give it some flare.</FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}
                />
                <Button type="submit" className='bg-neutral-50 text-dark-1 hover:!bg-neutral-400 transition !duration-300'>Update Profile</Button>
            </form>
        </Form>
    )
};

export default AccountProfile;
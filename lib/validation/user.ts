import * as z from 'zod';

export const userValidation = z.object({
    profile_photo: z.string().url().nonempty(),
    name: z.string().min(2, { message: "Hey, Ota doesn't accept names with less than 2 characters."}).max(40, { message: "Look man, we've never seen a name that's that long. Please keep it under 40 characters :)"}),
    username: z.string().min(3, {message: "Hey, Ota doesn't accept names with less than 3 characters."}).max(30, { message: "Look man, we've never seen a username that's that long. Please keep it under 30 characters :)"}),
    bio: z.string().min(0).max(200)
});
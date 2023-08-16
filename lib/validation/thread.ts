import * as z from 'zod';

export const threadValidation = z.object({
    thread: z.string().nonempty().min(1, { message: 'Minimum of 1 character!'}).max(1000, { message: 'Maimum of 1000 characters'}),
    accountId: z.string(),
});

export const commentValidation = z.object({
    thread: z.string().nonempty().min(1, { message: 'Minimum of 1 character!'}).max(1000, { message: 'Maimum of 1000 characters'}),
    accountId: z.string(),
})
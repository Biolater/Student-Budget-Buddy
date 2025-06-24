'use server';

import { cache } from "react";

import { auth } from "@clerk/nextjs/server";

export const requireUser = cache(async () => {
    const user = await auth();

    if (!user) {
        throw new Error("User not authenticated");
    }
    return user;
});

export const assertUser = async (userId: string | undefined | null) => {
    if (!userId) {
        throw new Error("You must be signed in to perform this action");
    }
};
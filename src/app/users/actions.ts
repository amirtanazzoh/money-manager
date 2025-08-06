"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createUser ( formData: FormData ) {
    const name = formData.get( "name" )?.toString().trim();

    if ( !name ) throw new Error( "Name is required" );

    await prisma.user.create( {
        data: { name },
    } );

    revalidatePath( "/users" );
}

export async function deleteUserById ( id: number ) {
    await prisma.user.delete( { where: { id } } );
    revalidatePath( "/users" );
}

"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateCategory ( formData: FormData ) {
    const id = Number( formData.get( "id" ) );
    const name = formData.get( "name" )?.toString();
    const budget = Number( formData.get( "budget" ) );

    if ( !id || !name ) throw new Error( "Missing data" );

    await prisma.category.update( {
        where: { id },
        data: {
            name,
            budget: isNaN( budget ) ? 0 : budget,
        },
    } );

    revalidatePath( "/categories" );
    redirect( "/categories" );
}

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategory ( formData: FormData ) {
    const name = formData.get( "name" )?.toString();
    const monthlyBudget = Number( formData.get( "monthlyBudget" ) || 0 );

    if ( !name ) throw new Error( "Name is required" );

    await prisma.category.create( {
        data: {
            name,
            budget: isNaN( monthlyBudget ) ? 0 : monthlyBudget,
        },
    } );

    revalidatePath( "/categories" );
}

export async function deleteCategory ( id: number ) {
    await prisma.category.delete( {
        where: { id },
    } );

    revalidatePath( "/categories" );
}

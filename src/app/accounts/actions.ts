"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBankAccount ( formData: FormData ) {
    const name = formData.get( "name" )?.toString().trim();
    const amount = Number( formData.get( "initialAmount" ) || 0 );

    if ( !name ) throw new Error( "Name is required" );

    await prisma.bankAccount.create( {
        data: {
            name,
            initialAmount: isNaN( amount ) ? 0 : amount,
        },
    } );

    revalidatePath( "/accounts" );
}

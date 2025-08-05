"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createTransaction ( formData: FormData ) {
    const title = formData.get( "title" )?.toString();
    const amount = Number( formData.get( "amount" ) );
    const type = formData.get( "type" )?.toString() as "INCOME" | "EXPENSE";
    const categoryId = Number( formData.get( "categoryId" ) );
    const accountId = Number( formData.get( "accountId" ) );
    const note = formData.get( "note" )?.toString() || "";

    if ( !title || !amount || !type || !categoryId || !accountId ) {
        throw new Error( "Missing required fields" );
    }

    // Parse share inputs
    const shares: { userId: number; amount: number; }[] = [];

    for ( let i = 0; i < 7; i++ ) {
        const userIdStr = formData.get( `shares[${ i }][userId]` )?.toString();
        const amountStr = formData.get( `shares[${ i }][amount]` )?.toString();

        if ( userIdStr && amountStr ) {
            const userId = Number( userIdStr );
            const shareAmount = Number( amountStr );
            if ( !isNaN( userId ) && !isNaN( shareAmount ) ) {
                shares.push( { userId, amount: shareAmount } );
            }
        }
    }

    await prisma.transaction.create( {
        data: {
            title,
            amount,
            type,
            categoryId,
            accountId,
            note,
            shares: {
                create: shares,
            }
        },
    } );

    redirect( "/transactions" );
}

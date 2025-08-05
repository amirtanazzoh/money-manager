// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main ()
{
    // Users (for shared expenses)
    const fatemeh = await prisma.user.upsert( {
        where: { name: 'Fatemeh' },
        update: {},
        create: { name: 'Fatemeh' },
    } );

    const iman = await prisma.user.upsert( {
        where: { name: 'Iman' },
        update: {},
        create: { name: 'Iman' },
    } );

    // Bank accounts
    const wallet = await prisma.bankAccount.upsert( {
        where: { name: 'Wallet' },
        update: {},
        create: {
            name: 'Wallet',
            initialAmount: 1000000,
        },
    } );

    const bankMelli = await prisma.bankAccount.upsert( {
        where: { name: 'Bank Melli' },
        update: {},
        create: {
            name: 'Bank Melli',
            initialAmount: 5000000,
        },
    } );

    // Categories
    const food = await prisma.category.upsert( {
        where: { name: 'Food' },
        update: {},
        create: {
            name: 'Food',
            type: 'EXPENSE',
            budget: 3000000,
        },
    } );

    const salary = await prisma.category.upsert( {
        where: { name: 'Salary' },
        update: {},
        create: {
            name: 'Salary',
            type: 'INCOME',
        },
    } );

    const reimbursement = await prisma.category.upsert( {
        where: { name: 'Reimbursement' },
        update: {},
        create: {
            name: 'Reimbursement',
            type: 'INCOME',
        },
    } );

    // A shared dinner
    const dinner = await prisma.transaction.create( {
        data: {
            title: 'Dinner at Cafe',
            amount: 400000,
            type: 'EXPENSE',
            categoryId: food.id,
            accountId: wallet.id,
            note: 'Paid for me and Fatemeh',
            shares: {
                create: [
                    { userId: fatemeh.id, amount: 200000 },
                    { userId: iman.id, amount: 200000 },
                ],
            },
        },
    } );

    // A reimbursement from Fatemeh
    const payback = await prisma.transaction.create( {
        data: {
            title: 'Payback from Fatemeh',
            amount: 200000,
            type: 'INCOME',
            categoryId: reimbursement.id,
            accountId: wallet.id,
            note: 'She paid her part',
            shares: {
                create: [
                    { userId: fatemeh.id, amount: 200000 },
                ],
            },
        },
    } );

    // A salary income
    await prisma.transaction.create( {
        data: {
            title: 'Monthly Salary',
            amount: 8000000,
            type: 'INCOME',
            categoryId: salary.id,
            accountId: bankMelli.id,
            note: 'August salary',
        },
    } );
}

main()
    .then( () =>
    {
        console.log( '✅ Seed complete!' );
    } )
    .catch( ( e ) =>
    {
        console.error( '❌ Seed error:', e );
        process.exit( 1 );
    } )
    .finally( async () =>
    {
        await prisma.$disconnect();
    } );

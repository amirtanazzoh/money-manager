import { prisma } from "@/lib/prisma";
import { Price } from "@/components/price";
import Link from "next/link";
import jalaali from "jalaali-js";

export default async function TransactionsPage () {
    const transactions = await prisma.transaction.findMany( {
        orderBy: { date: "desc" },
        include: {
            category: true,
            account: true,
        },
    } );

    return (
        <div>
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Transactions</h1>
                <Link
                    href="/transactions/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add Transaction
                </Link>
            </header>

            <table className="w-full border-collapse table-auto">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">Title</th>
                        <th className="p-2 border">Amount</th>
                        <th className="p-2 border">Type</th>
                        <th className="p-2 border">Category</th>
                        <th className="p-2 border">Account</th>
                        <th className="p-2 border">Date</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { transactions.map( ( tx ) => {
                        const jDate = jalaali.toJalaali( new Date( tx.date ) );
                        const formatted = `${ jDate.jy }/${ jDate.jm.toString().padStart( 2, "0" ) }/${ jDate.jd.toString().padStart( 2, "0" ) }`;

                        return (
                            <tr
                                key={ tx.id }
                                className={ `hover:bg-gray-100 ${ tx.type === "INCOME" ? "bg-green-50" : "bg-red-50"
                                    }` }
                            >

                                <td className="p-2 border">{ tx.title }</td>
                                <td className="p-2 border">
                                    <Price amount={ tx.amount } />
                                </td>
                                <td className="p-2 border">{ tx.type }</td>
                                <td className="p-2 border">{ tx.category?.name || "-" }</td>
                                <td className="p-2 border">{ tx.account?.name || "-" }</td>
                                <td className="p-2 border">
                                    { formatted }
                                </td>
                                <td className="p-2 border space-x-2">
                                    <Link
                                        href={ `/transactions/${ tx.id }/edit` }
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    {/* Delete button with server action will come next */ }
                                </td>
                            </tr>
                        );
                    } ) }
                </tbody>
            </table>
        </div>
    );
}

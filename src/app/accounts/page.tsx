import { prisma } from "@/lib/prisma";
import { createBankAccount } from "./actions";
import { Price } from "@/components/price";

export default async function AccountsPage () {
    const accounts = await prisma.bankAccount.findMany( {
        include: {
            transactions: true,
        },
    } );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Bank Accounts</h1>

            {/* Create Account */ }
            <form action={ createBankAccount } className="space-y-2 bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold">Add Account</h2>
                <input
                    name="name"
                    placeholder="Account name"
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    name="initialAmount"
                    type="number"
                    placeholder="Initial balance"
                    className="w-full border p-2 rounded"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Add Account
                </button>
            </form>

            {/* Account List */ }
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold mb-2">All Accounts</h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border text-right">Starting</th>
                            <th className="p-2 border text-right">Transactions</th>
                            <th className="p-2 border text-right">Current Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        { accounts.map( ( account ) => {
                            const txSum = account.transactions.reduce( ( sum, tx ) => {
                                return tx.type === "INCOME"
                                    ? sum + tx.amount
                                    : sum - tx.amount;
                            }, 0 );
                            const current = account.initialAmount + txSum;

                            return (
                                <tr key={ account.id } className="hover:bg-gray-50">
                                    <td className="p-2 border">{ account.name }</td>
                                    <td className="p-2 border text-right">
                                        <Price amount={ account.initialAmount } />
                                    </td>
                                    <td className="p-2 border text-right">
                                        <Price amount={ txSum } />
                                    </td>
                                    <td className={ `p-2 border text-right font-semibold ${ current < 0 ? "text-red-600" : "text-green-600"
                                        }` }>
                                        <Price amount={ current } />
                                    </td>
                                </tr>
                            );
                        } ) }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

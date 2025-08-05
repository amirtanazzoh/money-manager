import { createTransaction } from "./actions";
import { prisma } from "@/lib/prisma";

export default async function AddTransactionPage () {
    const categories = await prisma.category.findMany();
    const accounts = await prisma.bankAccount.findMany();
    const users = await prisma.user.findMany();

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add Transaction</h1>

            <form action={ createTransaction } className="space-y-4">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    required
                    className="w-full p-2 border rounded"
                />

                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    required
                    className="w-full p-2 border rounded"
                />

                <select name="type" className="w-full p-2 border rounded" required>
                    <option value="">Select Type</option>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                </select>

                <select name="categoryId" className="w-full p-2 border rounded" required>
                    <option value="">Select Category</option>
                    { categories.map( ( cat ) => (
                        <option key={ cat.id } value={ cat.id }>
                            { cat.name }
                        </option>
                    ) ) }
                </select>

                <select name="accountId" className="w-full p-2 border rounded" required>
                    <option value="">Select Bank Account</option>
                    { accounts.map( ( acc ) => (
                        <option key={ acc.id } value={ acc.id }>
                            { acc.name }
                        </option>
                    ) ) }
                </select>

                <textarea
                    name="note"
                    placeholder="Note (optional)"
                    className="w-full p-2 border rounded"
                />

                <h2 className="font-medium text-lg mt-6">Split With Others (Optional)</h2>
                <p className="text-sm text-gray-500 mb-2">
                    You can split this with up to 7 users. Leave empty if not shared.
                </p>


                <div className="space-y-2">
                    { Array.from( { length: 7 } ).map( ( _, index ) => (
                        <div key={ index } className="flex gap-2">
                            <select name={ `shares[${ index }][userId]` } className="flex-1 p-2 border rounded">
                                <option value="">Select User</option>
                                { users.map( ( user ) => (
                                    <option key={ user.id } value={ user.id }>
                                        { user.name }
                                    </option>
                                ) ) }
                            </select>
                            <input
                                type="number"
                                name={ `shares[${ index }][amount]` }
                                className="w-32 p-2 border rounded"
                                placeholder="Amount"
                                step="0.01"
                            />
                        </div>
                    ) ) }
                </div>


                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Save
                </button>
            </form>
        </div>
    );
}

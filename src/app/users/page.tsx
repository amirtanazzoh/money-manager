import { prisma } from "@/lib/prisma";
import { createUser, deleteUserById } from "./actions";
import { Price } from "@/lib/price";

export default async function UsersPage () {
    const users = await prisma.user.findMany( {
        include: {
            shares: {
                include: {
                    transaction: true,
                },
            },
        },
    } );

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Users</h1>

            {/* Create User */ }
            <form action={ createUser } className="space-y-2 bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold">Add User</h2>
                <input
                    name="name"
                    placeholder="User name"
                    className="w-full border p-2 rounded"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add
                </button>
            </form>

            {/* Users List */ }
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold mb-2">All Users</h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Owes Me</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { users.map( ( user ) => {
                            async function deleteAction () {
                                "use server";
                                await deleteUserById( user.id );
                            }

                            return (
                                <tr key={ user.id } className="hover:bg-gray-50">
                                    <td className="p-2 border">{ user.name }</td>
                                    <td className="p-2 border text-left font-semibold">
                                        { ( () => {
                                            const totalOwed = user.shares.reduce( ( sum, share ) => {
                                                return share.transaction?.type === "EXPENSE" ? sum + share.amount : sum;
                                            }, 0 );

                                            return <Price amount={ totalOwed } />;
                                        } )() }
                                    </td>
                                    <td className="p-2 border">
                                        <form action={ deleteAction }>
                                            <button className="text-red-600 hover:underline">
                                                Delete
                                            </button>
                                        </form>
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

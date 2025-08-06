import { prisma } from "@/lib/prisma";
import { createCategory, deleteCategory } from "./actions";
import { Price } from "@/components/price";
import { startOfMonth, endOfMonth } from "date-fns";

export default async function CategoriesPage () {

    const now = new Date();
    const categories = await prisma.category.findMany( {
        include: {
            transactions: {
                where: {
                    type: "EXPENSE",
                    date: {
                        gte: startOfMonth( now ),
                        lte: endOfMonth( now ),
                    },
                },
            },
        },
    } );


    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold">Categories</h1>

            {/* Category Creation Form */ }
            <form action={ createCategory } className="space-y-2 bg-white p-4 rounded shadow">
                <h2 className="font-semibold text-lg">Add Category</h2>

                <input
                    name="name"
                    placeholder="Category name"
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    name="monthlyBudget"
                    placeholder="Monthly Budget (optional)"
                    type="number"
                    className="w-full border p-2 rounded"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Create
                </button>
            </form>

            {/* Category List */ }
            <div className="bg-white p-4 rounded shadow">
                <h2 className="font-semibold text-lg mb-4">All Categories</h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Budget</th>
                            <th className="p-2 border">Spent</th>
                            <th className="p-2 border">Remaining</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { categories.map( ( cat ) => {
                            // ✅ Server action per category
                            async function deleteAction () {
                                "use server";
                                await deleteCategory( cat.id );
                            }

                            return (
                                <tr key={ cat.id } className="hover:bg-gray-50">
                                    <td className="p-2 border">{ cat.name }</td>

                                    { ( () => {
                                        const spent = cat.transactions.reduce( ( sum, t ) => sum + t.amount, 0 );
                                        const remaining = ( cat.budget || 0 ) - spent;

                                        return (
                                            <>
                                                <td className="p-2 border">
                                                    <Price amount={ cat.budget || 0 } />
                                                </td>
                                                <td className="p-2 border">
                                                    <Price amount={ spent } />
                                                </td>
                                                <td className={ `p-2 border ${ remaining < 0 ? "text-red-600" : "text-green-600" }` }>
                                                    <Price amount={ remaining } />
                                                </td>
                                            </>
                                        );
                                    } )() }

                                    <td className="p-2 border flex gap-1.5">
                                        <a
                                            href={ `/categories/${ cat.id }/edit` }
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </a>
                                        <form action={ deleteAction }>
                                            <button className="text-red-600 hover:underline">Delete</button>
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

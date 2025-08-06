import { prisma } from "@/lib/prisma";
import { updateCategory } from "./actions";

interface Props {
    params: { id: string; };
}

export default async function EditCategoryPage ( { params }: Props ) {
    const category = await prisma.category.findUnique( {
        where: { id: Number( params.id ) },
    } );

    if ( !category ) return <p>Category not found.</p>;

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Edit Category</h1>

            <form action={ updateCategory } className="space-y-4 bg-white p-4 shadow rounded">
                <input type="hidden" name="id" value={ category.id } />

                <label>Name</label>
                <input
                    name="name"
                    defaultValue={ category.name }
                    className="w-full border p-2 rounded"
                    placeholder="Category name"
                    required
                />

                <label>Budget</label>
                <input
                    type="number"
                    name="monthlyBudget"
                    defaultValue={ category.budget || 0 }
                    className="w-full border p-2 rounded"
                    placeholder="Monthly budget (optional)"
                />

                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                    Update
                </button>
            </form>
        </div>
    );
}

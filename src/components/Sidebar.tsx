"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { label: "Dashboard", href: "/" },
    { label: "Transactions", href: "/transactions" },
    { label: "Categories", href: "/categories" },
    { label: "Bank Accounts", href: "/accounts" },
    { label: "Users", href: "/users" },
];

export default function Sidebar () {
    const pathname = usePathname();

    return (
        <aside className="w-60 bg-gray-900 text-white h-screen p-4 flex flex-col">
            <h2 className="text-2xl font-bold mb-8">Money Manager</h2>
            <nav className="flex flex-col gap-4">
                { navItems.map( ( { href, label } ) => (
                    <Link
                        key={ href }
                        href={ href }
                        className={ `block px-3 py-2 rounded hover:bg-gray-700 ${ pathname === href ? "bg-gray-700 font-semibold" : ""
                            }` }
                    >
                        { label }
                    </Link>
                ) ) }
            </nav>
        </aside>
    );
}

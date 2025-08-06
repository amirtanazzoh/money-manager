// components/dashboard/dashboard-card.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

export function DashboardCard ( {
    title,
    amount,
    subtitle,
    badge,
    icon,
    color = "text-white",
}: {
    title: string;
    amount: ReactNode;
    subtitle?: string;
    badge?: string;
    icon?: React.ReactNode;
    color?: string;
} ) {
    return (
        <Card className="bg-neutral-900 text-white rounded-xl border border-neutral-800 shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div>
                    <CardTitle className="text-sm font-medium text-muted-foreground">{ title }</CardTitle>
                </div>
                { badge && (
                    <span className="text-xs bg-neutral-800 border border-neutral-700 rounded-full px-2 py-0.5">
                        { badge }
                    </span>
                ) }
            </CardHeader>
            <CardContent className="pt-0">
                <div className="text-2xl font-bold">{ amount }</div>
                { subtitle && <p className="text-sm text-muted-foreground mt-1">{ subtitle }</p> }
            </CardContent>
        </Card>
    );
}

// app/dashboard/page.tsx
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Price } from "@/components/price";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage () {
  const [ income, expense, users ] = await Promise.all( [
    prisma.transaction.aggregate( {
      _sum: { amount: true },
      where: { type: "INCOME" },
    } ),
    prisma.transaction.aggregate( {
      _sum: { amount: true },
      where: { type: "EXPENSE" },
    } ),
    prisma.user.findMany( { include: { shares: { include: { transaction: true } } } } ),
  ] );

  const totalIncome = income._sum.amount || 0;
  const totalExpense = expense._sum.amount || 0;
  const net = totalIncome - totalExpense;

  const totalOwe = users.reduce( ( total, user ) => {
    const owed = user.shares.reduce( ( sum, share ) => {
      return share.transaction?.type === "EXPENSE" ? sum + share.amount : sum;
    }, 0 );
    return total + owed;
  }, 0 );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <DashboardCard
        title="Total Income"
        amount={ <Price amount={ totalIncome } /> }
        subtitle="From all sources"
        badge="+"
      />
      <DashboardCard
        title="Total Expense"
        amount={ <Price amount={ totalExpense } /> }
        subtitle="All spending"
        badge="-"
      />
      <DashboardCard
        title="Net Balance"
        amount={ <Price amount={ net } /> }
        subtitle="Income - Expense"
        badge={ `${ ( ( net / totalIncome ) * 100 ).toFixed( 1 ) }%` }
      />
      <DashboardCard
        title="Total Owed"
        amount={ <Price amount={ totalOwe } /> }
        subtitle="From shared expenses"
        badge="Split"
      />
    </div>
  );
}

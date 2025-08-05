import ReportCard from "@/components/ReportCard";
import { ArrowDownIcon, ArrowUpIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { prisma } from "../lib/prisma";

export default async function DashboardPage () {
  // Total income
  const totalIncome = await prisma.transaction.aggregate( {
    where: { type: "INCOME" },
    _sum: { amount: true },
  } );

  // Total expense
  const totalExpense = await prisma.transaction.aggregate( {
    where: { type: "EXPENSE" },
    _sum: { amount: true },
  } );

  // Calculate net balance = income - expense
  const balance = ( totalIncome._sum.amount || 0 ) - ( totalExpense._sum.amount || 0 );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ReportCard
        title="Total Income"
        value={ totalIncome._sum.amount || 0 }
        icon={ <ArrowDownIcon /> }
        className="border-l-4 border-green-500"
      />
      <ReportCard
        title="Total Expense"
        value={ totalExpense._sum.amount || 0 }
        icon={ <ArrowUpIcon /> }
        className="border-l-4 border-red-500"
      />
      <ReportCard
        title="Net Balance"
        value={ balance }
        icon={ <CurrencyDollarIcon /> }
        className="border-l-4 border-blue-500"
      />
    </div>
  );
}

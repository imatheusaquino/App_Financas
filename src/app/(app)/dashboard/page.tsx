import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { ExpenseChart } from '@/components/dashboard/expense-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { MonthSelector } from '@/components/dashboard/month-selector'
import { format } from 'date-fns'
import { Transaction } from '@/types'

interface DashboardPageProps {
  searchParams: Promise<{ month?: string }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams
  const currentMonth = params.month ?? format(new Date(), 'yyyy-MM')
  const [year, month] = currentMonth.split('-')
  const startDate = `${year}-${month}-01`
  const endDate = `${year}-${month}-31`

  const supabase = await createClient()
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false })

  const txs: Transaction[] = transactions ?? []

  const totalIncome = txs
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = txs
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenseByCategory = txs
    .filter(t => t.type === 'expense')
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount
      return acc
    }, {})

  const chartData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }))

  return (
    <>
      <Header title="Dashboard" />
      <div className="flex-1 px-6 py-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-slate-500">Resumo do período selecionado</p>
          <MonthSelector currentMonth={currentMonth} />
        </div>
        <SummaryCards totalIncome={totalIncome} totalExpense={totalExpense} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpenseChart data={chartData} />
          <RecentTransactions transactions={txs.slice(0, 5)} />
        </div>
      </div>
    </>
  )
}

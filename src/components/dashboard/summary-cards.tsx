import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { formatCurrency } from '@/lib/format'

interface SummaryCardsProps {
  totalIncome: number
  totalExpense: number
}

export function SummaryCards({ totalIncome, totalExpense }: SummaryCardsProps) {
  const balance = totalIncome - totalExpense

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Receitas</CardTitle>
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
          <p className="text-xs text-slate-400 mt-1">Total do período</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Despesas</CardTitle>
          <div className="p-2 bg-red-100 rounded-lg">
            <TrendingDown className="h-4 w-4 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
          <p className="text-xs text-slate-400 mt-1">Total do período</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Saldo</CardTitle>
          <div className={`p-2 rounded-lg ${balance >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
            <Wallet className={`h-4 w-4 ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
          </div>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            {formatCurrency(balance)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Receitas - Despesas</p>
        </CardContent>
      </Card>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Transaction } from '@/types'
import { formatCurrency, formatDate } from '@/lib/format'
import { TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Transações Recentes</CardTitle>
        <Link href="/transactions">
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            Ver todas
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-8">
            Nenhuma transação registrada ainda.
          </p>
        ) : (
          <div className="space-y-3">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    t.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {t.type === 'income'
                      ? <TrendingUp className="h-4 w-4 text-green-600" />
                      : <TrendingDown className="h-4 w-4 text-red-600" />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{t.description}</p>
                    <p className="text-xs text-slate-400">{formatDate(t.date)} · {t.category}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold flex-shrink-0 ${
                  t.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

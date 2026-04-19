import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { TransactionRow } from '@/components/transactions/transaction-row'
import { TransactionsFilters } from '@/components/transactions/transactions-filters'
import { NewTransactionButton } from '@/components/transactions/new-transaction-button'
import { Card, CardContent } from '@/components/ui/card'
import { Suspense } from 'react'
import { Transaction } from '@/types'
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns'

interface TransactionsPageProps {
  searchParams: Promise<{
    month?: string
    type?: string
    category?: string
  }>
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })

  if (params.month) {
    const refDate = parseISO(`${params.month}-01`)
    const startDate = format(startOfMonth(refDate), 'yyyy-MM-dd')
    const endDate = format(endOfMonth(refDate), 'yyyy-MM-dd')
    query = query.gte('date', startDate).lte('date', endDate)
  }

  if (params.type && params.type !== 'all') {
    query = query.eq('type', params.type)
  }

  if (params.category && params.category !== 'all') {
    query = query.eq('category', params.category)
  }

  const { data: transactions } = await query
  const txs: Transaction[] = transactions ?? []

  return (
    <>
      <Header title="Transações" />
      <div className="flex-1 px-6 py-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Suspense fallback={null}>
            <TransactionsFilters />
          </Suspense>
          <NewTransactionButton />
        </div>

        <Card>
          <CardContent className="p-0">
            {txs.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-16">
                Nenhuma transação encontrada.
              </p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Descrição</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wide hidden sm:table-cell">Categoria</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wide hidden md:table-cell">Data</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Valor</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {txs.map((t) => (
                    <TransactionRow key={t.id} transaction={t} />
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

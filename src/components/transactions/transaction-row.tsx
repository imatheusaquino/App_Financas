'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Transaction } from '@/types'
import { formatCurrency, formatDate } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TransactionForm } from './transaction-form'
import { TrendingUp, TrendingDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface TransactionRowProps {
  transaction: Transaction
}

export function TransactionRow({ transaction: t }: TransactionRowProps) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) return
    const supabase = createClient()
    const { error } = await supabase.from('transactions').delete().eq('id', t.id)
    if (error) {
      toast.error('Erro ao excluir transação.')
      return
    }
    toast.success('Transação excluída.')
    router.refresh()
  }

  return (
    <>
      <tr className="border-b hover:bg-slate-50 transition-colors">
        <td className="py-3 px-4">
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg ${t.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
              {t.type === 'income'
                ? <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                : <TrendingDown className="h-3.5 w-3.5 text-red-600" />
              }
            </div>
            <span className="text-sm font-medium text-slate-800">{t.description}</span>
          </div>
        </td>
        <td className="py-3 px-4 hidden sm:table-cell">
          <Badge variant="secondary" className="text-xs">{t.category}</Badge>
        </td>
        <td className="py-3 px-4 hidden md:table-cell text-sm text-slate-500">
          {formatDate(t.date)}
        </td>
        <td className="py-3 px-4 text-right">
          <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
          </span>
        </td>
        <td className="py-3 px-4 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
      <TransactionForm open={editOpen} onClose={() => setEditOpen(false)} transaction={t} />
    </>
  )
}

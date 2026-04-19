'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types'
import { useTransition } from 'react'

const ALL_CATEGORIES = ['Todas', ...Array.from(new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]))]

export function TransactionsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    startTransition(() => router.push(`?${params.toString()}`))
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Input
        type="month"
        className="w-40"
        value={searchParams.get('month') ?? ''}
        onChange={(e) => update('month', e.target.value)}
        placeholder="Período"
      />
      <Select
        value={searchParams.get('type') ?? 'all'}
        onValueChange={(v) => update('type', v ?? '')}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="income">Receitas</SelectItem>
          <SelectItem value="expense">Despesas</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={searchParams.get('category') ?? 'all'}
        onValueChange={(v) => update('category', v ?? 'all')}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          {ALL_CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat === 'Todas' ? 'all' : cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

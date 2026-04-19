'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Transaction, TransactionFormData, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types'

interface TransactionFormProps {
  open: boolean
  onClose: () => void
  transaction?: Transaction
}

export function TransactionForm({ open, onClose, transaction }: TransactionFormProps) {
  const router = useRouter()
  const isEditing = !!transaction

  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<'income' | 'expense'>(transaction?.type ?? 'expense')
  const [form, setForm] = useState<Omit<TransactionFormData, 'type'>>({
    amount: transaction?.amount.toString() ?? '',
    description: transaction?.description ?? '',
    category: transaction?.category ?? '',
    date: transaction?.date ?? new Date().toISOString().split('T')[0],
  })

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  function handleChange(field: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const amount = parseFloat(form.amount.replace(',', '.'))
    if (isNaN(amount) || amount <= 0) {
      toast.error('Informe um valor válido.')
      return
    }
    if (!form.category) {
      toast.error('Selecione uma categoria.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    // Busca o usuário autenticado para incluir o user_id no payload
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      toast.error('Sessão expirada. Faça login novamente.')
      setLoading(false)
      return
    }

    const payload = {
      user_id: user.id,
      type,
      amount,
      description: form.description,
      category: form.category,
      date: form.date,
    }

    if (isEditing) {
      const { error } = await supabase
        .from('transactions')
        .update(payload)
        .eq('id', transaction.id)

      if (error) {
        toast.error(`Erro ao atualizar: ${error.message}`)
        setLoading(false)
        return
      }
      toast.success('Transação atualizada!')
    } else {
      const { error } = await supabase.from('transactions').insert(payload)
      if (error) {
        toast.error(`Erro ao registrar: ${error.message}`)
        setLoading(false)
        return
      }
      toast.success('Transação registrada!')
    }

    setLoading(false)
    onClose()
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar transação' : 'Nova transação'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={type} onValueChange={(v) => { setType(v as 'income' | 'expense'); setForm(f => ({ ...f, category: '' })) }}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="expense" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                Despesa
              </TabsTrigger>
              <TabsTrigger value="income" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                Receita
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label>Valor (R$)</Label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              value={form.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              placeholder="Ex: Supermercado"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={form.category} onValueChange={(v) => handleChange('category', v ?? '')}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Registrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

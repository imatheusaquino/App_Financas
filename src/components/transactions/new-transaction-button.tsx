'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TransactionForm } from './transaction-form'
import { Plus } from 'lucide-react'

export function NewTransactionButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Nova transação
      </Button>
      <TransactionForm open={open} onClose={() => setOpen(false)} />
    </>
  )
}

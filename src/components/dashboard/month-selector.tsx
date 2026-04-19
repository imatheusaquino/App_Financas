'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addMonths, subMonths, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface MonthSelectorProps {
  currentMonth: string
}

export function MonthSelector({ currentMonth }: MonthSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const date = parseISO(`${currentMonth}-01`)
  const label = format(date, 'MMMM yyyy', { locale: ptBR })

  function navigate(direction: 'prev' | 'next') {
    const newDate = direction === 'prev' ? subMonths(date, 1) : addMonths(date, 1)
    const newMonth = format(newDate, 'yyyy-MM')
    const params = new URLSearchParams(searchParams.toString())
    params.set('month', newMonth)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={() => navigate('prev')}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium capitalize min-w-32 text-center">{label}</span>
      <Button variant="outline" size="icon" onClick={() => navigate('next')}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

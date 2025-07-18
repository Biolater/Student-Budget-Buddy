// src/app/components/RecurringTransactions/TransactionCard.tsx
'use client'

import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Button,
} from '@heroui/react'
import {
  Calendar,
  Repeat,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash,
} from 'lucide-react'
import { FinancialEventClient } from '@/app/types/recurring-transactions.types'
import DeleteRecurringTransactionModal from './DeleteRecurringTransactionModal'

interface TransactionCardProps {
  transaction: FinancialEventClient
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
}) => {
  const {
    id,
    name,
    nextDueDate,
    frequency,
    interval,
    intervalUnit,
    amount,
    currency,
    type,
    description,
    isActive,
  } = transaction

  const [deleteOpen, setDeleteOpen] = useState(false)

  // Re-hydrate the ISO string into a real Date object
  const dateObj =
    nextDueDate instanceof Date ? nextDueDate : new Date(nextDueDate)

  // Format date into "July 21, 2025"
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Build the frequency label
  const frequencyLabel =
    frequency === 'CUSTOM' && interval && intervalUnit
      ? `Every ${interval} ${intervalUnit.toLowerCase()}${
          interval > 1 ? 's' : ''
        }`
      : frequency.charAt(0) + frequency.slice(1).toLowerCase()

  // Rows of icon + label
  const infoRows: { icon: React.ReactNode; label: string }[] = [
    { icon: <Calendar size={16} />, label: formattedDate },
    { icon: <Repeat size={16} />, label: frequencyLabel },
    {
      icon:
        type === 'INCOME' ? <TrendingUp size={16} /> : <TrendingDown size={16} />,
      label: `${currency.symbol}${amount.toFixed(2)}`,
    },
  ]

  return (
    <>
    <Card isHoverable>
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-lg font-semibold truncate">{name}</h3>
        <Chip
          color={isActive ? 'success' : 'default'}
          size="sm"
          variant="flat"
        >
          {isActive ? 'Active' : 'Inactive'}
        </Chip>
      </CardHeader>

      <CardBody className="space-y-3">
        {infoRows.map((row, i) => (
          <div
            key={i}
            className="flex items-center text-sm text-muted-foreground"
          >
            <span className="mr-2">{row.icon}</span>
            <span className="truncate">{row.label}</span>
          </div>
        ))}

        {description && (
          <p className="mt-2 text-xs text-muted-foreground truncate">
            {description}
          </p>
        )}
      </CardBody>

      <CardFooter className="flex justify-end space-x-2">
        <Button size="sm" variant="flat" startContent={<Edit size={14} />}>
          Edit
        </Button>
        <Button
          size="sm"
          variant="flat"
          color="danger"
          startContent={<Trash size={14} />}
          onPress={() => setDeleteOpen(true)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
    <DeleteRecurringTransactionModal
      isOpen={deleteOpen}
      onOpenChange={setDeleteOpen}
      transactionId={id}
    />
    </>
  )
}

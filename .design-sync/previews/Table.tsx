import * as React from 'react'
import { Table, Amount, Tag } from 'fmm-design-system'

export const Accounts = () => (
  <Table
    columns={[
      { key: 'name', header: 'Account' },
      { key: 'type', header: 'Type' },
      { key: 'balance', header: 'Balance', align: 'right' },
    ]}
    rows={[
      { name: 'Joint checking', type: <Tag variant="neutral">Cash</Tag>, balance: <Amount tone="positive">$8,420</Amount> },
      { name: 'Emergency savings', type: <Tag variant="neutral">Cash</Tag>, balance: <Amount tone="positive">$15,760</Amount> },
      { name: 'Brokerage', type: <Tag variant="neutral">Invest</Tag>, balance: <Amount tone="positive">$196,500</Amount> },
      { name: 'Mortgage', type: <Tag variant="accent-2">Debt</Tag>, balance: <Amount tone="negative">−$188,900</Amount> },
      { name: 'Auto loan', type: <Tag variant="accent-2">Debt</Tag>, balance: <Amount tone="negative">−$14,300</Amount> },
    ]}
  />
)

export const Transactions = () => (
  <Table
    columns={[
      { key: 'date', header: 'Date' },
      { key: 'desc', header: 'Description' },
      { key: 'amount', header: 'Amount', align: 'right' },
    ]}
    rows={[
      { date: 'Mar 1', desc: 'Paycheck', amount: <Amount tone="positive">+$5,400</Amount> },
      { date: 'Mar 2', desc: 'Mortgage', amount: <Amount tone="negative">−$2,180</Amount> },
      { date: 'Mar 4', desc: 'Groceries', amount: <Amount tone="negative">−$742</Amount> },
    ]}
  />
)

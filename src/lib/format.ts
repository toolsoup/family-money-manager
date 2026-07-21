const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount)
}

export function formatPercent(rate: number): string {
  return `${rate.toFixed(2)}%`
}

export function formatMonths(months: number): string {
  if (months === 0) return 'Debt free!'
  const years = Math.floor(months / 12)
  const remaining = months % 12
  if (years === 0) return `${remaining} mo`
  if (remaining === 0) return `${years} yr`
  return `${years} yr ${remaining} mo`
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

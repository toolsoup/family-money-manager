import * as React from 'react'

export interface SegmentOption {
  label: React.ReactNode
  value: string
}

export interface SegmentedControlProps {
  /** The segments, left to right. */
  options: SegmentOption[]
  /** Currently selected value. */
  value: string
  /** Called with the newly selected value. */
  onChange?: (value: string) => void
  /** Shared radio-group name; auto-generated when omitted. */
  name?: string
}

/**
 * Segmented toggle — a row of mutually exclusive options; the selected one fills
 * with the gold gradient. Used for small mode switches (e.g. account type,
 * time range).
 */
export function SegmentedControl({ options, value, onChange, name }: SegmentedControlProps) {
  const groupName = React.useId()
  return (
    <div className="seg" role="radiogroup">
      {options.map((opt) => (
        <label className="seg-opt" key={opt.value}>
          <input
            type="radio"
            name={name ?? groupName}
            value={opt.value}
            checked={opt.value === value}
            onChange={() => onChange?.(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  )
}

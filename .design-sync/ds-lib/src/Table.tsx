import * as React from 'react'

export interface TableColumn {
  /** Key into each row object. */
  key: string
  /** Column header text. */
  header: React.ReactNode
  /** Cell text alignment. */
  align?: 'left' | 'right'
}

export interface TableProps {
  /** Column definitions, left to right. */
  columns: TableColumn[]
  /** Row data — each object keyed by the columns' `key`. Values may be strings or nodes (e.g. an `Amount` or `Tag`). */
  rows: Array<Record<string, React.ReactNode>>
}

/**
 * Data table in the Midnight Gold style — uppercase muted headers, hairline row
 * dividers, subtle row hover. Right-align money columns via the column `align`.
 */
export function Table({ columns, rows }: TableProps) {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} style={c.align === 'right' ? { textAlign: 'right' } : undefined}>
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {columns.map((c) => (
              <td key={c.key} style={c.align === 'right' ? { textAlign: 'right' } : undefined}>
                {row[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

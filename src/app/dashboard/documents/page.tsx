import { getDocuments } from '@/lib/queries'
import { formatFileSize } from '@/lib/format'
import { DocumentList } from '@/components/document-list'

export default async function DocumentsPage() {
  const documents = await getDocuments()

  const totalCount = documents.length
  const totalSize = documents.reduce((sum, d) => sum + d.file_size, 0)
  const categoryCount = new Set(documents.map((d) => d.category)).size

  const stats = [
    { label: 'Total Documents', value: String(totalCount) },
    { label: 'Categories Used', value: String(categoryCount) },
    { label: 'Total Storage', value: formatFileSize(totalSize) },
  ]

  return (
    <div
      className="sheet"
      style={{
        maxWidth: '1180px',
        margin: '0 auto',
        padding: 'var(--space-6) var(--space-8) var(--space-8)',
      }}
    >
      <h1 style={{ margin: '0 0 var(--space-2)' }}>Documents</h1>
      <p className="text-muted" style={{ marginBottom: 'var(--space-8)' }}>
        Store and organize your financial documents.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 'var(--space-6)',
          alignItems: 'start',
        }}
      >
        {stats.map((s) => (
          <div key={s.label}>
            <h6 className="text-muted" style={{ margin: '0 0 var(--space-2)' }}>{s.label}</h6>
            <p
              className="tnum"
              style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '28px' }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-8)' }}>
        <DocumentList documents={documents} />
      </div>
    </div>
  )
}

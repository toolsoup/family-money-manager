'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { deleteDocument, getSignedUrl } from '@/app/dashboard/documents/actions'
import { DocumentFormDialog } from '@/components/document-form-dialog'
import { formatFileSize } from '@/lib/format'
import type { Document, DocumentCategory } from '@/lib/types'

interface Props {
  documents: Document[]
}

export function DocumentList({ documents }: Props) {
  const [editingDoc, setEditingDoc] = useState<Document | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | 'All'>('All')
  const [viewingId, setViewingId] = useState<string | null>(null)

  const activeCategories = Array.from(new Set(documents.map((d) => d.category)))
  const filtered = categoryFilter === 'All'
    ? documents
    : documents.filter((d) => d.category === categoryFilter)

  function handleDelete(doc: Document) {
    if (!confirm('Delete this document and its file?')) return
    setDeletingId(doc.id)
    startTransition(async () => {
      const result = await deleteDocument(doc.id, doc.file_path)
      if (result.success) {
        toast.success('Document deleted')
      } else {
        toast.error(result.error ?? 'Failed to delete document')
      }
      setDeletingId(null)
    })
  }

  async function handleView(doc: Document) {
    setViewingId(doc.id)
    const { url, error } = await getSignedUrl(doc.file_path)
    setViewingId(null)
    if (url) {
      window.open(url, '_blank')
    } else {
      toast.error(error ?? 'Could not generate link')
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const filterPill = (value: DocumentCategory | 'All', label: string) => (
    <button
      key={value}
      onClick={() => setCategoryFilter(value)}
      className={`tag ${categoryFilter === value ? 'tag-accent' : 'tag-neutral'}`}
      style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}
    >
      {label}
    </button>
  )

  return (
    <section>
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-4)' }}>
        <h3 style={{ margin: 0 }}>Your Documents</h3>
        <button onClick={() => setShowAdd(true)} className="btn btn-primary">
          + Upload
        </button>
      </div>

      {activeCategories.length > 0 && (
        <div className="flex flex-wrap gap-2" style={{ marginBottom: 'var(--space-4)' }}>
          {filterPill('All', 'All')}
          {activeCategories.map((cat) => filterPill(cat, cat))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-muted">
          {documents.length === 0
            ? 'No documents yet. Click + Upload to get started.'
            : 'No documents in this category.'}
        </p>
      ) : (
        <div className="flex flex-col" style={{ gap: 'var(--space-2)' }}>
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="card"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: deletingId === doc.id ? 0.5 : 1,
              }}
            >
              <div className="flex-1 min-w-0">
                <p className="truncate" style={{ margin: '0 0 6px', fontWeight: 600 }}>{doc.name}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="tag tag-neutral">{doc.category}</span>
                  <span className="text-muted tnum" style={{ fontSize: '11px' }}>
                    {formatFileSize(doc.file_size)}
                  </span>
                  <span className="text-muted tnum" style={{ fontSize: '11px' }}>
                    {formatDate(doc.uploaded_at)}
                  </span>
                  {doc.tags?.map((tag) => (
                    <span key={tag} className="tag tag-accent">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-1 ml-4">
                <button
                  onClick={() => handleView(doc)}
                  disabled={viewingId === doc.id}
                  className="btn btn-ghost"
                >
                  {viewingId === doc.id ? 'Opening...' : 'View'}
                </button>
                <button
                  onClick={() => setEditingDoc(doc)}
                  className="btn btn-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(doc)}
                  disabled={isPending}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DocumentFormDialog
        open={showAdd}
        onClose={() => setShowAdd(false)}
      />
      <DocumentFormDialog
        key={editingDoc?.id}
        document={editingDoc}
        open={!!editingDoc}
        onClose={() => setEditingDoc(null)}
      />
    </section>
  )
}

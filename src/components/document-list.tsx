'use client'

import { useState, useTransition } from 'react'
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
      await deleteDocument(doc.id, doc.file_path)
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
      alert(error ?? 'Could not generate link')
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl">
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">Your Documents</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          + Upload
        </button>
      </div>

      {activeCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 px-6 py-3 border-b border-gray-800">
          <button
            onClick={() => setCategoryFilter('All')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              categoryFilter === 'All'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {activeCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="p-6 text-gray-500 text-sm">
          {documents.length === 0
            ? 'No documents yet. Click + Upload to get started.'
            : 'No documents in this category.'}
        </p>
      ) : (
        <div className="divide-y divide-gray-800">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className={`flex items-center justify-between p-4 px-6 ${
                deletingId === doc.id ? 'opacity-50' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{doc.name}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-gray-400 text-xs bg-gray-800 px-2 py-0.5 rounded">
                    {doc.category}
                  </span>
                  <span className="text-gray-600 text-xs">
                    {formatFileSize(doc.file_size)}
                  </span>
                  <span className="text-gray-600 text-xs">
                    {formatDate(doc.uploaded_at)}
                  </span>
                  {doc.tags?.map((tag) => (
                    <span key={tag} className="text-blue-400 text-xs bg-blue-400/10 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-1 ml-4">
                <button
                  onClick={() => handleView(doc)}
                  disabled={viewingId === doc.id}
                  className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 rounded hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {viewingId === doc.id ? 'Opening...' : 'View'}
                </button>
                <button
                  onClick={() => setEditingDoc(doc)}
                  className="text-gray-500 hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(doc)}
                  disabled={isPending}
                  className="text-gray-500 hover:text-red-400 text-xs px-2 py-1 rounded hover:bg-gray-800 transition-colors cursor-pointer"
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
    </div>
  )
}

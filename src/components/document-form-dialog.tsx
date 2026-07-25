'use client'

import { useRef, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { createDocument, updateDocument } from '@/app/dashboard/documents/actions'
import { DOCUMENT_CATEGORY_GROUPS } from '@/lib/types'
import type { Document } from '@/lib/types'

interface Props {
  document?: Document | null
  open: boolean
  onClose: () => void
}

export function DocumentFormDialog({ document: doc, open, onClose }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (open) setError(null)
  }, [open, doc])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    try {
      if (doc) {
        // Edit mode — metadata only
        const formData = new FormData(e.currentTarget)
        const result = await updateDocument(formData)
        setIsPending(false)
        if (result.success) {
          toast.success('Document updated')
          formRef.current?.reset()
          onClose()
        } else {
          setError(result.error ?? 'Something went wrong')
        }
      } else {
        // Create mode — upload file first, then insert metadata
        const form = e.currentTarget
        const fileInput = form.querySelector<HTMLInputElement>('input[type="file"]')
        const file = fileInput?.files?.[0]
        if (!file) {
          setError('Please select a file')
          setIsPending(false)
          return
        }

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setError('Not authenticated')
          setIsPending(false)
          return
        }

        const docId = crypto.randomUUID()
        const filePath = `${user.id}/${docId}/${file.name}`

        // Upload to Storage
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file)

        if (uploadError) {
          setError(uploadError.message)
          setIsPending(false)
          return
        }

        // Insert metadata via server action
        const formData = new FormData()
        formData.set('id', docId)
        formData.set('name', (form.querySelector<HTMLInputElement>('[name="name"]')?.value ?? ''))
        formData.set('category', (form.querySelector<HTMLSelectElement>('[name="category"]')?.value ?? ''))
        formData.set('notes', (form.querySelector<HTMLTextAreaElement>('[name="notes"]')?.value ?? ''))
        formData.set('tags', (form.querySelector<HTMLInputElement>('[name="tags"]')?.value ?? ''))
        formData.set('file_name', file.name)
        formData.set('file_path', filePath)
        formData.set('file_size', String(file.size))
        formData.set('file_type', file.type || 'application/octet-stream')

        const result = await createDocument(formData)
        setIsPending(false)

        if (result.success) {
          toast.success('Document uploaded')
          formRef.current?.reset()
          onClose()
        } else {
          // Attempt cleanup of uploaded file
          await supabase.storage.from('documents').remove([filePath])
          setError(result.error ?? 'Something went wrong')
        }
      }
    } catch (err) {
      setIsPending(false)
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  const isEditing = !!doc

  if (!open) return null

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h2 className="dialog-title">
          {isEditing ? 'Edit Document' : 'Upload Document'}
        </h2>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
          {doc && <input type="hidden" name="id" value={doc.id} />}

          {error && (
            <p style={{ margin: 0, color: 'var(--color-accent-2-700)', fontSize: '14px' }}>{error}</p>
          )}

          {!isEditing && (
            <div className="field">
              <label htmlFor="doc-file">File</label>
              <input
                id="doc-file"
                type="file"
                required
                accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx,.csv,.txt"
                className="input"
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="doc-name">Name</label>
            <input
              id="doc-name"
              name="name"
              type="text"
              required
              defaultValue={doc?.name ?? ''}
              className="input"
              placeholder="e.g. 2025 Tax Return"
            />
          </div>

          <div className="field">
            <label htmlFor="doc-category">Category</label>
            <select
              id="doc-category"
              name="category"
              defaultValue={doc?.category ?? 'Other'}
              className="select"
            >
              {Object.entries(DOCUMENT_CATEGORY_GROUPS).map(([group, categories]) => (
                <optgroup key={group} label={group}>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="doc-tags">Tags (optional, comma-separated)</label>
            <input
              id="doc-tags"
              name="tags"
              type="text"
              defaultValue={doc?.tags?.join(', ') ?? ''}
              className="input"
              placeholder="e.g. 2025, federal, personal"
            />
          </div>

          <div className="field">
            <label htmlFor="doc-notes">Notes (optional)</label>
            <textarea
              id="doc-notes"
              name="notes"
              rows={2}
              defaultValue={doc?.notes ?? ''}
              className="input"
            />
          </div>

          <div className="dialog-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary"
            >
              {isPending ? (isEditing ? 'Saving...' : 'Uploading...') : isEditing ? 'Save Changes' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

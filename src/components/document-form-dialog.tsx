'use client'

import { useRef, useEffect, useState } from 'react'
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
  const dialogRef = useRef<HTMLDialogElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      setError(null)
      dialog.showModal()
    } else {
      dialog.close()
    }
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

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="bg-gray-900 border border-gray-700 rounded-xl p-0 w-full max-w-md backdrop:bg-black/60"
    >
      <form ref={formRef} onSubmit={handleSubmit} className="p-6">
        <h2 className="text-xl font-bold text-white mb-6">
          {isEditing ? 'Edit Document' : 'Upload Document'}
        </h2>

        {doc && <input type="hidden" name="id" value={doc.id} />}

        {error && (
          <p className="text-red-400 text-sm mb-4 bg-red-400/10 p-3 rounded-lg">{error}</p>
        )}

        <div className="space-y-4">
          {!isEditing && (
            <div>
              <label htmlFor="doc-file" className="block text-sm text-gray-400 mb-1">File</label>
              <input
                id="doc-file"
                type="file"
                required
                accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx,.csv,.txt"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 file:mr-3 file:bg-gray-700 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:text-sm file:cursor-pointer"
              />
            </div>
          )}

          <div>
            <label htmlFor="doc-name" className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              id="doc-name"
              name="name"
              type="text"
              required
              defaultValue={doc?.name ?? ''}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="e.g. 2025 Tax Return"
            />
          </div>

          <div>
            <label htmlFor="doc-category" className="block text-sm text-gray-400 mb-1">Category</label>
            <select
              id="doc-category"
              name="category"
              defaultValue={doc?.category ?? 'Other'}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
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

          <div>
            <label htmlFor="doc-tags" className="block text-sm text-gray-400 mb-1">Tags (optional, comma-separated)</label>
            <input
              id="doc-tags"
              name="tags"
              type="text"
              defaultValue={doc?.tags?.join(', ') ?? ''}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="e.g. 2025, federal, personal"
            />
          </div>

          <div>
            <label htmlFor="doc-notes" className="block text-sm text-gray-400 mb-1">Notes (optional)</label>
            <textarea
              id="doc-notes"
              name="notes"
              rows={2}
              defaultValue={doc?.notes ?? ''}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
          >
            {isPending ? (isEditing ? 'Saving...' : 'Uploading...') : isEditing ? 'Save Changes' : 'Upload'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  )
}

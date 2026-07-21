'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function revalidateAll() {
  revalidatePath('/dashboard/documents')
  revalidatePath('/dashboard')
}

function parseTags(raw: string | null): string[] | null {
  if (!raw || !raw.trim()) return null
  return raw.split(',').map((t) => t.trim()).filter(Boolean)
}

// Called after the client has already uploaded the file to Supabase Storage
export async function createDocument(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase.from('documents').insert({
    id: formData.get('id') as string,
    user_id: user.id,
    name: formData.get('name') as string,
    category: formData.get('category') as string,
    file_name: formData.get('file_name') as string,
    file_path: formData.get('file_path') as string,
    file_size: parseInt(formData.get('file_size') as string, 10),
    file_type: formData.get('file_type') as string,
    notes: (formData.get('notes') as string) || null,
    tags: parseTags(formData.get('tags') as string),
  })

  if (error) return { success: false, error: error.message }
  revalidateAll()
  return { success: true }
}

// Only updates metadata — the file itself doesn't change
export async function updateDocument(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('documents')
    .update({
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      notes: (formData.get('notes') as string) || null,
      tags: parseTags(formData.get('tags') as string),
    })
    .eq('id', formData.get('id') as string)

  if (error) return { success: false, error: error.message }
  revalidateAll()
  return { success: true }
}

// Deletes the Storage file first, then the metadata row
export async function deleteDocument(id: string, filePath: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error: storageError } = await supabase.storage
    .from('documents')
    .remove([filePath])

  if (storageError) {
    console.error('Error deleting file from storage:', storageError)
  }

  const { error } = await supabase.from('documents').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidateAll()
  return { success: true }
}

export async function getSignedUrl(filePath: string): Promise<{ url: string | null; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { url: null, error: 'Not authenticated' }

  const { data, error } = await supabase.storage
    .from('documents')
    .createSignedUrl(filePath, 60)

  if (error) return { url: null, error: error.message }
  return { url: data.signedUrl }
}

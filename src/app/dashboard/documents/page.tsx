import { getDocuments } from '@/lib/queries'
import { formatFileSize } from '@/lib/format'
import { DocumentList } from '@/components/document-list'

export default async function DocumentsPage() {
  const documents = await getDocuments()

  const totalCount = documents.length
  const totalSize = documents.reduce((sum, d) => sum + d.file_size, 0)
  const categoryCount = new Set(documents.map((d) => d.category)).size

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Documents</h1>
      <p className="text-gray-400 mb-8">Store and organize your financial documents.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Total Documents</p>
          <p className="text-2xl font-bold text-white">{totalCount}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Categories Used</p>
          <p className="text-2xl font-bold text-white">{categoryCount}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Total Storage</p>
          <p className="text-2xl font-bold text-white">{formatFileSize(totalSize)}</p>
        </div>
      </div>

      <DocumentList documents={documents} />
    </div>
  )
}

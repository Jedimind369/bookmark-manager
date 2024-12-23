import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addBookmark } from '../store/bookmarksSlice'
import { RootState } from '../store'
import { analyzeContent } from '../services/ai'
import type { BookmarkFormData } from '../types'

export function AddBookmark() {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const [isOpen, setIsOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [formData, setFormData] = useState<BookmarkFormData>({
    url: '',
    title: '',
    description: '',
    tags: []
  })

  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setFormData({...formData, url})
    
    if (url) {
      setIsAnalyzing(true)
      try {
        const analysis = await analyzeContent(url)
        setFormData(prev => ({
          ...prev,
          title: prev.title || url,
          description: analysis.summary || '',
          tags: analysis.suggestedTags || []
        }))
      } catch (error) {
        console.error('Failed to analyze URL:', error)
      } finally {
        setIsAnalyzing(false)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      dispatch(addBookmark({ 
        bookmark: {
          ...formData,
          collections: [],
          analysis: {
            summary: formData.description || '',
            keyInsights: [],
            credibilityScore: 0,
            readingTime: 0
          }
        }, 
        userId: user.id 
      }))
      setFormData({ url: '', title: '', description: '', tags: [] })
      setIsOpen(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add Bookmark
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Bookmark</h2>
            
            <div className="space-y-4">
              <div>
                <input
                  type="url"
                  placeholder="URL"
                  required
                  value={formData.url}
                  onChange={handleUrlChange}
                  className="w-full px-3 py-2 border rounded"
                  disabled={isAnalyzing}
                />
                {isAnalyzing && (
                  <p className="text-sm text-gray-500 mt-1">Analyzing content...</p>
                )}
              </div>
              
              <input
                type="text"
                placeholder="Title"
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
              
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
              
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={formData.tags.join(', ')}
                onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(tag => tag.trim())})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
} 
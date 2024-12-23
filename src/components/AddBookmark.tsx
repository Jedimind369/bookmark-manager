import { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addBookmark } from '../store/bookmarksSlice'
import { RootState, AppDispatch } from '../store'
import { analyzeContent } from '../services/ai'
import type { BookmarkFormData } from '../types'

interface FormState extends BookmarkFormData {
  collections: string[]
}

export function AddBookmark() {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const [isOpen, setIsOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [formData, setFormData] = useState<FormState>({
    url: '',
    title: '',
    description: '',
    tags: [],
    collections: []
  })

  const handleUrlChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setFormData(prev => ({ ...prev, url }))
    
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
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (user?.uid) {
      await dispatch(addBookmark({ 
        bookmark: formData,
        userId: user.uid 
      }))
      setFormData({ url: '', title: '', description: '', tags: [], collections: [] })
      setIsOpen(false)
    }
  }

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleTagsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
    setFormData(prev => ({ ...prev, tags }))
  }, [])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add Bookmark
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Add New Bookmark</h2>
            
            <div className="space-y-4">
              <div>
                <input
                  type="url"
                  name="url"
                  placeholder="URL"
                  required
                  value={formData.url}
                  onChange={handleUrlChange}
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled={isAnalyzing}
                />
                {isAnalyzing && (
                  <p className="text-sm text-gray-500 mt-1">Analyzing content...</p>
                )}
              </div>
              
              <input
                type="text"
                name="title"
                placeholder="Title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              
              <input
                type="text"
                name="tags"
                placeholder="Tags (comma separated)"
                value={formData.tags.join(', ')}
                onChange={handleTagsChange}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
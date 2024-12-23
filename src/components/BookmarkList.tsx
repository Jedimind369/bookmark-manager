import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../store'
import { fetchBookmarks, deleteBookmark, setSortBy, toggleTag } from '../store/bookmarksSlice'
import type { Bookmark } from '../types'

export function BookmarkList() {
  const dispatch = useDispatch<AppDispatch>()
  const { filteredItems, loading, error, searchQuery, sortBy, selectedTags } = useSelector((state: RootState) => state.bookmarks)
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchBookmarks(user.id))
    }
  }, [dispatch, user])

  const handleSort = (value: 'date' | 'title' | 'credibility'): void => {
    dispatch(setSortBy(value))
  }

  const handleDelete = async (id: string): Promise<void> => {
    await dispatch(deleteBookmark(id))
  }

  const allTags = [...new Set(filteredItems.flatMap(b => b.tags))].sort()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        <h3 className="font-bold">Error loading bookmarks</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (filteredItems.length === 0 && searchQuery) {
    return (
      <div className="text-center p-8">
        No bookmarks found matching "{searchQuery}"
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="flex gap-2">
          {(['date', 'title', 'credibility'] as const).map(option => (
            <button
              key={option}
              onClick={() => handleSort(option)}
              className={`px-3 py-1 rounded ${
                sortBy === option 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => dispatch(toggleTag(tag))}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTags.includes(tag)
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((bookmark: Bookmark) => (
          <div key={bookmark.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <h3 className="font-bold">{bookmark.title}</h3>
              <button 
                onClick={() => handleDelete(bookmark.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
            
            <a 
              href={bookmark.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline block mt-1"
            >
              {bookmark.url}
            </a>

            {bookmark.analysis?.summary && (
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {bookmark.analysis.summary}
              </p>
            )}

            <div className="flex gap-2 mt-2">
              {bookmark.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>

            {bookmark.analysis?.credibilityScore > 0 && (
              <div className="mt-2 text-sm text-gray-500">
                Credibility: {bookmark.analysis.credibilityScore}%
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
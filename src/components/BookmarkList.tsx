import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { fetchBookmarks, deleteBookmark } from '../store/bookmarksSlice'

export function BookmarkList() {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector((state: RootState) => state.bookmarks)
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (user) {
      dispatch(fetchBookmarks(user.id))
    }
  }, [dispatch, user])

  if (loading) return <div>Loading bookmarks...</div>
  if (error) return <div>Error: {error}</div>
  if (items.length === 0) return <div>No bookmarks found</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(bookmark => (
        <div key={bookmark.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <h3 className="font-bold">{bookmark.title}</h3>
            <button 
              onClick={() => dispatch(deleteBookmark(bookmark.id))}
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
          <p className="text-gray-600 dark:text-gray-300 mt-2">{bookmark.description}</p>
          <div className="flex gap-2 mt-2">
            {bookmark.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
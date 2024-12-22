import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { searchBookmarks } from '../store/bookmarksSlice'
import { AddBookmark } from './AddBookmark'

export function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const dispatch = useDispatch()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    dispatch(searchBookmarks(query))
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Bookmark Manager</h1>
        <div className="flex gap-4">
          <input
            type="search"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={handleSearch}
            className="px-4 py-2 rounded-lg border"
          />
          <AddBookmark />
        </div>
      </div>
    </header>
  )
} 
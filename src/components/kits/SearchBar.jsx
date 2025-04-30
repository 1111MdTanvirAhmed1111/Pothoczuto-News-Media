'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { SearchIcon } from 'lucide-react'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState('')

  useEffect(() => {
    const q = searchParams.get('q') || ''
    setQuery(q)
  }, [searchParams])

  const handleSearch = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (query.trim()) {
      params.set('q', query.trim())
    } else {
      params.delete('q')
    }
    router.push(`/search?${params.toString()}`)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch()
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-4 pr-10 py-2 rounded-xl bg-background border border-input transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
      />
      <Button
        type="button"
        onClick={handleSearch}
        size="icon"
        variant="ghost"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-accent hover:text-accent-foreground transition-colors bg-green-400 text-white"
      >
        <SearchIcon className="h-4 w-4 text-muted-foreground" />
      </Button>
    </form>
  )
}

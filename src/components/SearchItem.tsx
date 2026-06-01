import React from 'react'

interface SearchItemProps {
  setSearch: any
}

function SearchItem({ setSearch }: SearchItemProps) {
  return (
    <form className='searchForm' onSubmit={(e) => e.preventDefault()}>
      <label htmlFor='search'> Search</label>
      <input
        id='search'
        type='text'
        role='searchbox'
        placeholder='search Item'
        onChange={(event: any) => setSearch(event.target.value)}
      />

    </form>
  )
}

export default SearchItem


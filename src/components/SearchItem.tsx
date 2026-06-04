import React from "react";

interface SearchItemProps {
  search: String;
  setSearch: any;
}

function SearchItem({ setSearch }: SearchItemProps) {
  return (
    <form className="searchForm" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="search"> </label>
      <input
        id="search"
        type="text"
        role="searchbox"
        placeholder="search Item"
        //onChange={(event: any) => setSearch(event.target.value)}
        onChangeCapture={(e) => setSearch(e.target.value)}
      />
    </form>
  );
}

export default SearchItem;

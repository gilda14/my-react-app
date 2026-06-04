type SearchItemProps = {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export default function SearchItem({ setSearch }: SearchItemProps) {
  return (
    <input
      type="text"
      placeholder="Search"
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

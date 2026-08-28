import React from 'react';
import { TbSearch } from 'react-icons/tb';

export const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Enter engine number...',
  loading = false,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (onSearch) onSearch();
      }}
      style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <TbSearch
          size={18}
          color="var(--slate-400)"
          style={{ position: 'absolute', left: '12px' }}
        />
        <input
          type="text"
          className="dcs-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{ paddingLeft: '38px', minWidth: '240px' }}
        />
      </div>
      {onSearch && (
        <button
          type="submit"
          className="dcs-btn dcs-btn-primary"
          disabled={loading}
        >
          <TbSearch size={16} />
          {loading ? 'Searching...' : 'Search'}
        </button>
      )}
    </form>
  );
};

export default SearchBar;

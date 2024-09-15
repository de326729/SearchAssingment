import { useEffect, useRef } from 'react';
import './style.css';

const SearchBox = ({value, onChange , onKeyPress}) => {
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeydown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        searchInputRef.current.focus();
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  return (
    <div className="search-box">
      <input
        type="text"
        ref={searchInputRef}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        className="search-input"
        placeholder="Search Places..."
      />
      <span className="keyboard-shortcut">Ctrl + /</span>
    </div>
  );
};

export default SearchBox;

import React, { useState, useRef } from "react";
import { Input } from "antd";

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [value, setValue] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      onSearch(newValue.trim());
    }, 300);
  };

  const handleSearch = () => {
    onSearch(value.trim());
  };

  return (
    <Input.Search
      placeholder="搜索文章..."
      value={value}
      onChange={handleChange}
      onSearch={handleSearch}
      allowClear
      style={{ width: 300 }}
      enterButton
    />
  );
};

export default SearchBar; 
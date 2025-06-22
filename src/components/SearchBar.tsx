import React, { useState } from "react";
import { Input } from "antd";

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [value, setValue] = useState("");

  const handleSearch = (searchVal: string) => {
    onSearch(searchVal.trim());
  };

  return (
    <Input.Search
      placeholder="请输入关键词搜索文章"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onSearch={handleSearch}
      allowClear
      style={{ width: 400 }}
      enterButton
    />
  );
};

export default SearchBar; 
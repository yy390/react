import React, { createContext, useState, useContext, useMemo } from "react";

interface SearchContextType {
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchKeyword, setSearchKeyword] = useState("");

  const value = useMemo(() => ({
    searchKeyword,
    setSearchKeyword
  }), [searchKeyword]);

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch必须在SearchProvider内使用");
  }
  return context;
}; 
import React, { createContext, useState, useContext } from "react";

interface SearchContextType {
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <SearchContext.Provider value={{ searchKeyword, setSearchKeyword }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}; 
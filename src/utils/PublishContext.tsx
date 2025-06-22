import React, { createContext, useState, useContext } from "react";

interface PublishContextType {
  isPublishOpen: boolean;
  setIsPublishOpen: (isOpen: boolean) => void;
}

const PublishContext = createContext<PublishContextType | undefined>(undefined);

export const PublishProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPublishOpen, setIsPublishOpen] = useState(false);

  return (
    <PublishContext.Provider value={{ isPublishOpen, setIsPublishOpen }}>
      {children}
    </PublishContext.Provider>
  );
};

export const usePublish = () => {
  const context = useContext(PublishContext);
  if (!context) {
    throw new Error("usePublish must be used within a PublishProvider");
  }
  return context;
}; 
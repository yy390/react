import React, { createContext, useState, useContext, useMemo } from "react";

interface PublishContextType {
  isPublishOpen: boolean;
  setIsPublishOpen: (isOpen: boolean) => void;
}

const PublishContext = createContext<PublishContextType | undefined>(undefined);

export const PublishProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPublishOpen, setIsPublishOpen] = useState(false);

  const value = useMemo(() => ({
    isPublishOpen,
    setIsPublishOpen
  }), [isPublishOpen]);

  return (
    <PublishContext.Provider value={value}>
      {children}
    </PublishContext.Provider>
  );
};

export const usePublish = () => {
  const context = useContext(PublishContext);
  if (!context) {
    throw new Error("usePublish必须在PublishProvider内使用");
  }
  return context;
}; 
import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { SearchProvider } from "./utils/SearchContext";
import { PublishProvider } from "./utils/PublishContext";
import { UserProvider } from "./utils/UserContext";
import { ArticleProvider } from "./utils/ArticleContext";
import { CommentProvider } from "./utils/CommentContext";

function App() {
  return (
    <UserProvider>
      <SearchProvider>
        <PublishProvider>
          <ArticleProvider>
            <CommentProvider>
              <RouterProvider router={router} />
            </CommentProvider>
          </ArticleProvider>
        </PublishProvider>
      </SearchProvider>
    </UserProvider>
  );
}

export default App;

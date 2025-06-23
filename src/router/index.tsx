import { createBrowserRouter, RouteObject } from "react-router-dom";
import Layout from "../layout";
import HomePage from "../pages//HomePage";
import Article from "../pages/Article";
import MyArticles from "../pages/MyArticles";
import EditArticle from "../pages/EditArticle";
import AuthorArticles from "../pages/AuthorArticles";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/article/:id",
        element: <Article />,
      },
      {
        path: "/my-articles",
        element: <MyArticles />,
      },
      {
        path: "/edit/:id",
        element: <EditArticle />,
      },
      {
        path: "/author/:authorName",
        element: <AuthorArticles />,
      }
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;

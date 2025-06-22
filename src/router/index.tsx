import { createBrowserRouter, RouteObject } from "react-router-dom";
/**
 * TODO: 路由配置
 */
import Layout from "../layout";
// 首页
import HomePage from "../pages//HomePage";
// 文章详情页
import Article from "../pages/Article";
// 我的文章页面
import MyArticles from "../pages/MyArticles";
// 编辑文章页面
import EditArticle from "../pages/EditArticle";
import AuthorArticles from "../pages/AuthorArticles";
import { UserProvider } from '../utils/UserContext';
import { PublishProvider } from '../utils/PublishContext';
import { ArticleProvider } from '../utils/ArticleContext';

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

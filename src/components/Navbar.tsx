import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, Button, Avatar, Dropdown } from "antd";
import SearchBar from "./SearchBar";
import { useUser } from "../utils/UserContext";
import { usePublish } from "../utils/PublishContext";
import LoginModal from "./LoginModal";
import "./Navbar.css";

interface NavbarProps {
  onSearch: (value: string) => void;
}

const navItems = [
  { key: "/", label: "首页" },
  { key: "/article/1", label: "文章" },
];

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { setIsPublishOpen } = usePublish();
  const [loginOpen, setLoginOpen] = useState(false);

  const handlePublishClick = () => {
    if (user.isLogin) {
      setIsPublishOpen(true);
    } else {
      setLoginOpen(true);
    }
  };

  return (
    <div className="navbar-container">
      <div className="navbar-left">
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          className="navbar-menu"
          theme="dark"
        >
          {navItems.map((item) => (
            <Menu.Item key={item.key}>
              <NavLink to={item.key} className="nav-link">
                {item.label}
              </NavLink>
            </Menu.Item>
          ))}
        </Menu>
      </div>
      <div className="navbar-right">
        <SearchBar onSearch={onSearch} />
        <Button type="primary" onClick={handlePublishClick}>发布</Button>
        {user.isLogin ? (
          <Dropdown
            menu={{
              items: [
                { key: "my-articles", label: "我的文章", onClick: () => navigate("/my-articles") },
                { key: "logout", label: "退出登录", onClick: logout }
              ]
            }}
          >
            <span className="user-info">
              <Avatar size={32} className="user-avatar" />
              {user.name}
            </span>
          </Dropdown>
        ) : (
          <Button onClick={() => setLoginOpen(true)}>登录/注册</Button>
        )}
      </div>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
};

export default Navbar; 
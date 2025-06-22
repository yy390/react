import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, Button, Avatar, Dropdown } from "antd";
import SearchBar from "./SearchBar";
import { useUser } from "../utils/UserContext";
import { usePublish } from "../utils/PublishContext";
import LoginModal from "./LoginModal";
interface NavbarProps {
  onSearch: (value: string) => void;
}
const navItems = [
  { key: "/", label: "首页" },
  { key: "/article/1", label: "文章" },
  // { key: "/qna", label: "问答" },
  // 可根据需要添加更多导航项
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
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ background: "#000", color: "#fff", borderBottom: 'none' }}
          theme="dark"
        >
          {navItems.map((item) => (
            <Menu.Item key={item.key}>
              <NavLink to={item.key} style={{ color: "inherit" }}>
                {item.label}
              </NavLink>
            </Menu.Item>
          ))}
        </Menu>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
            <span style={{ cursor: "pointer", display: "flex", alignItems: "center", color: "#fff" }}>
              <Avatar src={user.avatar} size={32} style={{ marginRight: 8 }} />
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
import React, { useState } from "react";
import { Modal, Tabs, Form, Input, Button, message } from "antd";
import { useUser } from "../utils/UserContext";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const { login, register } = useUser();
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      let success = false;
      if (tab === "login") {
        success = await login(values.username, values.password);
        if (success) {
          message.success("登录成功");
          onClose();
        } else {
          message.error("用户名或密码错误");
        }
      } else {
        success = await register(values.username, values.password);
        if (success) {
          message.success("注册成功，已自动登录");
          onClose();
        } else {
          message.error("用户名已存在，请选择其他用户名");
        }
      }
    } catch (error) {
      message.error("操作失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title={tab === "login" ? "登录" : "注册"}>
      <Tabs
        activeKey={tab}
        onChange={setTab}
        items={[
          { key: "login", label: "登录" },
          { key: "register", label: "注册" }
        ]}
        style={{ marginBottom: 24 }}
      />
      <Form onFinish={onFinish} autoComplete="off">
        <Form.Item name="username" rules={[{ required: true, message: "请输入用户名" }]}> 
          <Input placeholder="用户名" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}> 
          <Input.Password placeholder="密码" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {tab === "login" ? "登录" : "注册"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginModal; 
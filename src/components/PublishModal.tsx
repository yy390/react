import React, { useState } from "react";
import { Modal, Form, Input, Button, Select, message, Switch } from "antd";
import { useUser } from "../utils/UserContext";
import { TECH_TAGS } from '../utils/constants';

const { Option } = Select;
const { TextArea } = Input;

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  onPublish?: (article: any) => void;
}

const PublishModal: React.FC<PublishModalProps> = ({ open, onClose, onPublish }) => {
  const { user } = useUser();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    if (!user.isLogin) {
      message.error("请先登录再发布！");
      onClose();
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newArticle = {
        id: Date.now(),
        title: values.title,
        desc: values.desc,
        content: values.content,
        author: user.name,
        publishTime: new Date().toISOString().slice(0, 10),
        image: null, // 不设置图片
        views: 0,
        tags: values.tags || [],
        isPublic: values.isPublic ?? true
      };
      onPublish?.(newArticle);
      message.success("发布成功！");
      onClose();
      form.resetFields(); // 清空表单
    }, 1000);
  };

  if (!user.isLogin) {
    message.error("请先登录！");
    return null;
  }

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="发布文章">
      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item name="title" label="文章标题" rules={[{ required: true, message: '请输入标题' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="desc" label="文章摘要" rules={[{ required: true, message: '请输入摘要' }]}>
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name="content" label="文章内容" rules={[{ required: true, message: '请输入文章内容' }]}>
          <TextArea rows={8} placeholder="请输入文章详细内容..." />
        </Form.Item>
        <Form.Item name="tags" label="技术标签" rules={[{ required: true, message: '请选择至少一个标签' }]}>
          <Select mode="multiple" placeholder="请选择技术标签">
            {TECH_TAGS.map(tag => <Select.Option key={tag} value={tag}>{tag}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="isPublic" label="公开状态" valuePropName="checked">
          <Switch 
            checkedChildren="公开" 
            unCheckedChildren="私密"
            defaultChecked={true}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            发布
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PublishModal; 
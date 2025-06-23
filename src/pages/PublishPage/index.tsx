import React, { useState } from "react";
import { Form, Input, Button, message, Switch, Select, Card, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../utils/UserContext";
import { useArticles } from "../../utils/ArticleContext";
import { TECH_TAGS } from '../../utils/constants';

const { TextArea } = Input;
const { Option } = Select;

const PublishPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { addArticle } = useArticles();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  if (!user.isLogin) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        请先 <Button type="link" onClick={() => navigate('/')}>登录</Button> 后再发布文章
      </div>
    );
  }

  const handleSubmit = (values: any) => {
    if (!user.name) {
      message.error("用户信息异常，无法发布文章");
      return;
    }
    setLoading(true);

    const newArticle = {
      id: Date.now(),
      title: values.title,
      desc: values.desc,
      content: values.content,
      author: user.name,
      publishTime: new Date().toISOString().slice(0, 10),
      image: null,
      views: 0,
      tags: values.tags ?? [],
      isPublic: values.isPublic ?? true,
      likes: 0,
      comments: []
    };

    try {
      addArticle(newArticle);
      message.success("文章发布成功！");
      navigate(`/article/${newArticle.id}`);
    } catch (error) {
      message.error("发布失败，请重试！");
      console.error("发布失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', padding: '0 24px' }}>
      <Card title="发布新文章">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ isPublic: true, tags: [] }}
        >
          <Form.Item
            label="文章标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题！' }]}
          >
            <Input placeholder="请输入文章标题" />
          </Form.Item>

          <Form.Item
            label="文章描述"
            name="desc"
            rules={[{ required: true, message: '请输入文章描述！' }]}
          >
            <TextArea rows={3} placeholder="请输入文章描述" maxLength={200} showCount />
          </Form.Item>
          
          <Form.Item
            label="文章内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容！' }]}
          >
            <TextArea rows={10} placeholder="请输入文章内容 (支持Markdown)" />
          </Form.Item>

          <Form.Item
            label="文章标签"
            name="tags"
            rules={[{ required: true, message: '请选择至少一个标签' }]}
          >
            <Select mode="multiple" placeholder="请选择技术标签" style={{ width: '100%' }}>
              {TECH_TAGS.map(tag => (
                <Option key={tag} value={tag}>{tag}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="公开状态" name="isPublic" valuePropName="checked">
            <Switch checkedChildren="公开" unCheckedChildren="私密" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                立即发布
              </Button>
              <Button onClick={() => navigate('/')}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PublishPage; 
import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Switch, Select, Card, Space, Upload } from "antd";
import { LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../utils/UserContext";
import { useArticles } from "../../utils/ArticleContext";
import { Article } from "../../types";
import { TECH_TAGS } from '../../utils/constants';

const { TextArea } = Input;
const { Option } = Select;

const EditArticle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const { articles, updateArticle } = useArticles();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>();

  useEffect(() => {
    if (id) {
      const foundArticle = articles.find(a => a.id.toString() === id);
      if (foundArticle) {
        if (foundArticle.author !== user.name) {
          message.error("您没有权限编辑别人的文章！");
          navigate("/my-articles");
          return;
        }
        setArticle(foundArticle);
        form.setFieldsValue({
          title: foundArticle.title,
          desc: foundArticle.desc,
          tags: foundArticle.tags || [],
          isPublic: foundArticle.isPublic ?? true,
        });
        setImageUrl(foundArticle.image);
      } else {
        message.error("文章不存在！");
        navigate("/my-articles");
      }
    }
  }, [id, articles, user.name, form, navigate]);

  const handleSubmit = async (values: any) => {
    if (!article) return;
    
    setLoading(true);
    try {
      const updatedArticle: Article = {
        ...article,
        title: values.title,
        desc: values.desc,
        tags: values.tags,
        isPublic: values.isPublic,
        image: imageUrl !== undefined ? imageUrl : article.image,
      };
      
      updateArticle(updatedArticle);
      message.success("文章更新成功！");
      navigate(`/article/${article.id}`);
    } catch (error) {
      console.error("更新失败:", error);
      message.error("更新失败，请重试！");
    } finally {
      setLoading(false);
    }
  };

  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('你只能上传 JPG/PNG 格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小必须小于 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setImageLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setImageLoading(false);
        setImageUrl(url);
      });
    }
  };

  if (!user.isLogin) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        请先 <Button type="link" onClick={() => navigate('/')}>登录</Button>
      </div>
    );
  }

  if (!article) {
    return <div style={{ textAlign: 'center', marginTop: 50 }}>加载中...</div>;
  }

  const uploadButton = (
    <div>
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>更换封面</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', padding: '0 24px' }}>
      <Card title="编辑文章" style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isPublic: true,
            tags: [],
          }}
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
            <TextArea 
              rows={3} 
              placeholder="请输入文章描述" 
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="文章标签"
            name="tags"
            rules={[{ required: true, message: '请选择至少一个标签' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择技术标签"
              style={{ width: '100%' }}
            >
              {TECH_TAGS.map(tag => (
                <Option key={tag} value={tag}>
                  {tag}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {imageUrl ? (
            <Form.Item
              label="文章封面"
            >
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
              </Upload>
            </Form.Item>
          ) : (
            <Form.Item
              label="文章封面"
            >
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {uploadButton}
              </Upload>
            </Form.Item>
          )}

          <Form.Item
            label="公开状态"
            name="isPublic"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="公开" 
              unCheckedChildren="私密" 
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存修改
              </Button>
              <Button onClick={() => navigate(`/article/${article.id}`)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditArticle; 
import React, { useState } from "react";
import { Modal, Form, Input, Button, Select, message, Switch, Upload } from "antd";
import { LoadingOutlined, PlusOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useUser } from "../utils/UserContext";
import { TECH_TAGS } from '../utils/constants';

const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const techTags = [
  "JavaScript", "TypeScript", "React", "Vue", "CSS", "HTML", "Node.js", "Webpack",
  "Docker", "Kubernetes", "CI/CD", "性能优化", "系统设计", "Web开发", "移动开发"
];

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  onPublish?: (article: any) => void;
}

const PublishModal: React.FC<PublishModalProps> = ({ open, onClose, onPublish }) => {
  const { user } = useUser();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

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
        author: user.name,
        publishTime: new Date().toISOString().slice(0, 10),
        image: imageUrl || "/images/default-article.png", // 使用上传的图片
        views: 0,
        tags: values.tags || [],
        isPublic: values.isPublic ?? true
      };
      onPublish?.(newArticle);
      message.success("发布成功！");
      onClose();
      form.resetFields(); // 清空表单
      setImageUrl(undefined); // 清空图片
    }, 1000);
  };

  if (!user.isLogin) {
    message.error("请先登录！");
    return null;
  }

  const uploadButton = (
    <div>
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传封面</div>
    </div>
  );

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="发布文章">
      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item name="title" label="文章标题" rules={[{ required: true, message: '请输入标题' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="desc" label="文章摘要" rules={[{ required: true, message: '请输入摘要' }]}>
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name="tags" label="技术标签" rules={[{ required: true, message: '请选择至少一个标签' }]}>
          <Select mode="multiple" placeholder="请选择技术标签">
            {TECH_TAGS.map(tag => <Select.Option key={tag} value={tag}>{tag}</Select.Option>)}
          </Select>
        </Form.Item>
        {imageUrl ? (
          <Form.Item label="文章封面">
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
          <Form.Item label="文章封面">
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
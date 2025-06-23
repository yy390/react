import React, { useState } from "react";
import { List, Input, Button, Avatar, message, Space, Divider } from "antd";
import { LikeOutlined, MessageOutlined, UserOutlined } from "@ant-design/icons";
import { useUser } from "../../utils/UserContext";
import { useComments } from "../../utils/CommentContext";
import { Comment, Reply } from "../../types";

const { TextArea } = Input;

interface CommentListProps {
  articleId: number | string;
}

const CommentList: React.FC<CommentListProps> = ({ articleId }) => {
  const { user } = useUser();
  const { getCommentsByArticleId, addComment, addReply, likeComment, likeReply } = useComments();
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyingToAuthor, setReplyingToAuthor] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const comments = getCommentsByArticleId(articleId);

  const handleSubmitComment = () => {
    if (!user.isLogin) {
      message.error("请先登录");
      return;
    }
    if (!user.name) {
      message.error("用户信息不完整，请重新登录");
      return;
    }
    if (!newComment.trim()) {
      message.error("请输入评论内容");
      return;
    }

    setLoading(true);
    const comment: Comment = {
      id: Date.now(),
      articleId,
      content: newComment.trim(),
      author: user.name,
      publishTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      likes: 0,
      replies: []
    };

    addComment(articleId, comment);
    setNewComment("");
    setLoading(false);
    message.success("评论发表成功！");
  };

  // 点赞评论
  const handleLikeComment = (commentId: number | string) => {
    if (!user.isLogin) {
      message.error("请先登录");
      return;
    }
    likeComment(articleId, commentId);
    message.success("点赞成功！");
  };

  const handleLikeReply = (commentId: number | string, replyId: number | string) => {
    if (!user.isLogin) {
      message.error("请先登录");
      return;
    }
    likeReply(articleId, commentId, replyId);
    message.success("点赞成功！");
  };

  const handleReply = (commentId: number | string, authorName: string) => {
    if (!user.isLogin) {
      message.error("请先登录");
      return;
    }
    setReplyingTo(commentId.toString());
    setReplyingToAuthor(authorName);
  };

  const handleSubmitReply = (commentId: number | string, authorName: string) => {
    if (!user.name) {
      message.error("用户信息不完整，请重新登录");
      return;
    }
    if (!replyContent.trim()) {
      message.error("请输入回复内容");
      return;
    }

    const reply: Reply = {
      id: Date.now(),
      commentId,
      content: replyContent.trim(),
      author: user.name,
      publishTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      likes: 0,
      replyTo: authorName
    };

    addReply(articleId, commentId, reply);
    setReplyContent("");
    setReplyingTo(null);
    setReplyingToAuthor("");
    message.success("回复成功！");
  };

  const handleCancelReply = () => {
    setReplyContent("");
    setReplyingTo(null);
    setReplyingToAuthor("");
  };

  return (
    <div>
      <Divider orientation="left">评论区</Divider>
      
      <div style={{ marginBottom: 24 }}>
        <TextArea
          rows={3}
          placeholder={user.isLogin ? "写下你的评论..." : "请先登录后发表评论"}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!user.isLogin}
        />
        <div style={{ marginTop: 8, textAlign: "right" }}>
          <Button 
            type="primary" 
            onClick={handleSubmitComment}
            loading={loading}
            disabled={!user.isLogin || !newComment.trim()}
          >
            发表评论
          </Button>
        </div>
      </div>

      <List
        dataSource={comments}
        renderItem={(comment) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={
                <Space>
                  <span style={{ fontWeight: 500 }}>{comment.author}</span>
                  <span style={{ color: "#999", fontSize: 12 }}>{comment.publishTime}</span>
                </Space>
              }
              description={
                <div>
                  <div style={{ marginBottom: 8 }}>{comment.content}</div>
                  <Space>
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<LikeOutlined />}
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      {comment.likes}
                    </Button>
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<MessageOutlined />}
                      onClick={() => handleReply(comment.id, comment.author)}
                    >
                      回复
                    </Button>
                  </Space>
                  
                  {replyingTo === comment.id.toString() && (
                    <div style={{ marginTop: 12 }}>
                      <TextArea
                        rows={2}
                        placeholder={`回复 @${replyingToAuthor}：`}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <div style={{ marginTop: 8 }}>
                        <Space>
                          <Button 
                            size="small" 
                            onClick={() => handleSubmitReply(comment.id, replyingToAuthor)}
                            disabled={!replyContent.trim()}
                          >
                            回复
                          </Button>
                          <Button size="small" onClick={handleCancelReply}>
                            取消
                          </Button>
                        </Space>
                      </div>
                    </div>
                  )}

                  {comment.replies.length > 0 && (
                    <div style={{ marginTop: 12, paddingLeft: 16, borderLeft: "2px solid #f0f0f0" }}>
                      {comment.replies.map((reply) => (
                        <div key={reply.id} style={{ marginBottom: 12 }}>
                          <div style={{ marginBottom: 4 }}>
                            <Space>
                              <span style={{ fontWeight: 500, fontSize: 13 }}>{reply.author}</span>
                              {reply.replyTo && (
                                <span style={{ color: "#999", fontSize: 12 }}>
                                  回复 @{reply.replyTo}
                                </span>
                              )}
                              <span style={{ color: "#999", fontSize: 12 }}>{reply.publishTime}</span>
                            </Space>
                          </div>
                          <div style={{ marginBottom: 4, fontSize: 13 }}>{reply.content}</div>
                          <Space>
                            <Button 
                              type="text" 
                              size="small" 
                              icon={<LikeOutlined />}
                              onClick={() => handleLikeReply(comment.id, reply.id)}
                            >
                              {reply.likes}
                            </Button>
                            <Button
                              type="text"
                              size="small"
                              icon={<MessageOutlined />}
                              onClick={() => handleReply(comment.id, reply.author)}
                            >
                              回复
                            </Button>
                          </Space>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              }
            />
          </List.Item>
        )}
      />
      
      {comments.length === 0 && (
        <div style={{ textAlign: "center", color: "#999", padding: "40px 0" }}>
          暂无评论，快来发表第一条评论吧！
        </div>
      )}
    </div>
  );
};

export default CommentList; 
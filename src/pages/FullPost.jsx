import  { useEffect, useState } from "react";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams } from "react-router-dom";
import axios from "../axios";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import ReactMarkdown from 'react-markdown';


export const FullPost = () => {

  const [post, setPost] = useState()
  const [comments, setComments] = useState([])
  const [isLoadingPost, setIsLoadingPost] = useState(true)
  const [isLoadingComments, setIsLoadingComments] = useState(true)
  const [isErrorPost, setIsErrorPost] = useState('')
  const [isErrorComments, setIsErrorComments] = useState('')
  const { id } = useParams();
  const userData = useSelector(state => state.auth.data);

  useEffect(() => {
    axios.get(`/posts/${id}`)
      .then((res) => {
        setPost(res.data);
        setIsLoadingPost(false);
      })
      .catch((err) => {
        setIsErrorPost('Impossible get the article');
        setIsLoadingPost(false);
      });
  }, [id]);


  useEffect(() => {
    axios.get(`/posts/${id}/comments`)
      .then((res) => {
        setComments(res.data);
        setIsLoadingComments(false);
      })
      .catch((err) => {
        setIsErrorComments('Impossible get the comments');
        setIsLoadingComments(false);
      });
  }, [id]);

  if (isLoadingPost) {
    return <Post isLoading isFullPost />;
  }

  if (isErrorPost) {
    return <Typography color="error">{isErrorPost} 😢</Typography>
  }

  if (!post) {
    return <Typography color="error">Article not found 😢</Typography>
  }

  return (
    <>
      <Post
        id={post._id}
        title={post.title}
        imageUrl={post.imageUrl ? `http://localhost:4444${post.imageUrl}`: ''}
        user={post.user}
        createdAt={post.createdAt}
        viewsCount={post.viewsCount}
        commentsCount={comments.length}
        tags={post.tags}
        isFullPost>
        <ReactMarkdown children={post.text} />
      </Post>
      <h1>{isErrorComments}</h1>
      <CommentsBlock items={comments} isLoading={isLoadingComments} >
        <Index id={post._id} user={ post.user} onAddComment={(newComment) => setComments((prev) => [...prev, newComment])}/>
      </CommentsBlock>
    </>
  );
};

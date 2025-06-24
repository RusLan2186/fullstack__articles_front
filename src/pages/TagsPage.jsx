import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axios';
import { Post } from '../components/Post';
import { Typography } from '@mui/material';

export const TagsPage = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`/posts/tag/${tag}`)
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch posts by tag');
        setLoading(false);
      });
  }, [tag]);

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (posts.length === 0) return <Typography> No posts found for tag #{tag}</Typography>;

  return (
    <>
      <Typography variant="h4" gutterBottom>Posts with tag: #{tag}</Typography>
      {posts.map(post => (
        <Post
          key={post._id}
          id={post._id}
          title={post.title}
          imageUrl={post.imageUrl ? `http://localhost:4444${post.imageUrl}` : ''}
          user={post.user}
          createdAt={post.createdAt}
          viewsCount={post.viewsCount}
          commentsCount={0} 
          tags={post.tags}
        />
      ))}
    </>
  );
};

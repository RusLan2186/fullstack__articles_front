import  { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopularPosts, fetchPosts, fetchTags } from '../redux/slices/posts';
import { fetchLastComments } from '../redux/slices/comments';
import { Typography } from '@mui/material';

export const Home = () => {
  const { posts, tags } = useSelector(state => state.posts);
  const comments = useSelector(state => state.comments);
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.data);
  const [tabIndex, setTabIndex] = useState(0);
  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const isCommentsLoading = comments.status === 'loading';

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    dispatch(fetchLastComments());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    if (newValue === 1) {
      dispatch(fetchPopularPosts());
    } else {
      dispatch(fetchPosts());
    }
  };

  return (
    <>
      <Tabs onChange={handleTabChange} style={{ marginBottom: 15 }} value={tabIndex} aria-label="basic tabs example">
        <Tab label="New" />
        <Tab label="Popular" />
      </Tabs>

      <Grid container spacing={4}>

        <Grid xs={8} item>
          {posts.status === 'loading' ? (
            [...Array(5)].map((_, index) => <Post key={index} isLoading />)
          ) : posts.status === 'error' ? (
            <Typography color="error">No posts available. 😢</Typography>
          ) : posts.items.length === 0 ? (
            <Typography>No posts available.</Typography>
          ) : (
            posts.items.map((obj) => {
              const countComments = comments.items
                ? comments.items.filter((c) => c.post === obj._id).length
                : 0;

              return (
                <Post
                  key={obj._id}
                  id={obj._id}
                  title={obj.title}
                  imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
                  user={obj.user}
                  createdAt={obj.createdAt}
                  viewsCount={obj.viewsCount}
                  commentsCount={countComments}
                  tags={obj.tags}
                  isEditable={userData?._id === obj.user._id}
                />
              );
            })
          )}
        </Grid>

        <Grid xs={4} item>
          {tags.status === 'loading' ? (
            <TagsBlock items={[]} isLoading />
          ) : tags.status === 'error' ? (
            <Typography color="error">Failed to load tags 😢</Typography>
          ) : tags.items.length === 0 ? (
            <Typography>No tags available.</Typography>
          ) : (
            <TagsBlock items={[...new Set(tags.items)]} isLoading={false} />
          )}

          {comments.status === 'loading' ? (
            <CommentsBlock items={[]} isLoading />
          ) : comments.status === 'error' ? (
            <Typography color="error">Failed to load comments 😢</Typography>
          ) : comments.items.length === 0 ? (
            <Typography>No comments yet.</Typography>
          ) : (
            <CommentsBlock items={comments.items} isLoading={false} />
          )}
        </Grid>
      </Grid>
    </>
  );
};

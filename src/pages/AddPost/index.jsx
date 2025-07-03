import React, { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios';

export const AddPost = () => {
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuth);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const inputFileRef = useRef(null)
  const { id } = useParams()
  const isEditing = Boolean(id)

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData()
      const file = event.target.files[0]
      formData.append('image', file)
      // const data = await axios.post('/upload', formData)
      const data = await axios.post('https://fullstack-articles-back.onrender.com/upload', formData);
      setImageUrl(data.data.url)

    } catch (err) {
      console.warn(err);
      alert('Failed to upload image')
    }

  };

  const handleRemoveImage = async () => {
    setImageUrl('');
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);

      const fields = {
        title,
        text,
        imageUrl,
        tags: tags.split(',').map(tag => tag.trim()),
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);

      const _id = isEditing ? id : data._id

      navigate(`/posts/${_id}`);

    } catch (err) {
      console.warn(err);
      alert('Failed to create article');
    } finally {
      setIsLoading(false);
    }
  };

  const removeChanges = (event) => {
    event.preventDefault();
    setTitle('');
    setText('');
    setImageUrl('');
    setTags('');
  }

  useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`).then(({ data }) => {
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl);
        setTags(data.tags.join(','));
      }

      ).catch((err) => {
        console.warn(err);
        alert('Failed to get article');
      })
    }
  }, [])



  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Enter text...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to='/' />
  }

  return (
    <Paper style={{ padding: 30}}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Load preview
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={handleRemoveImage}>
            Delete
          </Button>
          <div style={{  marginTop: 20 }}>
            <img src={`https://fullstack-articles-back.onrender.com${imageUrl}`} alt="Uploaded" />
          </div>
        </>
      )}

      <br />
      <br />
      <form onSubmit={onSubmit}>
        <TextField
          classes={{ root: styles.title }}
          variant="standard"
          placeholder="Title..."
          fullWidth
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <TextField classes={{ root: styles.tags }}
          variant="standard"
          placeholder="Tags"
          fullWidth
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
        <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
        <div className={styles.buttons}>
          <Button type="submit" size="large" variant="contained">
            {isEditing ? 'Save' : 'Publish'}
          </Button>
          <Link to="/">
            <Button onClick={removeChanges} size="large">Cancel</Button>
          </Link>
        </div>
      </form>
    </Paper>
  );
};

import React, { useState } from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import axios from "../../axios";

export const Index = ({ id, onAddComment, user }) => {
  const isAuth = useSelector(selectIsAuth);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();


    if (!comment.trim()) {
      return alert("Comment cannot be empty");
    }

    try {
      setIsLoading(true);

      const data = await axios.post(`/posts/${id}/comments`, { text: comment }); // <-- FIX here
      setComment("");
      if (onAddComment) {
        onAddComment(data.data);
      }

    } catch (err) {
      console.warn(err.response?.data || err.message);
      alert("Failed to create comment");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      {isAuth && (
        <div className={styles.root}>
          <Avatar
            classes={{ root: styles.avatar }}
            src={ user.avatarUrl || '/noavatar.png' }
          />
          <form className={styles.form} onSubmit={onSubmit}>
            <div >
              <TextField
                label="Write a comment"
                variant="outlined"
                maxRows={10}
                multiline
                fullWidth
                value={comment}
                onChange={(e => setComment(e.target.value))}
              />
              <Button type="submit" variant="contained">Send</Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

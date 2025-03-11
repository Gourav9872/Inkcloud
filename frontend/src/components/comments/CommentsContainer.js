import React, { useState } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useSelector} from 'react-redux';
import { createComment, deleteComment, updateComment } from "../../services/index/comments";
import toast from 'react-hot-toast';

export default function CommentsContainer({ className, logginedUserId, comments, postSlug }) {
  
  const queryClient = useQueryClient();
  const userState = useSelector(state => state.user);
  const [affectedComment, setAffectedComment] = useState(null);

  const {mutate: mutateNewComment, isLoading: isLoadingNewComment} = useMutation({
    mutationFn: ({token, desc, slug, parent, replyOnUser}) =>{
      return createComment({token, desc, slug, parent, replyOnUser});
    },
    onSuccess: ()=>{
      toast.success("Your comment is sent successfully, it will be visible after comfirmation from the admin");
    },
    onError: (error)=>{
      toast.error(error.message);
    }
  });

  const {mutate: mutateUpdateComment} = useMutation({
    mutationFn: ({token, desc, commentId}) =>{
      return updateComment({token, desc, commentId});
    },
    onSuccess: ()=>{
      toast.success("Your comment is updated successfully");
      queryClient.invalidateQueries(["blog",postSlug]);
    },
    onError: (error)=>{
      toast.error(error.message);
    }
  });

  const {mutate: mutateDeleteComment} = useMutation({
    mutationFn: ({token, commentId}) =>{
      return deleteComment({token, commentId});
    },
    onSuccess: ()=>{
      toast.success("Your comment is deleted successfully");
      queryClient.invalidateQueries(["blog",postSlug]);
    },
    onError: (error)=>{
      toast.error(error.message);
    }
  });

  const addCommentHandler = (text, parent = null, replyOnUser = null) => {
    mutateNewComment({desc: text, parent, replyOnUser, token: userState.userInfo.token, slug:postSlug });
    setAffectedComment(null);
  };

  const updateCommentHandler=(value,commentId)=>{
    mutateUpdateComment({token: userState.userInfo.token, desc:value, commentId})
    setAffectedComment(null);
  }

  const deleteCommentHandler= (commentId) => {
    mutateDeleteComment({token: userState.userInfo.token, commentId});
  }

  return (
    <div className={`${className}`}>
      <CommentForm
        btnLabel="Send"
        formSubmitHandler={(text) => addCommentHandler(text)}
        loading={isLoadingNewComment}
      ></CommentForm>
      <div className="space-y-4 mt-8">
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            logginedUserId={logginedUserId}
            affectedComment={affectedComment}
            setAffectedComment={setAffectedComment}
            addCommentHandler={addCommentHandler}
            updateComment={updateCommentHandler}
            deleteComment={deleteCommentHandler}
            replies={comment.replies}
          />
        ))}
      </div>
    </div>
  );
}

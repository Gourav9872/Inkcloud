import React, { useState } from "react";
import { createPortal } from "react-dom";
import { stables } from "../constants";
import { AiOutlineCamera } from "react-icons/ai";
import CropEasy from "./crop/CropEasy";
import toast from 'react-hot-toast';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useDispatch, useSelector} from 'react-redux';
import { userActions } from '../store/reducers/userReducers';
import { updateProfilePicture } from '../services/index/users';

export default function ProfilePicture({ avatar }) {
  const userState = useSelector(state => state.user);
  const [openCrop,setOpenCrop] =useState(false);
  const [photo,setPhoto]= useState(null);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const {mutate, isLoading} = useMutation({
    mutationFn:({token, formData}) => {
        return updateProfilePicture({
          token: token,
          formData: formData
        });
    },
    onSuccess: (data) =>{       //AFTER GETTING DATA FROM BACKEND,THIS FUNCTION RUNS AUTOMATICALLY
      dispatch(userActions.setUserInfo(data));
      localStorage.setItem('account',JSON.stringify(data));
      queryClient.invalidateQueries(['profile']);
      toast.success("Profile Picture is removed");
      setOpenCrop(false);
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    }
});

  const handleFileChange= (e)=>{
    const file = e.target.files[0];
    setPhoto({url: URL.createObjectURL(file), file: file});
    setOpenCrop(true);
  }

  const handleDeleteImage =async () =>{
    if(window.confirm("Do you want to delete your profile picture")){
      try {
        const formData = new FormData();
        formData.append("profilePicture",undefined);
        mutate({token : userState.userInfo.token, formData: formData})
  
    } catch (error) {
        toast.error(error.message);
        console.log(error);
    }
    }
    
  }

  return (
    <>
    {openCrop && createPortal(<CropEasy photo={photo} setOpenCrop={setOpenCrop}/>, document.getElementById('portal'))}
      <div className="w-full flex items-center gap-x-4">
      <div className="relative w-20 h-20 rounded-full outline outline-offset-2 outline-1 outline-primary overflow-hidden">
        <label
          htmlFor="profilePicture"
          className="cursor-pointer absolute inset-0 rounded-full bg-transparent"
        >
          {avatar ? (
            <img
              src={stables.UPLOAD_FOLDER_BASE_URL + avatar}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-50/50 flex justify-center items-center">
              <AiOutlineCamera className="w-7 h-auto text-primary hover:opacity-50" />
            </div>
          )}
        </label>
        <input type="file" className="sr-only" id="profilePicture" onChange={handleFileChange}/>
      </div>
      <button
        onClick={handleDeleteImage}
        type="button"
        className="border border-red-500 rounded-lg px-4 py-2 text-red-500"
      >
        Delete
      </button>
    </div>
    </>
  );
}

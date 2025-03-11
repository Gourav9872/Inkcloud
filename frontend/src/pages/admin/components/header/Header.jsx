import React from 'react'
import {Link,useNavigate} from 'react-router-dom'
import { images } from '../../../../constants'
import { useState, useEffect } from 'react'
import { AiFillDashboard, AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { FaComments, FaUser } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import NavItem from './NavItem';
import { useWindowSize } from "@uidotdev/usehooks";
import NavItemCollapse from './NavItemCollapse';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useSelector} from 'react-redux';
import { createPost } from '../../../../services/index/posts';


export default function Header() {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const userState = useSelector(state => state.user);
    const[isMenuActive, setIsMenuActive]= useState(false);
    const[activeNavName, setActiveNavName] =useState("dashboard");
    const windowSize = useWindowSize();

    const {mutate: mutateCreatePost, isLoading: isLoadingCreatePost} = useMutation({
      mutationFn:({slug, token}) => {
          return createPost({
            token
          });
      },
      onSuccess: (data) =>{       //AFTER GETTING DATA FROM BACKEND,THIS FUNCTION RUNS AUTOMATICALLY
        
        queryClient.invalidateQueries(['posts']);
        toast.success("New Post Created,edit that now");
        navigate(`/admin/posts/manage/edit/${data.slug}`);
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      }
  });

    const toggleMenuHandler = () =>{
        setIsMenuActive((prevState)=> !prevState);
    }
    
    useEffect(() => {
      if(windowSize.width < 1024){
        setIsMenuActive(false);
      }else{
        setIsMenuActive(true);
      }
    },[windowSize.width]);

    const handleCreateNewPost = ({token}) => {
      mutateCreatePost({token});
    }

  return (
    <header className="h-fit flex w-full items-center justify-between p-4 lg:h-full lg:max-w-[300px] lg:flex-col lg:items-start lg:justify-start lg:p-0">
      <Link to="/">
        <img src={images.logo} alt="logo" className="w-28 lg:hidden" />
      </Link>
      <div className="cursor-pointer lg:hidden">
        {isMenuActive ? (
          <AiOutlineClose className="w-6 h-6" onClick={toggleMenuHandler} />
        ) : (
          <AiOutlineMenu className="w-6 h-6" onClick={toggleMenuHandler} />
        )}
      </div>
      {isMenuActive && (
        <div className="fixed inset-0 lg:static lg:h-full">
          {/* underlay */}
          <div
            className="fixed inset-0 bg-black opacity-50 lg:hidden"
            onClick={toggleMenuHandler}
          />
          {/* sidebar */}
          <div className="fixed top-0 bottom-0 left-0 z-50 w-3/4 overflow-y-auto bg-white p-4 lg:static lg:h-full lg:w-full lg:p-6">
            <Link to="/">
              <img src={images.logo} alt="logo" className="w-28" />
            </Link>
            <h4 className="mt-10 font-bold text-[#C7C7C7]">MAIN MENU</h4>
            {/* Menu Items */}
            <div className="mt-6 flex flex-col gap-y-[0.563rem]">
              <NavItem
                title="Dashboard"
                link="/admin"
                icon={<AiFillDashboard className='text-xl'/>}
                name="dashboard"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              />
              <NavItem
                title="Comments"
                link="/admin/comments"
                icon={<FaComments className='text-xl'/>}
                name="comments"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              />
              <NavItemCollapse
                title="Posts"
                icon={<MdDashboard className='text-xl'/>}
                name="posts"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              >
                <Link to="/admin/posts/manage">Manage All Posts</Link>
                <button disabled={isLoadingCreatePost} className='text-start disabled:opacity-60 disabled:cursor-not-allowed' onClick={() => handleCreateNewPost({token:userState.userInfo.token})}>Add New Post</button>
                <Link to="/admin/categories/manage">Categories</Link>
                </NavItemCollapse>
                <NavItem
                title="Users"
                link="/admin/users/manage"
                icon={<FaUser className='text-xl'/>}
                name="users"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

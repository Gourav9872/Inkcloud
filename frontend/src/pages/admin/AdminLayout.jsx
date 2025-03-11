import React from 'react'
import Header from './components/header/Header'
import { useQuery} from '@tanstack/react-query';
import {Outlet, useNavigate} from 'react-router-dom'
import { getUserProfile } from '../../services/index/users';
import { useSelector} from 'react-redux';
import toast from 'react-hot-toast';

export default function AdminLayout() {

  const navigate = useNavigate();
  const userState = useSelector(state => state.user);

  const {data: profileData, isLoading: profileIsLoading, error: profileError} = useQuery({
    queryFn : () => {
        return getUserProfile({ token: userState.userInfo.token});
    },
    queryKey: ['profile'],   //if key is same in another page ,it uses cached data in our browser
    
});

if(profileError){
  navigate('/');
      toast.error("You are not allowed to access admin panel");
}
if((profileData && !profileData?.admin)){
      navigate('/');
      toast.error("You are not allowed to access admin panel");
    }

if(profileIsLoading){
  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <h3 className='text-2xl text-slate-700'>Loading...</h3>
    </div>
  )
}

  return (
    <div className='flex flex-col h-screen lg:flex-row'>
      <Header/>
      <main className='bg-[#F9F9F9] flex-1 p-4 lg:p-6'>
        <Outlet/>
      </main>
    </div>
  )
}

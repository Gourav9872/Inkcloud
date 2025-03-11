import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { getSingleCategory, updateCategory } from '../../../../services/index/postCategories';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function EditCategories() {

    const [categoryTitle, setCategoryTitle] = useState("");
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const userState = useSelector(state => state.user);
    const {slug} = useParams();

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getSingleCategory({ slug }),
        queryKey: ["categories", slug],
        refetchOnWindowFocus: false
      });

    const {mutate: mutateUpdateCategory,isLoading:isLoadingUpdateCategory }= useMutation({
        mutationFn:({title, slug, token})=> {
            return updateCategory({title,slug,token});
        },
        onSuccess: (data) =>{
            queryClient.invalidateQueries(["categories",slug]);
            toast.success("Category is updated");
            navigate(`/admin/categories/manage/edit/${data._id}`,{ replace:true});
        },
        onError: (error)=>{
            toast.error(error.message);
            console.log(error);
        }
    })

    const handleUpdateCategory = ()=>{
        if(!categoryTitle) return;
        mutateUpdateCategory({title:categoryTitle, slug,token: userState.userInfo.token})
    }

    useEffect(()=>{
        if(!isLoading && !isError){
            setCategoryTitle(data?.title);
        }
    },[data, isError, isLoading]);

  return (
    <div className="col-span-4 py-8">
            <h4 className="text-lg leading-tight">Update Category</h4>
            <div className="d-form-control w-full mt-6">
              <input
                value={categoryTitle}
                className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
                onChange={(e) => setCategoryTitle(e.target.value)}
                placeholder='category title'
              />
              <button
              disabled={isLoadingUpdateCategory || isLoading || isError}
              type="button"
              onClick={handleUpdateCategory}
              className="w-fit bg-green-500 mt-3 text-white font-semibold rounded-lg px-4 py-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Update Category
            </button>
            </div>

        </div>
  )
}

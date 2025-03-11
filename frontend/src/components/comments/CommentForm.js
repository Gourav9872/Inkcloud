import React, { useState } from 'react'

export default function CommentForm({btnLabel,formSubmitHandler,formCancelHandler=null,initialText="", loading = false}) {

    const[text,setText]=useState(initialText);

    const onSubmitHandler=(e)=>{
        e.preventDefault();
        formSubmitHandler(text);
        setText("");
    }

    const onChangeHandler=(e)=>{
        setText(e.target.value)
    }

  return (
    <form onSubmit={onSubmitHandler}>
      <div className='flex flex-col items-end border border-primary rounded-lg p-4'>
        <textarea
          className="w-full focus:outline-none bg-transparent"
          rows="5"
          placeholder="Leave your comment here"
          value={text}
          onChange={onChangeHandler}
        />
        <div className='flex flex-col-reverse gap-y-2 items-center gap-x-2 pt-2 min-[420px]:flex-row'>
          {formCancelHandler && (
            <button onClick={formCancelHandler} className='px-6 py-2.5 rounded-lg border border-red-500 text-red-500'>Cancel</button>
          )}
          <button disabled={loading} type="submit" className='px-6 py-2.5 rounded-lg bg-primary text-white font-semibold disabled:opacity-70 disabled:cursor-not-allowed'>{btnLabel}</button>
        </div>
      </div>
    </form>
  );
}

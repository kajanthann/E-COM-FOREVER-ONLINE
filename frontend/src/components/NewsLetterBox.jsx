import React from 'react'

const NewsLetterBox = () => {

  const onSubmitHandler = (event) => {
      event.preventDefault();
  }

  return (
    <div className='text-center'>
        <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
        <p className='text-gray-400 mt-3'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the.</p>
        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3' action="">
            <input className='w-full sm:flex outline-none' type="email" placeholder='Enter your Email' required/>
            <button className='bg-black text-white text-xs px-10 py-4' type='submit'>Subscribe</button>
        </form>
    </div>
  )
}

export default NewsLetterBox
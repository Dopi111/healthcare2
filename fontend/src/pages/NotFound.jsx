import React from 'react'
import img_notfound from '../assets/NotFound_404.png'

const NotFound = () => {
  return (
    <div className='w-full h-screen'>
      <div className='hs-full flex justify-center items-center'>
          <img src={img_notfound} alt="404 NOT FOUND"/>
      </div>
    </div>
  )
}

export default NotFound
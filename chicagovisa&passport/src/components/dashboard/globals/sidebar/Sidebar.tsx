import React, {FC} from 'react'

const Sidebar : FC = () => {
  return (
    <div className='flex flex-col bg-white w-60'>
        <div className='flex flex-row bg-light-red'>
            <span className=''>⌂</span>
            <div className='flex flex-col'>
                <span>Business Referal</span>
                <span>All Information details related to forms</span>
            </div>
        </div>
        {/* sidebar items */}
    </div>
  )
}

export default Sidebar
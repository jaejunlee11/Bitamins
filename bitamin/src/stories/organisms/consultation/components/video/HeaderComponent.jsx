import React from 'react'

const HeaderComponent = ({ isPrivate, title }) => {
  return (
    <div className="flex justify-between items-center p-3 bg-blue-100 text-gray-800 shadow-md">
      <div className="flex items-center">
        {isPrivate ? (
          <span className="text-red-500 mr-2 text-xl">🔒</span>
        ) : (
          <span className="text-green-500 mr-2 text-xl">🔓</span>
        )}
        <span className="text-lg font-bold">{title}</span>
      </div>
    </div>
  )
}

export default HeaderComponent

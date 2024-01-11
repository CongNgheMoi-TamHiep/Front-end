import React from 'react'

const page = ({ params }) => {
  return (
    <div className='conversation'>{"Conversation: " + params.id}</div>
  )
}

export default page
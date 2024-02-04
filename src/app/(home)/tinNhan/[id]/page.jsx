import React from 'react'
import './styles.scss'

const page = ({ params }) => {
  return (
    <div className='conversation'>{"Conversation: " + params.id}</div>
  )
}

export default page
import React from 'react'
import { Link } from 'react-router-dom'

export const OtherPage = () => {
  return (
    <div>
      <p>I'm another page</p>
      <Link to="/">Go back home</Link>
    </div>
  )
}

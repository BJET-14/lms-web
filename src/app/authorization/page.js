'use client'
import React, {useEffect, useState} from 'react'

const Authorization = () => {
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        console.log('Authorization page loaded')
    }, [])
  return (
    <div>
        <button>Hello</button>
    </div>
  )
}

export default Authorization
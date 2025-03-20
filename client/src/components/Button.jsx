"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Button = ({ link = "/play", icon = "/rapid.svg", text = "Play Online", onClick = () => { } }) => {
  return (
    <Link href={link}>
      <button onClick={onClick} className='text-lg flex px-6 py-4 items-center gap-1 rounded-md font-semibold bg-[#262522] hover:bg-[#3b3936] border-b-4 cursor-pointer border-[#1d1c1a]'>
        <Image src={icon} width={40} height={40} alt='rapid' />
        {text}
      </button>
    </Link>
  )
}

export default Button
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'


const StartPage = () => {
  return (
    <section className="dark:bg-gray-100 dark:text-gray-800">
      <div className="container flex flex-col justify-center p-6 mx-auto sm:py-12 lg:py-24 lg:flex-row lg:justify-between">
        <div className="flex flex-col justify-center p-6 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left">
          <h1 className="text-5xl font-bold leading-none sm:text-6xl text-[#0b0328]">Faculty
            <span className="text-[#f94f4f]"> Load </span> Allocation
          </h1>
          <p className="mt-6 mb-8 text-lg sm:mb-12">User friendly tool to allocate instructional hours, while reducing scheduling conflicts.
          </p>
          <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
            <Link  href="/home/Load-Allocation" className="px-8 py-3 text-lg font-semibold rounded bg-[#f94f4f] text-gray-50">Get Started</Link>
            <Link  href="#" className="px-8 py-3 text-lg font-semibold border rounded border-gray-800">Learn More</Link>
          </div>
        </div>
        <div className="flex items-center justify-center p-6 mt-8 lg:mt-0 h-72 sm:h-80 lg:h-96 xl:h-112 2xlH-128">
          <Image src="/assets/images/header-image.svg" priority={true} alt="Business Image" className="object-contain h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128" width={500} height={500} />
        </div>
      </div>
    </section>
  )
}

export default StartPage

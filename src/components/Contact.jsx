import React from 'react'

export default function Contact() {

	return (
		<div className='flex-grow flex mt-10 justify-center items-center mx-[-2rem]'>
			<div className='w-full max-w-[500px] h-[400px] flex items-center flex-col gap-5 shadow bg-gray-0 p-2'>
				<div className='h-[50%] w-full flex flex-col justify-between items-center mt-8'>
					<h2>Contact us</h2>
					<div>
						<div className='flex gap-1'>
							<span> Email: </span>
							<a className='text-[blue]' href='mailto:mkhotel71@gmail.com'> mkhotel71@gmail.com </a>
						</div>
						<div className='flex gap-1'>
							<span> Phone number: </span>
							<h4>  +6018-238 2532 </h4>
						</div>
					</div>
				</div>
			</div>

		</div>
	)
}

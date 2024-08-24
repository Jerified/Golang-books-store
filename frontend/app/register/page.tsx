'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { signupSchema } from '@/utils/validator';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';

// import { signupSchema } from './schema';

type FormData = z.infer<typeof signupSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: FormData) => {
    const {username, email, password} = data
    setIsLoading(true);
    const res = await fetch('http://localhost:5000/api/register', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username,
            email,
            password
        })
    })
    // Handle form submission, e.g., API call
    console.log(data);
    console.log(res);


    if (res.ok) {
        router.push('/login')
    }
    setIsLoading(false);
  };

  return (
    <div className='min-h-[cal(100vh-80px)]  flex flex-col justify-center items-center w-full'>
        <div className="border border-stone-400 rounded-xl p-8 w-[80%] md:w-[60%] lg:w-[40%]">
            <p className="text-2xl font-bold">Sign Up</p>
            <p className="pt-2 pb-6 text">Create an account</p>
            <button className="flex items-center gap-2 justify-center text-[15px] font-medium  border w-full py-2 mb-3 rounded-lg border-stone-400">
                <FcGoogle className="text-blue-500 text-xl" />
                Sign Up with Google
            </button>
            <div className="flex items-center gap-4 mt-4">
                <div className="h-px w-full bg-stone-400"></div>
                <span className='text-xs whitespace-nowrap'>OR CONTINUE WITH</span>
                <div className="h-px w-full bg-stone-400"></div>
            </div>
            <motion.form
            className="pt-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit(onSubmit)}
            >
            <div className=" mb-4">
                <label htmlFor="username" className='text-sm font-semibold'>Username</label>
                <input
                type="text"
                id="username"
                {...register('username')}
                className="border border-stone-400 rounded-md p-1 w-full bg-transparent outline-none text-[0.9rem]"
                />
                {errors.username && <p className="text-red-500 text-xs italic pt-1">{errors.username.message}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="email" className='text-sm font-semibold'>Email</label>
                <input
                type="email"
                id="email"
                {...register('email')}
                className="border border-stone-400 rounded-md p-1 w-full bg-transparent outline-none text-[0.9rem]"
                />
                {errors.email && <p className="text-red-500 text-xs italic pt-1">{errors.email.message}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="password" className='text-sm font-semibold'>Password</label>
                <input
                type="password"
                id="password"
                {...register('password')}
                className="border border-stone-400 rounded-md p-1 w-full bg-transparent outline-none text-[0.9rem]"
                />
                {errors.password && <p className="text-red-500 text-xs italic pt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={isLoading} className='flex items-center justify-center mx-auto rounded-md bg-black text-white w-full py-2 mt-2'>
                {isLoading ? 'Loading...' : 'Sign Up'}
            </button>
            <div className="mt-2">
                <p className="text-[0.85rem]">Already have an account? <Link href={'/login'} className="underline underline-offset-4 cursor-pointer text-slate-600">Login</Link></p>
            </div>
            </motion.form>
        </div>
    </div>
  );
};

export default Register;

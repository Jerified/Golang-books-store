'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { signinSchema } from '@/utils/validator';
import { redirect, useRouter } from 'next/navigation'
import Link from 'next/link';

// import { signupSchema } from './schema';

type FormData = z.infer<typeof signinSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter()


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: FormData) => {
    const {email, password} = data
    setIsLoading(true);
    const res = await fetch('http://localhost:5000/api/login', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: 'include',
        body: JSON.stringify({
            email,
            password
        })
    })

    const content = await res.json()
    // Handle form submission, e.g., API call
    console.log(data);
    console.log(content);

    if (res.ok) {
        router.push('/')
    }

    setIsLoading(false);
  };

  return (
    <div className='min-h-screen flex flex-col justify-center items-center w-full'>
        <div className="border border-stone-400 rounded-xl p-8">
            <p className="text-2xl font-bold">Login</p>
            <p className="pt-2 pb-6 text">Welcome Back!</p>
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
                {isLoading ? 'Loading...' : 'Login'}
            </button>
            <div className="mt-2">
                <p className="text-[0.85rem]">Dont have an account? <Link href={'/register'} className="underline underline-offset-4 cursor-pointer text-slate-600">Register</Link></p>
            </div>
            </motion.form>
        </div>
    </div>
  );
};

export default Login;

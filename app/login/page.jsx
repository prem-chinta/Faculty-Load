"use client"
import React, { useEffect, useState } from 'react';
import { Button, Form, Input,message } from 'antd';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '../loading';

const Login = () => {
  const router = useRouter();
  const { status } = useSession();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading,setIsLoaing] = useState(false);
  const error = ({error}) => {
    messageApi.open({
      type: 'error',
      content: `${error}`,
    });
  };


  const onFinish = async (values) => {
    setIsLoaing(true);
    const credentials = {
      email: values.email,
      password: values.password,
    };
    try {
      const signInStatus = await signIn('credentials', {
        redirect: false,
        ...credentials,
      });
      if (signInStatus.ok) {
        console.log('Hello',status);
        router.replace('/home/Load-Allocation');
      }
      else{
      error(signInStatus)
      }
    } catch (error) {
      console.error("Login error:", error);
    }
    finally {
      setIsLoaing(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };



  if (status === 'unauthenticated') {
    return (
      <div className="font-sans text-gray-900 antialiased min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#f8f4f3]">
        <div>
          <a href="/">
            <h2 className="font-bold text-3xl">Let`s <span className="bg-[#f84525] text-white px-2 rounded-md">LOGIN</span></h2>
          </a>
        </div>

        <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
        {contextHolder}
          <Form
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div className="py-8">
              <center>
                <span className="text-2xl font-semibold">Log In</span>
              </center>
            </div>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
            >
              <Input placeholder="Email" size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Input.Password placeholder="Password" size="large" />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <a className="hover:underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" href="{{ route('password.request') }}">
                Forgot your password?
              </a>
              <Button type="submit" htmlType='submit' loading={isLoading} className="ms-4 inline-flex items-center px-4 py-2 bg-[#f84525] border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 focus:bg-[#f84525]  active:bg-[#f84525] focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 transition ease-in-out duration-150">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }

  return <Loading />;
};

export default Login;

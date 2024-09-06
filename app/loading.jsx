import { ConfigProvider, Spin } from 'antd'
import React from 'react'

const Loading = () => {
  return (
    <ConfigProvider
    theme={{
      components: {
        Spin: {
          colorPrimary: "#f84525",
        },
      },
    }}>
    <div className="bg-[#f8f4f3] min-h-screen flex items-center justify-center">
    <Spin spinning size='large' /></div>
     </ConfigProvider>
  )
}

export default Loading
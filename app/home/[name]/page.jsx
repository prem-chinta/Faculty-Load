"use client"
import React, { useState} from 'react';
import {LaptopOutlined, NotificationOutlined, UserOutlined, LoginOutlined} from '@ant-design/icons';
import { ConfigProvider, Layout, Menu, Modal, theme} from 'antd';
import {signOut} from 'next-auth/react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import Faculty from '@/components/Faculty';
import InputDates from '@/components/InputDates';
import Allocation from '@/components/Allocation';

const {Header, Content, Sider} = Layout;

const items = [
    {
        name: "Load Allocation",
        icon: LaptopOutlined,
        title: "Load-Allocation"
    }, {
        name: "Faculty",
        icon: UserOutlined,
        title: "Faculty"
    }, {
        name: "Exam Dates",
        icon: NotificationOutlined,
        title: "Exam-Dates"
    }
].map((item, index) => {
    const key = String(index);
    return {
        key: key,
        icon: React.createElement(item.icon),
        label: item.name,
        title: item.title
    };
});

const Home = ({params}) => {
    const {
        token: {
            colorBgContainer,
            borderRadiusLG
        }
    } = theme.useToken();
    const router = useRouter();
    const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Are you sure you want to log out?');
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
   signOut()
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };
  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

    return (
        <ConfigProvider
            theme={{
            token: {
                colorPrimary: '#f84525',
                borderRadius: 2,
            }
        }}>
               <Modal
        title="Log Out?"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
            <Layout>
                <Header
                    style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    height: 80,
                    background: '#023047'
                }}>
                    <Link className='text-xl font-bold text-white' href="/">Faculty Load Allocation</Link>
                    <a className='text-xl font-bold text-white'  onClick={showModal}><LoginOutlined/>
                    </a>
                </Header>
                <Layout >
                    <Sider
                        width={200}
                        style={{
                        background: colorBgContainer
                    }}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={[items.findIndex((item) => item.title === params.name).toString()]}
                            defaultOpenKeys={['sub1']}
                            style={{
                            height: '100%',
                            borderRight: 0
                        }}
                            onClick={({key}) => {
                            router.replace(`/home/${items[key].title}`);
                        }}
                            items={items}/>
                    </Sider>
                    <Layout
                        style={{
                        padding: '0 24px 24px'
                    }}>
                        <Content
                            style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            height: 'calc(100vh - 120px)',
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG
                        }}
                        >
                            {params.name == "Faculty"
                                ? <Faculty />
                                : params.name == "Exam-Dates"
                                    ? <InputDates/>
                                    : params.name == "Load-Allocation"
                                        ? <Allocation/>
                                        : "Go Back Home"}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};
export default Home;
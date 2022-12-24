import Footer from '@/components/Footer';
import { login } from '@/services/ant-design-pro/api';
import {
    AlipayCircleOutlined,
    LockOutlined,
    MobileOutlined,
    TaobaoCircleOutlined,
    UserOutlined,
    WeiboCircleOutlined,
} from '@ant-design/icons';
import {
    LoginForm,
    ProFormCaptcha,
    ProFormCheckbox,
    ProFormText,
} from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Alert, message, Tabs } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';
import md5 from 'js-md5';

const LoginMessage: React.FC<{
    content: string;
}> = ({ content }) => {
    return (
        <Alert
            style={{
                marginBottom: 24,
            }}
            message={content}
            type="error"
            showIcon
        />
    );
};

const Login: React.FC = () => {
    const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
    const [type, setType] = useState<string>('account');
    const { initialState, setInitialState } = useModel('@@initialState');

    // const intl = useIntl();

    const fetchUserInfo = async () => {
        // console.log(localStorage.getItem('orderPhoto'))
        const userInfo = await initialState?.fetchUserInfo?.();
        if (userInfo) {
            await setInitialState((s) => ({
                ...s,
                currentUser: userInfo,
            }));
        }
    };

    const handleSubmit = async (values: API.LoginParams) => {
        try {
            values.password = md5(values.password);
            // 登录
            const msg = await login({ ...values, type });
            if (msg.code === 200) {
                // removeCookie('orderPhoto');
                // setCookie('orderPhoto', msg.data?.token);
                localStorage.setItem('orderPhoto', msg.data.token);
                message.success('登录成功！');
                await fetchUserInfo();
                const urlParams = new URL(window.location.href).searchParams;
                history.push(urlParams.get('redirect') || '/');
            } else if (msg.code == 400) {
                message.error(msg.msg);
            }
            // 如果失败去设置用户错误信息
            setUserLoginState(msg);
        } catch (error) {
            message.error('登录失败，请重试！');
        }
    };
    const { code, data: loginData } = userLoginState;

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <LoginForm
                    logo={<img alt="logo" src="/logo.png" />}
                    title="订单管理"
                    subTitle='by AILifeLab'
                    initialValues={{
                        autoLogin: true,
                    }}
                    actions={[
                        <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.icon} />,
                        <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.icon} />,
                        <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.icon} />,
                    ]}
                    onFinish={async (values) => {
                        await handleSubmit(values as API.LoginParams);
                    }}
                >
                    <Tabs
                        activeKey={type}
                        onChange={setType}
                        centered
                        items={[
                            {
                                key: 'account',
                                label: '账户密码登录'
                            },
                            {
                                key: 'mobile',
                                label: '手机号登录',
                            },
                        ]}
                    />

                    {code === 400 && (
                        <LoginMessage
                            content='账户或密码错误'
                        />
                    )}
                    {type === 'account' && (
                        <>
                            <ProFormText
                                name="account"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={styles.prefixIcon} />,
                                }}
                                placeholder='用户名'
                                rules={[
                                    {
                                        required: true,
                                        message: ("请输入用户名!"),
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={styles.prefixIcon} />,
                                }}
                                placeholder='密码'
                                rules={[
                                    {
                                        required: true,
                                        message: ("请输入密码！"),
                                    },
                                ]}
                            />
                        </>
                    )}
                    {type === 'mobile' && (
                        <>
                            <ProFormText
                                fieldProps={{
                                    size: 'large',
                                    prefix: <MobileOutlined className={styles.prefixIcon} />,
                                }}
                                name="mobile"
                                placeholder='手机号'
                                rules={[
                                    {
                                        required: true,
                                        message: ("请输入手机号！"),
                                    },
                                    {
                                        pattern: /^1\d{10}$/,
                                        message: ("手机号格式错误！"),
                                    },
                                ]}
                            />
                            <ProFormCaptcha
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={styles.prefixIcon} />,
                                }}
                                captchaProps={{
                                    size: 'large',
                                }}
                                placeholder='请输入验证码'
                                captchaTextRender={(timing, count) => {
                                    if (timing) {
                                        return `${count} '获取验证码'`
                                    }
                                    return '获取验证码'
                                }}
                                name="captcha"
                                rules={[
                                    {
                                        required: true,
                                        message: ("请输入验证码！"),
                                    },
                                ]}
                                onGetCaptcha={async (phone) => {
                                }}
                            />
                        </>
                    )}
                    <div
                        style={{
                            marginBottom: 24,
                        }}
                    >
                        <ProFormCheckbox noStyle name="autoLogin">
                            自动登录
                        </ProFormCheckbox>
                        <a
                            style={{
                                float: 'right',
                            }}
                        >
                            忘记密码
                        </a>
                    </div>
                </LoginForm>
            </div>
            <Footer />
        </div>
    );
};

export default Login;

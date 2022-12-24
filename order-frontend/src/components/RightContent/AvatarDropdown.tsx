import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Avatar, Menu, Spin, message } from 'antd';
import type { ItemType } from 'antd/es/menu/hooks/useItems';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useState, useRef } from 'react';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { editPwd, outLogin } from '@/services/ant-design-pro/api'
import {
    ModalForm,
    ProFormText,
    ProFormInstance
} from '@ant-design/pro-components';
import md5 from 'js-md5';

export type GlobalHeaderRightProps = {
    menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
    /**
     * 退出登录，并且将当前的 url 保存
     */
    const loginOut = async () => {
        await outLogin();
        const { search, pathname } = window.location;
        const urlParams = new URL(window.location.href).searchParams;
        /** 此方法会跳转到 redirect 参数所在的位置 */
        const redirect = urlParams.get('redirect');
        // Note: There may be security issues, please note
        if (window.location.pathname !== '/user/login' && !redirect) {
            history.replace({
                pathname: '/user/login',
                search: stringify({
                    redirect: pathname + search,
                }),
            });
        }
    };
    const { initialState, setInitialState } = useModel('@@initialState');
    const onMenuClick = useCallback(
        (event: MenuInfo) => {
            const { key } = event;
            if (key === 'logout') {
                setInitialState((s) => ({ ...s, currentUser: undefined }));
                loginOut();
                return;
            } else if (key === 'editPwd') {
                setModalVisible(true);
                return;
            }

            history.push(`/account/${key}`);
        },
        [setInitialState],
    );

    const loading = (
        <span className={`${styles.action} ${styles.account}`}>
            <Spin
                size="small"
                style={{
                    marginLeft: 8,
                    marginRight: 8,
                }}
            />
        </span>
    );

    if (!initialState) {
        return loading;
    }

    const { currentUser } = initialState;

    if (!currentUser || !currentUser.nickname) {
        return loading;
    }

    const menuItems: ItemType[] = [
        ...(menu
            ? [
                {
                    key: 'center',
                    icon: <UserOutlined />,
                    label: '个人中心',
                },
                {
                    key: 'settings',
                    icon: <SettingOutlined />,
                    label: '个人设置',
                },
                {
                    type: 'divider' as const,
                },
            ]
            : []),
        {
            key: 'editPwd',
            icon: <UserOutlined />,
            label: '修改密码'
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
        },
    ];

    const menuHeaderDropdown = (
        <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick} items={menuItems} />
    );

    const restFormRef = useRef<ProFormInstance>();
    const formRef = useRef<ProFormInstance>();
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    return (
        <>
            <ModalForm
                title="修改密码"
                formRef={restFormRef}
                open={modalVisible}
                onOpenChange={setModalVisible}
                submitter={{
                    searchConfig: {
                        resetText: '重置',
                    },
                    resetButtonProps: {
                        onClick: () => {
                            restFormRef.current?.resetFields();
                            //   setModalVisible(false);
                        },
                    },
                }}
                onFinish={async (values) => {
                    values.password = md5(values.password);
                    values.passwordNew = md5(values.passwordNew);
                    values.passwordCheck = md5(values.passwordCheck);
                    const result = editPwd(values);
                    if ((await result).code === 200) {
                        message.success((await result).msg);
                        return true;
                    } else {
                        message.error((await result).msg);
                        return false;
                    }
                }}
            >
                <ProFormText.Password
                    width="md"
                    name="password"
                    label="当前密码"
                    tooltip="最长为 32 位"
                    placeholder="请输入当前登录密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码！',
                        },
                    ]}
                />
                <ProFormText.Password
                    width="md"
                    name="passwordNew"
                    label="输入新密码"
                    tooltip="最长为 32 位"
                    placeholder="请输入新密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入新密码',
                        },
                    ]}
                />
                <ProFormText.Password
                    width="md"
                    name="passwordCheck"
                    label="再次输入新密码"
                    tooltip="最长为 32 位"
                    placeholder="再次输入新密码"
                    rules={[({ getFieldValue }) => (
                        {
                            required: true,
                            validator(rule, value, callback) {
                                if (!value || getFieldValue('passwordNew') === value) {
                                    return Promise.resolve()
                                }
                                return Promise.reject("两次密码输入不一致");
                            },
                        }),
                    ]}
                />
            </ModalForm>
            <HeaderDropdown overlay={menuHeaderDropdown}>
                <span className={`${styles.action} ${styles.account}`}>
                    <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
                    <span className={`${styles.name} anticon`}>{currentUser.nickname}</span>
                </span>
            </HeaderDropdown>
        </>
    );
};

export default AvatarDropdown;

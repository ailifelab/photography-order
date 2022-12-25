import React, { useEffect, useRef, useState } from 'react';
import {
    Button, message, Space, Form,
    Divider, Modal
} from 'antd';
import type {
    ProFormInstance, FormListActionType
} from '@ant-design/pro-components';
import {
    ModalForm,
    ProFormText,
    ProFormMoney,
    ProForm,
    ProFormTextArea,
    ProFormSelect,
    ProFormDatePicker,
    ProFormList,
    ProFormDigit,
    ProFormSegmented,
    ProCard
} from '@ant-design/pro-components';
import {
    updateOrders, addOrder, removeOrder, queryOrderDetail,
    selectMembers, addMember, selectCombos, checkCalendarData,
    showMember
} from '@/services/ant-design-pro/api';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'dayjs';

export const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};
const CreateOrderForm: React.FC = (props: any) => {
    const restFormRef = useRef<ProFormInstance<API.OrderItem>>();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [memberInfo, setMemberInfo] = useState<API.MemberInfo[]>([]);
    const [memberForm] = Form.useForm<{ name: string; company: string }>();
    const orderActionRef = useRef<FormListActionType<[{
        comboId: number;
        offPrice: number;
        price: number;
        amount: number;
        appointmentInfo?: [{
            appointmentTime: Date;
            picTag: number;
            picUrl: string;
        }]
    }]>
    >();

    const [title, setTitle] = useState<string>();

    useEffect(() => {
        if (memberInfo.length === 0) {
            if (modalVisible) {
                console.log(memberInfo);
                const memberId = restFormRef.current?.getFieldValue("memberId");
                showMember(memberId).then(result => {
                    if (200 === result.code) {
                        setMemberInfo([result.data])
                    }
                })
            }
        }
        if (props.id == null) {
            setTitle("新增订单");
        } else {
            setTitle("修改订单");
        }
    }, [])

    const getMemberList = (nickname?: string) => {
        selectMembers({ nickname: nickname }).then(resArray => {
            for (let res of resArray.data) {
                res.label = res.nickname;
                res.value = res.memberId;
            }
            setMemberInfo(resArray.data);
        })
    }
    const handleChange = (newValue: string) => {
        for (let res of memberInfo) {
            if (res.memberId == newValue) {
                restFormRef.current?.setFieldsValue({
                    gender: res.gender,
                    msisdn: res.msisdn,
                    nickname: res.nickname,
                    wechat: res.wechat,
                    qqNumber: res.qqNumber,
                    xiaoHongShu: res.xiaoHongShu,
                    email: res.email,
                })
            }
        }
    };

    let timeout: ReturnType<typeof setTimeout> | null;
    const handleMemberSearch = (nickname: string) => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        const fake = () => {
            if (nickname !== null && nickname !== "") {
                getMemberList(nickname);
            } else {
                if (memberInfo.length === 0) {
                    if (modalVisible) {
                        const memberId = restFormRef.current?.getFieldValue("memberId");
                        showMember(memberId).then(result => {
                            if (200 === result.code) {
                                const memberOne = result.data;
                                memberOne.label = memberOne.nickname;
                                memberOne.value = memberOne.memberId
                                setMemberInfo([memberOne])
                            }
                        })
                    }
                }
            }
        };
        timeout = setTimeout(fake, 1000);
    }

    const calPrice = () => {
        const allOrders = orderActionRef.current?.getList();
        if (allOrders) {
            let totalPrice: number = 0;
            for (let order of allOrders) {
                totalPrice += order.price;
                totalPrice -= order.offPrice;
            }
            //定金
            const deposit: number = restFormRef.current?.getFieldValue("deposit");
            //应付尾款
            const balanceToPay: number = totalPrice - deposit;
            //实收尾款
            const balancePayment: number = restFormRef.current?.getFieldValue("balancePayment");
            //额外支出
            const expenditure: number = restFormRef.current?.getFieldValue("expenditure");
            //实际收入
            const income: number = Number(deposit) + Number(balancePayment) - Number(expenditure);

            restFormRef.current?.setFieldsValue({
                totalPrice: totalPrice,
                deposit: deposit,
                balanceToPay: balanceToPay,
                balancePayment: balancePayment,
                expenditure: expenditure,
                income: income,
            })
        }
    }

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState<string | any>('提醒内容');
    const [saveOrderItem, setSaveOrderItem] = useState<API.OrderItem>();

    const handleOk = () => {
        setConfirmLoading(true);
        const success = saveData(saveOrderItem);
        setConfirmLoading(false);
        setOpen(false);
        success.then(tag => {
            if (tag) {
                setModalVisible(false);
                props.refresh(false);
                props.refresh(true);
            }
        })
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const saveData = async (values?: API.OrderItem) => {
        if (values != null) {
            if (values.orderNum == null) {
                const msg = await addOrder(values);
                if (msg.code === 200) {
                    restFormRef.current?.resetFields();
                    message.success('保存成功！')
                    return true;
                } else {
                    message.error('保存失败：' + msg.msg);
                }
            } else {
                const msg = await updateOrders(values);
                if (msg.code === 200) {
                    restFormRef.current?.resetFields();
                    message.success('修改成功！')
                    return true;
                } else {
                    message.error('修改失败：' + msg.msg);
                }
            }
        }
        return false;
    }

    return (
        <ModalForm<API.OrderItem>
            title={title}
            formRef={restFormRef}
            open={modalVisible}
            width="65%"
            trigger={
                <>
                    <Button
                        type="primary"
                        onClick={() => {
                            setModalVisible(true);
                        }}
                        hidden={props.id != null}
                    >
                        新增
                    </Button>
                    <Button
                        type="link"
                        onClick={() => {
                            try {
                                queryOrderDetail(props.id).then(msg => {
                                    if (msg.code === 200) {
                                        restFormRef.current?.setFieldsValue(msg.data);
                                        const memberId = msg.data.memberId;
                                        showMember(memberId).then(result => {
                                            if (200 === result.code) {
                                                const memberOne = result.data;
                                                memberOne.label = memberOne.nickname;
                                                memberOne.value = memberOne.memberId
                                                setMemberInfo([memberOne])
                                            }
                                        })

                                    } else {
                                        message.error('查询失败：' + msg.msg);
                                    }
                                })
                            } catch (error) {
                                message.error('Query failed, please try again');
                            }
                            setModalVisible(true);
                        }}
                        hidden={props.id == null}
                    >修改
                    </Button>
                </>
            }
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
                render: (properties, defaultDoms) => {
                    if (props.id) {
                        return [
                            <Button
                                key="ok"
                                onClick={() => {
                                    removeOrder([props.id]).then(msg => {
                                        if (msg.code === 200) {
                                            restFormRef.current?.resetFields();
                                            setModalVisible(false);
                                            message.success('删除成功！');
                                        } else {
                                            message.error('删除失败：' + msg.msg);
                                        }
                                    }).catch(error => {
                                        message.error('Delete failed, please try again');
                                    });
                                }}
                            >
                                删除
                            </Button>,
                            ...defaultDoms,
                        ];
                    } else {
                        return [...defaultDoms,];
                    }
                },
            }}
            onFinish={async (values) => {
                try {
                    //Todo 检查提示是否有预约
                    const checkData = await checkCalendarData(values);
                    if (checkData.code === 200) {
                        message.success(checkData.msg);
                        return saveData(values);
                    } else if (checkData.code === 220) {
                        setSaveOrderItem(values);
                        setModalText(checkData.msg);
                        setOpen(true);
                    } else {
                        message.error(checkData.msg);
                    }
                } catch (error) {
                    message.error('Save failed, please try again');
                }
                return false;
            }}
        >
            <Modal
                title="提示"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okText="继续保存"
                cancelText="取消"
            >
                <p><ExclamationCircleOutlined />{modalText}</p>
            </Modal>
            <ProFormText width="md" name="orderNum" label="订单编号" placeholder="系统生成" disabled />
            <ProFormDatePicker
                name="orderTime"
                label="预定时间"
                width="sm"
                transform={(value) => {
                    return {
                        date: moment(value).unix(),
                    };
                }}
                initialValue={moment()}
            />
            <ProForm.Group>
                <ProFormSelect
                    name="memberId"
                    label="预定人昵称/姓名"
                    width="sm"
                    showSearch
                    placeholder="选择或创建会员信息"
                    rules={[{ required: true, message: '请选择会员' }]}
                    fieldProps={{
                        options: memberInfo.map((m) => ({ label: m.label, value: m.value })),
                        onChange: (value) => handleChange(value),
                        onSearch: (value) => handleMemberSearch(value),
                        dropdownRender: (menu) => (
                            <>
                                <Divider style={{ margin: '8px 0' }} />
                                <Space style={{ padding: '0 8px 4px' }}>
                                    <ModalForm<{
                                        name: string;
                                        company: string;
                                    }>
                                        title="新增会员"
                                        trigger={
                                            <Button type="primary">
                                                <PlusOutlined />
                                                新增会员
                                            </Button>
                                        }
                                        form={memberForm}
                                        autoFocusFirstInput
                                        modalProps={{
                                            destroyOnClose: true,
                                            onCancel: () => {
                                            },
                                        }}
                                        submitTimeout={2000}
                                        onFinish={async (values: API.MemberInfo) => {
                                            try {
                                                const msg = await addMember(values);
                                                if (msg.code === 200) {
                                                    message.success('保存成功！')
                                                    return true;
                                                } else {
                                                    message.error('保存失败：' + msg.msg);
                                                }
                                            } catch (error) {
                                                message.error('Save failed, please try again');
                                            } finally {
                                                getMemberList(values.nickname);
                                            }
                                            return false;
                                        }}
                                    >
                                        <ProForm.Group>
                                            <ProFormText width="sm" name="nickname" label="预订人昵称" placeholder="请输入" rules={[{ required: true, message: '填写昵称' }]} />
                                            <ProFormSelect width="xs" name="gender" label="预定人性别" placeholder="请选择"
                                                options={[{ value: "female", label: "女" }, { value: "male", label: "男" }]}
                                                initialValue="female" />
                                            <ProFormText width="sm" name="name" label="真实姓名" placeholder="请输入" />
                                            <ProFormDatePicker width="sm" name="birthday" label="生日" />
                                        </ProForm.Group>
                                        <ProForm.Group>
                                            <ProFormText width="sm" name="xiaoHongShu" label="预定人小红书账号" placeholder="请输入" />
                                            <ProFormText width="sm" name="wechat" label="预定人微信号" placeholder="请输入" />
                                            <ProFormText width="sm" name="qqNumber" label="预定人QQ号" placeholder="请输入" />
                                            <ProFormText width="sm" name="msisdn" label="手机号" placeholder="请输入" />
                                            <ProFormText width="sm" name="email" label="预定人邮箱地址" placeholder="请输入" />
                                        </ProForm.Group>
                                    </ModalForm>
                                </Space>
                                {menu}
                            </>
                        )
                    }}
                />
                <ProFormSelect width="xs" name="gender" label="预定人性别"
                    options={[{ value: "female", label: "女" }, { value: "male", label: "男" }]}
                    disabled />
                <ProFormText width="sm" name="msisdn" label="手机号" disabled />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormMoney width="xs" name="deposit" label="定金" min={0} placeholder="请输入" initialValue='200' fieldProps={{ onChange: (value) => calPrice() }} />
                <ProFormMoney width="xs" name="balanceToPay" label="应付尾款" min={0} placeholder="自动计算" disabled />
                <ProFormMoney width="xs" name="totalPrice" label="订单总额" min={0} placeholder="自动计算" disabled />
            </ProForm.Group>
            <Divider orientation="left" style={{ marginBlockEnd: 8 }}>订购套餐列表</Divider>
            <ProFormList<API.OrderInfoDetail[]>
                name="comboList"
                initialValue={[{ comboId: null, offPrice: 0, amount: 1, appointmentInfo: [{ appointmentTime: moment(), picTag: 0, picUrl: null, }] }]}
                creatorButtonProps={{
                    creatorButtonText: '添加套餐',
                }}
                copyIconProps={false}
                min={1}
                actionRef={orderActionRef}
                itemRender={({ listDom, action }, { index }) => (
                    <ProCard
                        bordered
                        style={{ marginBlockEnd: 8 }}
                        title={`套餐${index + 1}`}
                        extra={action}
                        bodyStyle={{ paddingBlockEnd: 0 }}
                    >
                        {listDom}
                    </ProCard>
                )}
            >
                {(f, index, action) => {
                    const appointmentRef = useRef<FormListActionType<{
                        appointmentTime: Date;
                        picTag: number;
                        picUrl: string;
                    }>
                    >();
                    return (
                        <>
                            <ProForm.Group>
                                <ProFormSelect width="sm" name="comboId" label="套餐名称"
                                    showSearch
                                    debounceTime={1000}
                                    request={async ({ keyWords }) => {
                                        return (await selectCombos({ name: keyWords }).then(resArray => {
                                            for (let res of resArray.data) {
                                                res.label = res.name;
                                                res.value = res.id;
                                            }
                                            return resArray.data
                                        }));
                                    }}
                                    fieldProps={{
                                        onChange: (id, detail) => {
                                            if (detail) {
                                                const size = detail['numSet'];
                                                action.setCurrentRowData({
                                                    price: detail['price'],
                                                    amount: size,
                                                });
                                                const row = orderActionRef.current?.getList();
                                                let listNow = 0
                                                if (row[index].appointmentInfo) {
                                                    listNow = row[index].appointmentInfo.length;
                                                }
                                                if (size > listNow) {
                                                    for (let i = 0; i < (size - listNow); i++) {
                                                        appointmentRef.current?.add({
                                                            appointmentTime: moment(),
                                                            picTag: 0,
                                                            picUrl: null,
                                                        })
                                                    }
                                                } else if (size < listNow) {
                                                    for (let i = 0; i < (listNow - size); i++) {
                                                        appointmentRef.current?.remove(0);
                                                    }
                                                }
                                                calPrice();
                                            }

                                        }
                                    }} />
                                <ProFormMoney width="xs" name="price" label="套餐价格" initialValue="0" disabled />
                                <ProFormDigit width="xs" name="amount" label="套餐包含数量" initialValue="1" disabled />
                                <ProFormMoney width="xs" name="offPrice" label="优惠金额" initialValue="0" fieldProps={{ onChange: (value) => calPrice() }} />
                                <ProFormList name="appointmentInfo"
                                    creatorButtonProps={false}
                                    deleteIconProps={false}
                                    copyIconProps={false}
                                    min={1}
                                    actionRef={appointmentRef}
                                >
                                    {(tF, tIndex, tAction) => {
                                        return (
                                            <>
                                                <ProForm.Group>
                                                    <ProFormDatePicker width="sm" name="appointmentTime" label="预约拍照时间" />
                                                    <ProFormSegmented
                                                        name="picTag"
                                                        label="状态"
                                                        // valueEnum={{
                                                        //     0: '未拍摄',
                                                        //     1: '已拍摄',
                                                        //     2: '已返原图',
                                                        //     3: '已返精修',
                                                        // }}
                                                        request={async () => [
                                                            { label: '未拍摄', value: 0 },
                                                            { label: '已拍摄', value: 1 },
                                                            { label: '已返原图', value: 2 },
                                                            { label: '已返精修', value: 3 },
                                                        ]}
                                                    />
                                                    <ProFormText width="sm" name="picUrl" label="图片路径" placeholder="请输入" />
                                                </ProForm.Group>
                                            </>
                                        );
                                    }}
                                </ProFormList>
                            </ProForm.Group>
                        </>
                    );
                }}
            </ProFormList>
            <ProForm.Group>
                <ProFormTextArea width="xl" name="topicDetail" label="预约主题备注" placeholder="请输入" />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormMoney width="xs" name="balancePayment" label="已收尾款" min={0} placeholder="请输入" fieldProps={{ onChange: (value) => calPrice() }} />
                <ProFormDatePicker width="xs" name="balancePaymentTime" label="尾款收入时间" placeholder="请选择" />
                <ProFormMoney width="xs" name="expenditure" label="额外支出费用" min={0} placeholder="请输入" fieldProps={{ onChange: (value) => calPrice() }} />
                <ProFormMoney width="xs" name="income" label="合计收入" min={0} placeholder="自动计算" disabled />
                <ProFormTextArea width="xl" name="expenditureRemarks" label="额外支出备注" placeholder="请输入" />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormSegmented
                    name="finishedTag"
                    label="办结标记"
                    // valueEnum={{
                    //     0: '未返图',
                    //     1: '已返图',
                    //     2: '部分返图',
                    // }}
                    request={async () => [
                        { label: '未返图', value: 0 },
                        { label: '已返图', value: 1 },
                        { label: '部分返图', value: 2 },
                    ]}
                    initialValue={0}
                    disabled
                />
                <ProFormDatePicker
                    name="lastUpdateTime"
                    label="上次操作时间"
                    width="sm"
                    transform={(value) => {
                        return {
                            date: moment(value).unix(),
                        };
                    }}
                    initialValue={moment()}
                    disabled
                />
                <ProFormText width="xs" name="lastUpdateUser" label="上次操作人员" placeholder="当前用户" disabled />
            </ProForm.Group>
        </ModalForm>
    )
}
export default CreateOrderForm;
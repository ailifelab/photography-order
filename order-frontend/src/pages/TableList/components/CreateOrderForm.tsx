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
            setTitle("????????????");
        } else {
            setTitle("????????????");
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
            //??????
            const deposit: number = restFormRef.current?.getFieldValue("deposit");
            //????????????
            const balanceToPay: number = totalPrice - deposit;
            //????????????
            const balancePayment: number = restFormRef.current?.getFieldValue("balancePayment");
            //????????????
            const expenditure: number = restFormRef.current?.getFieldValue("expenditure");
            //????????????
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
    const [modalText, setModalText] = useState<string | any>('????????????');
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
                    message.success('???????????????')
                    return true;
                } else {
                    message.error('???????????????' + msg.msg);
                }
            } else {
                const msg = await updateOrders(values);
                if (msg.code === 200) {
                    restFormRef.current?.resetFields();
                    message.success('???????????????')
                    return true;
                } else {
                    message.error('???????????????' + msg.msg);
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
                        ??????
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
                                        message.error('???????????????' + msg.msg);
                                    }
                                })
                            } catch (error) {
                                message.error('Query failed, please try again');
                            }
                            setModalVisible(true);
                        }}
                        hidden={props.id == null}
                    >??????
                    </Button>
                </>
            }
            onOpenChange={setModalVisible}
            submitter={{
                searchConfig: {
                    resetText: '??????',
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
                                            message.success('???????????????');
                                        } else {
                                            message.error('???????????????' + msg.msg);
                                        }
                                    }).catch(error => {
                                        message.error('Delete failed, please try again');
                                    });
                                }}
                            >
                                ??????
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
                    //Todo ???????????????????????????
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
                title="??????"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okText="????????????"
                cancelText="??????"
            >
                <p><ExclamationCircleOutlined />{modalText}</p>
            </Modal>
            <ProFormText width="md" name="orderNum" label="????????????" placeholder="????????????" disabled />
            <ProFormDatePicker
                name="orderTime"
                label="????????????"
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
                    label="???????????????/??????"
                    width="sm"
                    showSearch
                    placeholder="???????????????????????????"
                    rules={[{ required: true, message: '???????????????' }]}
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
                                        title="????????????"
                                        trigger={
                                            <Button type="primary">
                                                <PlusOutlined />
                                                ????????????
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
                                                    message.success('???????????????')
                                                    return true;
                                                } else {
                                                    message.error('???????????????' + msg.msg);
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
                                            <ProFormText width="sm" name="nickname" label="???????????????" placeholder="?????????" rules={[{ required: true, message: '????????????' }]} />
                                            <ProFormSelect width="xs" name="gender" label="???????????????" placeholder="?????????"
                                                options={[{ value: "female", label: "???" }, { value: "male", label: "???" }]}
                                                initialValue="female" />
                                            <ProFormText width="sm" name="name" label="????????????" placeholder="?????????" />
                                            <ProFormDatePicker width="sm" name="birthday" label="??????" />
                                        </ProForm.Group>
                                        <ProForm.Group>
                                            <ProFormText width="sm" name="xiaoHongShu" label="????????????????????????" placeholder="?????????" />
                                            <ProFormText width="sm" name="wechat" label="??????????????????" placeholder="?????????" />
                                            <ProFormText width="sm" name="qqNumber" label="?????????QQ???" placeholder="?????????" />
                                            <ProFormText width="sm" name="msisdn" label="?????????" placeholder="?????????" />
                                            <ProFormText width="sm" name="email" label="?????????????????????" placeholder="?????????" />
                                        </ProForm.Group>
                                    </ModalForm>
                                </Space>
                                {menu}
                            </>
                        )
                    }}
                />
                <ProFormSelect width="xs" name="gender" label="???????????????"
                    options={[{ value: "female", label: "???" }, { value: "male", label: "???" }]}
                    disabled />
                <ProFormText width="sm" name="msisdn" label="?????????" disabled />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormMoney width="xs" name="deposit" label="??????" min={0} placeholder="?????????" initialValue='200' fieldProps={{ onChange: (value) => calPrice() }} />
                <ProFormMoney width="xs" name="balanceToPay" label="????????????" min={0} placeholder="????????????" disabled />
                <ProFormMoney width="xs" name="totalPrice" label="????????????" min={0} placeholder="????????????" disabled />
            </ProForm.Group>
            <Divider orientation="left" style={{ marginBlockEnd: 8 }}>??????????????????</Divider>
            <ProFormList<API.OrderInfoDetail[]>
                name="comboList"
                initialValue={[{ comboId: null, offPrice: 0, amount: 1, appointmentInfo: [{ appointmentTime: moment(), picTag: 0, picUrl: null, }] }]}
                creatorButtonProps={{
                    creatorButtonText: '????????????',
                }}
                copyIconProps={false}
                min={1}
                actionRef={orderActionRef}
                itemRender={({ listDom, action }, { index }) => (
                    <ProCard
                        bordered
                        style={{ marginBlockEnd: 8 }}
                        title={`??????${index + 1}`}
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
                                <ProFormSelect width="sm" name="comboId" label="????????????"
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
                                <ProFormMoney width="xs" name="price" label="????????????" initialValue="0" disabled />
                                <ProFormDigit width="xs" name="amount" label="??????????????????" initialValue="1" disabled />
                                <ProFormMoney width="xs" name="offPrice" label="????????????" initialValue="0" fieldProps={{ onChange: (value) => calPrice() }} />
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
                                                    <ProFormDatePicker width="sm" name="appointmentTime" label="??????????????????" />
                                                    <ProFormSegmented
                                                        name="picTag"
                                                        label="??????"
                                                        // valueEnum={{
                                                        //     0: '?????????',
                                                        //     1: '?????????',
                                                        //     2: '????????????',
                                                        //     3: '????????????',
                                                        // }}
                                                        request={async () => [
                                                            { label: '?????????', value: 0 },
                                                            { label: '?????????', value: 1 },
                                                            { label: '????????????', value: 2 },
                                                            { label: '????????????', value: 3 },
                                                        ]}
                                                    />
                                                    <ProFormText width="sm" name="picUrl" label="????????????" placeholder="?????????" />
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
                <ProFormTextArea width="xl" name="topicDetail" label="??????????????????" placeholder="?????????" />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormMoney width="xs" name="balancePayment" label="????????????" min={0} placeholder="?????????" fieldProps={{ onChange: (value) => calPrice() }} />
                <ProFormDatePicker width="xs" name="balancePaymentTime" label="??????????????????" placeholder="?????????" />
                <ProFormMoney width="xs" name="expenditure" label="??????????????????" min={0} placeholder="?????????" fieldProps={{ onChange: (value) => calPrice() }} />
                <ProFormMoney width="xs" name="income" label="????????????" min={0} placeholder="????????????" disabled />
                <ProFormTextArea width="xl" name="expenditureRemarks" label="??????????????????" placeholder="?????????" />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormSegmented
                    name="finishedTag"
                    label="????????????"
                    // valueEnum={{
                    //     0: '?????????',
                    //     1: '?????????',
                    //     2: '????????????',
                    // }}
                    request={async () => [
                        { label: '?????????', value: 0 },
                        { label: '?????????', value: 1 },
                        { label: '????????????', value: 2 },
                    ]}
                    initialValue={0}
                    disabled
                />
                <ProFormDatePicker
                    name="lastUpdateTime"
                    label="??????????????????"
                    width="sm"
                    transform={(value) => {
                        return {
                            date: moment(value).unix(),
                        };
                    }}
                    initialValue={moment()}
                    disabled
                />
                <ProFormText width="xs" name="lastUpdateUser" label="??????????????????" placeholder="????????????" disabled />
            </ProForm.Group>
        </ModalForm>
    )
}
export default CreateOrderForm;
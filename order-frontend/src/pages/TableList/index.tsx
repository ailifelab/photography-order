import React, { useRef, useEffect, useState } from 'react';
import {
    Space, Button, message
} from 'antd';
import type {
    ActionType, ProColumns,
} from '@ant-design/pro-components';
import {
    PageContainer,
    ProTable
} from '@ant-design/pro-components';
import {
    queryOrderList, removeOrder
} from '@/services/ant-design-pro/api';
import CreateOrderForm from './components/CreateOrderForm';

export const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};
const TableList: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [dataSource, setDataSource] = useState<readonly API.OrderItem[]>([]);

    const [isChange, setIsChange] = useState(false);
    useEffect(() => {
        actionRef.current?.reload();
    }, [isChange]);

    const columns: ProColumns<API.OrderItem>[] = [
        {
            title: '订单编号',
            dataIndex: 'orderNum',
            width: 120,
            search: false,
            sorter: true,
            fixed: 'left',
            readonly: true,
            tooltip: '自动生成',
        },
        {
            title: '预定人',
            dataIndex: 'nickname',
            width: 120,
            fixed: 'left',
        },
        {
            title: '小红书',
            dataIndex: 'xiaoHongShu',
            width: 120,
        },
        {
            title: '微信号',
            dataIndex: 'wechat',
            width: 100,
        },
        {
            title: '预定人手机号',
            width: 120,
            dataIndex: 'msisdn',
        },
        {
            title: '定金',
            dataIndex: 'deposit',
            sorter: true,
            width: 80,
            align: 'right',
        },
        {
            title: '应付尾款',
            dataIndex: 'balanceToPay',
            sorter: true,
            width: 100,
            align: 'right',
            editable: false,
            renderText: (text, record, index, action) => {
                if (record?.totalPrice && record?.deposit) {
                    return (record.totalPrice ? record.totalPrice : 0) - (record.deposit ? record.deposit : 0);
                } else { return "" }
            }
        },
        {
            title: '订单总额',
            dataIndex: 'totalPrice',
            sorter: true,
            width: 100,
            align: 'right',
        },
        {
            title: '预定套餐情况',
            dataIndex: 'packageRemarks',
            valueType: 'textarea',
            width: 120,
        },
        {
            title: '预定时间',
            dataIndex: 'orderTime',
            valueType: 'date',
            sorter: true,
            hideInSearch: true,
            width: 120,
        },
        {
            title: '预约主题备注',
            dataIndex: 'topicDetail',
            valueType: 'textarea',
            search: false,
            width: 120,
        },
        {
            title: '已收尾款',
            dataIndex: 'balancePayment',
            sorter: true,
            width: 100,
            align: 'right',
        },
        {
            title: '尾款收入时间',
            dataIndex: 'balancePaymentTime',
            valueType: 'date',
            sorter: true,
            hideInSearch: true,
            width: 120,
        },
        {
            title: '额外支出备注',
            dataIndex: 'expenditureRemarks',
            valueType: 'textarea',
            search: false,
            width: 120,
        },
        {
            title: '合计收入(除支出)',
            dataIndex: 'income',
            sorter: true,
            width: 100,
            align: 'right',
        },
        {
            title: 'QQ号',
            dataIndex: 'qqNumber',
            width: 100,
        },
        {
            title: '邮箱地址',
            dataIndex: 'email',
            search: false,
            width: 120,
        },
        {
            title: '性别',
            dataIndex: 'gender',
            width: 80,
            valueEnum: {
                'male': {
                    text: '男',
                },
                'female': {
                    text: '女',
                }
            },
        },
        {
            title: '会员编号',
            dataIndex: 'memberId',
            width: 120,
            search: false,
            editable: false,
        },
        {
            title: '预约拍照时间',
            dataIndex: 'appointmentTime',
            valueType: 'dateTime',
            sorter: true,
            hideInSearch: true,
            width: 120,
            fixed: 'right'
        },
        {
            title: '是否返图',
            dataIndex: 'finishedTag',
            valueType: 'select',
            valueEnum: {
                0: {
                    text: '未返图',
                    status: 'Default',
                },
                1: {
                    text: '已返图',
                    status: 'Success',
                },
                2: {
                    text: '部分返图',
                    status: 'Processing',
                }
            },
            width: 100,
            fixed: 'right',
        },
        {
            title: '操作',
            width: 100,
            valueType: 'option',
            key: 'option',
            fixed: 'right',
            render: (text, record, index, action) => [
                <CreateOrderForm key={record.orderNum} id={record.orderNum} refresh={(flag:boolean) => { setIsChange(flag) }} />,
                // <a
                //   key="delete"
                //   onClick={() => {
                //     console.log("delete:", record.orderNum)
                //   }}
                // >
                //   删除
                // </a>,
            ],
        },
    ];

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <PageContainer>
            <ProTable<API.OrderItem>
                rowKey={record => record.orderNum}
                scroll={{
                    x: 960,
                }}
                actionRef={actionRef}
                headerTitle="订单列表"
                maxLength={5}
                // 关闭默认的新建按钮
                recordCreatorProps={false}
                columns={columns}
                request={async (params = {}, sort, filter) => {
                    const msg = await queryOrderList({
                        pageNum: params.current,
                        pageSize: params.pageSize
                    });
                    return {
                        data: msg.data?.records,
                        // success 请返回 true，
                        success: (msg.code == 200 ? true : false),
                        // 不传会使用 data 的长度，如果是分页一定要传
                        total: msg.data?.total,
                    };
                }}
                value={dataSource}
                onChange={setDataSource}
                rowSelection={rowSelection}
                tableAlertOptionRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
                    return (
                        <Space size={16}>
                            <Button type="link"
                                onClick={() => {
                                    removeOrder(selectedRowKeys).then(result => {
                                        if (result.code === 200) {
                                            message.success('删除成功！');
                                            setSelectedRowKeys([]);
                                            setIsChange(!isChange);
                                        } else {
                                            message.error(result.msg);
                                        }
                                    });
                                }
                                }>批量删除</Button>
                            <Button type="link">导出数据</Button>
                        </Space>
                    );
                }}
                search={{
                    labelWidth: 'auto',
                }}
                pagination={{
                    pageSize: 10,
                    // onChange: (page) => console.log(page),
                }}
                toolBarRender={() => [
                    <CreateOrderForm refresh={(flag:boolean) => { setIsChange(flag) }} />
                ]}
            />
        </PageContainer>
    );
};

export default TableList;

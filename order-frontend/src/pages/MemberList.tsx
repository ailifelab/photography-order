import React, { useRef, useState } from 'react';
import {
    PlusOutlined
} from '@ant-design/icons';
import {
    Button, message, Table, Space
} from 'antd';
import type {
    ActionType, ProColumns
} from '@ant-design/pro-components';
import {
    PageContainer,
    EditableProTable
} from '@ant-design/pro-components';
import { listMembers, updateMember, addMember, removeMember } from '@/services/ant-design-pro/api';

const MemberList: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [dataSource, setDataSource] = useState<readonly API.MemberInfo[]>([]);
    const columns: ProColumns<API.MemberInfo>[] = [
        {
            title: '会员编号',
            dataIndex: 'memberId',
            width: 120,
            search: false,
            sorter: true,
            fixed: 'left',
            readonly: true,
            tooltip: '自动生成',
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
            width: 120,
            fixed: 'left',
        },
        {
            title: '手机号',
            dataIndex: 'msisdn',
            width: 120,
        },
        {
            title: '微信',
            dataIndex: 'wechat',
            width: 120,
        },
        {
            title: 'QQ',
            dataIndex: 'qqNumber',
            width: 120,
        },
        {
            title: '小红书账号',
            dataIndex: 'xiaoHongShu',
            width: 120,
        },
        {
            title: '电子邮件',
            dataIndex: 'email',
            width: 120,
        },
        {
            title: '姓名',
            dataIndex: 'name',
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
            title: '生日',
            dataIndex: 'birthday',
            width: 120,
            valueType: 'date',
        },
        {
            title: '首次预定时间',
            dataIndex: 'registerDate',
            width: 120,
            search: false,
            editable: false,
            valueType: 'date',
        },
        {
            title: '备注',
            dataIndex: 'remarks',
            width: 120,
            tooltip: '偏好、风格等',
            search: false,
        },
        {
            title: '操作',
            width: 100,
            valueType: 'option',
            key: 'option',
            fixed: 'right',
            render: (text, record, index, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.memberId);
                    }}
                >
                    编辑
                </a>,
            ],
        },

    ]
    return (
        <PageContainer>
            <EditableProTable<API.MemberInfo>
                rowKey="memberId"
                scroll={{
                    x: 960,
                }}
                actionRef={actionRef}
                headerTitle="会员列表"
                maxLength={5}
                // 关闭默认的新建按钮
                recordCreatorProps={false}
                columns={columns}
                request={async (params = {}, sort, filter) => {
                    const msg = await listMembers({
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
                rowSelection={{
                    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                }}
                tableAlertOptionRender={() => {
                    return (
                        <Space size={16}>
                            <a>批量删除</a>
                            <a>导出数据</a>
                        </Space>
                    );
                }}
                editable={{
                    type: 'single',
                    onSave: async (rowKey, data, row) => {
                        try {
                            if ('tmp' == data.memberId.substring(0, data.memberId.indexOf('.'))) {
                                data.memberId = null;
                                const msg = await addMember(data);
                                if (msg.code === 200) {
                                    message.success('保存成功！')
                                    return true;
                                } else {
                                    message.error('保存失败：' + msg.msg);
                                }
                            } else {
                                const msg = await updateMember(data);
                                if (msg.code === 200) {
                                    message.success('保存成功！')
                                    return true;
                                } else {
                                    message.error('保存失败：' + msg.msg);
                                }
                            }
                        } catch (error) {
                            message.error('Save failed, please try again');
                        }
                        return false;
                    },
                    onDelete: async (key, row) => {
                        try {
                            const msg = await removeMember([key.toString()]);
                            if (msg.code === 200) {
                                message.success('删除成功！')
                                return true;
                            } else {
                                message.error('删除失败：' + msg.msg);
                            }
                        } catch (error) {
                            message.error('Delete failed, please try again');
                        }
                        return false;
                    }
                }}
                search={{
                    labelWidth: 'auto',
                }}
                pagination={{
                    pageSize: 10,
                    // onChange: (page) => console.log(page),
                }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        onClick={() => {
                            actionRef.current?.addEditRecord?.({
                                memberId: "tmp." + (Math.random() * 100000).toFixed(0),
                                nickname: '小姐姐',
                                gender: 'female',
                            });
                        }}
                        icon={<PlusOutlined />}
                    >
                        新增
                    </Button>
                ]}
            />
        </PageContainer>
    );
};

export default MemberList;
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
import { listCombo, updateCombo, addCombo, removeCombo } from '@/services/ant-design-pro/api';

const ComboList: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [dataSource, setDataSource] = useState<readonly API.ComboInfo[]>([]);
    const columns: ProColumns<API.ComboInfo>[] = [
        {
            title: '套餐编码',
            dataIndex: 'id',
            width: 120,
            search: false,
            sorter: true,
            fixed: 'left',
            readonly: true,
            tooltip: '自动生成',
        },
        {
            title: '套餐名称',
            dataIndex: 'name',
            width: 120,
            fixed: 'left',
        },
        {
            title: '套餐价格',
            dataIndex: 'price',
            width: 120,
            valueType: 'money'
        },
        {
            title: '套餐描述',
            dataIndex: 'remark',
            width: 120,
        },
        {
            title: '包含套数',
            dataIndex: 'numSet',
            width: 100,
            valueType: 'digit',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 120,
            search: false,
            editable: false,
            valueType: 'date',
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
                        action?.startEditable?.(record.id);
                    }}
                >
                    编辑
                </a>,
            ],
        },

    ]
    return (
        <PageContainer>
            <EditableProTable<API.ComboInfo>
                rowKey="id"
                scroll={{
                    x: 960,
                }}
                actionRef={actionRef}
                headerTitle="套餐列表"
                maxLength={5}
                // 关闭默认的新建按钮
                recordCreatorProps={false}
                columns={columns}
                request={async (params = {}, sort, filter) => {
                    const msg = await listCombo({
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
                            if ('tmp' === String(data.id).substring(0, String(data.id).indexOf('.'))) {
                                data.id = null;
                                const msg = await addCombo(data);
                                if (msg.code === 200) {
                                    message.success('保存成功！')
                                    return true;
                                } else {
                                    message.error('保存失败：' + msg.msg);
                                }
                            } else {
                                console.log("edit")
                                const msg = await updateCombo(data);
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
                            const msg = await removeCombo([key.toString()]);
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
                                id: "tmp." + (Math.random() * 100000).toFixed(0),
                                numSet: 1,
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

export default ComboList;
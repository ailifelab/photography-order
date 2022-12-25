
import React, { useEffect, useState } from 'react';
import moment from 'moment';

import {
    PageContainer
} from '@ant-design/pro-components';
import type { BadgeProps } from 'antd';
import { Badge, Calendar, Card, List, Button } from 'antd';
import type { Dayjs } from 'dayjs';
import { getCalendarData } from '@/services/ant-design-pro/api';

const CalendarList: React.FC = () => {
    const [lastMonth, setLastMonth] = useState<String>();
    const [monthData, setMonthData] = useState<Map<number, API.DailyOrders>>();

    const dateCellRender = (value: Dayjs) => {
        const listData: API.OrderItem[] = getListData(value);
        return (
            <List
                size="small"
                dataSource={listData}
                locale={{ emptyText: <div></div> }}
                renderItem={(item) =>
                    <List.Item>
                        <Badge status={item.picTag == 3 ? 'success' : 'processing' as BadgeProps['status']} text={item.nickname} />
                    </List.Item>}
            />
        );
    };
    const onSelectChange = (date: Dayjs) => {
        // console.log(date.format('YYYY-MM-DD'));
    }
    const getListData = (value: Dayjs) => {
        const monthStr = value.month() < 9 ? "0" + (value.month() + 1) : value.month() + 1;
        const key = monthStr + '-' + value.date();
        if (monthData) {
            const dayData: API.DailyOrders = monthData[key];
            if (dayData) {
                return dayData.orderInfoList;
            }
        }
        return [];
    };

    const runChange = (value: any) => {
        const monthNow = value.format('YYYY-MM');
        if (lastMonth !== monthNow) {
            setLastMonth(monthNow);
            const msg = getCalendarData({
                watchMonth: value.format('YYYY-MM-DD')
            });
            msg.then((res) => {
                setMonthData(res.data);
            })
        }
    }
    useEffect(() => {
        runChange(moment());
    }, [])
    return (
        <PageContainer>
            <Card size="small">
                <Calendar onSelect={onSelectChange}
                    dateCellRender={dateCellRender}
                    onChange={runChange}
                // headerRender={
                //     ({ value, type, onChange, onTypeChange }) => {
                //         return (
                //             <div className="customeHeader" style={{ padding: 8 }}>
                //                 <Button size="small" shape="circle" icon={<CaretLeftOutlined />} onClick={
                //                     () => {
                //                         let priveMonth = moment(value).subtract(1, "month");
                //                         onChange(priveMonth);
                //                     }
                //                 } />
                //                 <span className="title">{moment(value).format('YYYY年MM月')}</span>
                //                 <Button size="small" shape="circle" icon={<CaretRightOutlined />} onClick={
                //                     () => {
                //                         let nextMonth = moment(value).add(1, "month");
                //                         onChange(nextMonth);
                //                     }
                //                 } />
                //             </div>
                //         )
                //     }
                // }
                />
            </Card>
        </PageContainer>
    );
};
export default CalendarList;
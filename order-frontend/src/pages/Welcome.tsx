import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import dayjs from 'dayjs';
import { sumOrders, sumCombo } from '@/services/ant-design-pro/api';
import { message, Space } from 'antd';
import { Mix } from '@ant-design/plots';

const Welcome: React.FC = () => {
  const [timeDate, setTimeDate] = useState<string>("2019年9月28日 星期五");
  const { Statistic } = StatisticCard;
  const [responsive, setResponsive] = useState(false);

  const [orderData, setOrderData] = useState<API.StatisticsViewOrderIncome>();
  const [comboData, setComboData] = useState<API.StatisticsViewMonComboIncome[]>([]);

  const getTimeNow = (() => {
    var datas = dayjs().day()
    var week = ['日', '一', '二', '三', '四', '五', '六']
    return dayjs(`${new Date()}`).format('YYYY年MM月DD日 星期') + week[datas];
  })

  const initStatistics = (() => {
    setTimeDate(getTimeNow());
    if (!orderData) {
      sumOrders().then(result => {
        if (200 === result.code) {
          setOrderData(result.data);
        } else {
          message.error(result.code + ":" + result.msg);
        }
      }).catch(error => {
        message.error(error);
      })
    }
    if (!comboData || comboData.length === 0) {
      sumCombo().then(result => {
        if (200 === result.code) {
          setComboData(result.data);
        } else {
          message.error(result.code + ":" + result.msg);
        }
      }).catch(error => {
        message.error(error);
      })
    }
  })

  useEffect(() => {
    initStatistics();
  }, []);

  const config = {
    tooltip: false,
    legend: true,
    plots: [
      {
        type: 'pie',
        region: {
          start: {
            x: 0,
            y: 0,
          },
          end: {
            x: 0.45,
            y: 1,
          },
        },
        options: {
          data: comboData,
          angleField: 'num',
          colorField: 'comboName',
          radius: 0.85,
          tooltip: {
            showMarkers: false,
            customContent: (title, data) => {
              if (data.length) {
                return `
                <div style="margin-top: 12px;margin-bottom: 12px;list-style:none;">
                <span style="background-color:${data[0].mappingData.color};" class="g2-tooltip-marker"></span>
                ${title}: ${data[0].value}单
                </div>`;
              } else {
                return '<div></div>';
              }
            }
          },
          label: {
            type: 'inner',
            offset: '-15%',
            content: '{percentage}'
          },
          interactions: [
            {
              type: 'association-tooltip',
            },
            {
              type: 'association-selected',
            },
          ],
        },
      },
      {
        type: 'pie',
        region: {
          start: {
            x: 0.55,
            y: 0,
          },
          end: {
            x: 1,
            y: 1,
          },
        },
        options: {
          data: comboData,
          radius: 0.85,
          angleField: 'price',
          colorField: 'comboName',
          label: {
            type: 'inner',
            offset: '-15%',
            content: '￥{value}\n{percentage}'
          },
          tooltip: {
            showMarkers: false,
            text: '￥${data.value}',
            customContent: (title, data) => {
              if (data.length) {
                return `
                <div style="margin-top: 12px;margin-bottom: 12px;list-style:none;">
                <span style="background-color:${data[0].mappingData.color};" class="g2-tooltip-marker"></span>
                ${title}: ￥${data[0].value}
                </div>`;
              } else {
                return '<div></div>';
              }
            }
          },
          interactions: [
            {
              type: 'association-tooltip',
            },
            {
              type: 'association-selected',
            },
          ],
        },
      },
    ],
  };
  return (
    <PageContainer>
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setResponsive(offset.width < 596);
        }}
      >
        <ProCard
          title="数据概览"
          extra={timeDate}
          split={responsive ? 'horizontal' : 'vertical'}
          headerBordered
          bordered
        >
          <ProCard split="horizontal">
            <ProCard split="horizontal">
              <ProCard split="vertical">
                <StatisticCard
                  statistic={{
                    prefix: '¥',
                    title: '订单总金额',
                    value: (orderData?.hisTotalPrice),
                    description: <Statistic
                      prefix='¥' title="订单总收入" value={orderData?.hisIncome} />,
                  }}
                />
                <StatisticCard
                  statistic={{
                    prefix: '¥',
                    title: '订单毛利润',
                    value: (orderData?.hisGrossProfit),
                    description: <Statistic prefix='¥' title="订单支出" value={orderData?.hisExpenditure} />,
                  }}
                />
              </ProCard>
              <ProCard split="vertical">
                <StatisticCard
                  statistic={{
                    prefix: '¥',
                    title: '年订单总金额',
                    value: (orderData?.yearTotalPrice),
                    description: <Statistic
                      prefix='¥' title="年订单总收入" value={orderData?.yearIncome} />,
                  }}
                />
                <StatisticCard
                  statistic={{
                    prefix: '¥',
                    title: '年订单毛利润',
                    value: (orderData?.yearGrossProfit),
                    description: <Statistic prefix='¥' title="年订单支出" value={orderData?.yearExpenditure} />,
                  }}
                />
              </ProCard>
              <ProCard split="vertical">
                <StatisticCard
                  statistic={{
                    prefix: '¥',
                    title: '季度订单总金额',
                    value: (orderData?.quarterTotalPrice),
                    description: <Statistic
                      prefix='¥' title="季度订单总收入" value={orderData?.quarterIncome} />,
                  }}
                />
                <StatisticCard
                  statistic={{
                    prefix: '¥',
                    title: '季度订单毛利润',
                    value: (orderData?.quarterGrossProfit),
                    description: <Statistic prefix='¥' title="季度订单支出" value={orderData?.quarterExpenditure} />,
                  }}
                />
              </ProCard>
            </ProCard>
            <StatisticCard
              chart={
                <img
                  src="https://gw.alipayobjects.com/zos/alicdn/zevpN7Nv_/xiaozhexiantu.svg"
                  alt="折线图"
                  width="100%"
                />
              }
            />
          </ProCard>
          <ProCard split="horizontal">
            <ProCard split="horizontal">
              <ProCard split="vertical">
                <StatisticCard
                  statistic={{
                    prefix: '¥',
                    title: '本月订单总金额',
                    value: (orderData?.monTotalPrice)
                  }}
                />
                <StatisticCard
                  statistic={{
                    prefix: '¥',
                    title: '本月订单总收入',
                    value: (orderData?.monIncome),
                    description: <Statistic prefix='¥' title="本月订单总支出" value={orderData?.monExpenditure} />,
                  }}
                />
              </ProCard>

              <StatisticCard statistic={{
                prefix: '¥', title: "本月订单毛利润",
                value: (orderData?.monIncome),

                description: (
                  <Space>
                    <Statistic
                      prefix='¥' title="本月毛利润同比" value={orderData?.yearOnYearGrossProfit}
                      trend={orderData?.yearOnYearGrossProfit > 0 ? "up" : "down"} />
                    <Statistic
                      prefix='¥' title="本月毛利润环比" value={orderData?.monOnMonGrossProfit}
                      trend={orderData?.monOnMonGrossProfit > 0 ? "up" : "down"} />
                  </Space>),
              }} />
            </ProCard>
            <ProCard title="套餐占比情况" split="horizontal">
              <Mix {...config} />
            </ProCard>
          </ProCard>
        </ProCard>
      </RcResizeObserver>
    </PageContainer>
  );
};
export default Welcome;

package com.ailifelab.photograph.service;

import com.ailifelab.photograph.entity.common.ResultData;
import com.ailifelab.photograph.entity.dto.DailyOrdersDTO;
import com.ailifelab.photograph.entity.dto.OrderInfoDTO;
import com.ailifelab.photograph.entity.dto.OrderQueryDTO;
import com.ailifelab.photograph.entity.po.OrderInfo;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.List;
import java.util.Map;

public interface OrderService {
    ResultData<Page<OrderInfo>> listOrders(OrderQueryDTO orderQueryDTO);

    ResultData<OrderInfoDTO> newOrder(OrderInfoDTO orderInfo);

    ResultData<Page<OrderInfo>> deleteOrders(List<String> orderIds);

    ResultData<Page<OrderInfo>> suspendOrders(List<String> orderIds);

    ResultData<OrderInfoDTO> editOrder(OrderInfoDTO orderInfo);

    ResultData<OrderInfoDTO> details(String orderId);

    ResultData<Map<String, DailyOrdersDTO>> calendarList(OrderQueryDTO orderQueryDTO);

    ResultData<OrderInfoDTO> checkAppointment(OrderInfoDTO orderInfoDTO);
}

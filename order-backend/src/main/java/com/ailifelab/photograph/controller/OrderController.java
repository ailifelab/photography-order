package com.ailifelab.photograph.controller;

import com.ailifelab.photograph.entity.common.ResultData;
import com.ailifelab.photograph.entity.dto.DailyOrdersDTO;
import com.ailifelab.photograph.entity.dto.OrderInfoDTO;
import com.ailifelab.photograph.entity.dto.OrderQueryDTO;
import com.ailifelab.photograph.entity.po.OrderInfo;
import com.ailifelab.photograph.service.OrderService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {
    @Resource
    private OrderService orderService;

    /**
     * 订单列表
     */
    @PostMapping("list")
    public ResultData<Page<OrderInfo>> listOrders(@RequestBody OrderQueryDTO orderQueryDTO) {
        return orderService.listOrders(orderQueryDTO);
    }

    /**
     * 新增订单
     */
    @PostMapping("new")
    public ResultData<OrderInfoDTO> newOrder(@RequestBody OrderInfoDTO orderInfo) {
        return orderService.newOrder(orderInfo);
    }

    /**
     * 删除订单
     */
    @DeleteMapping("delete")
    public ResultData<Page<OrderInfo>> deleteOrders(@RequestBody List<String> orderIds) {
        return orderService.deleteOrders(orderIds);
    }

    /**
     * 作废订单
     */
    @DeleteMapping("suspend")
    public ResultData<Page<OrderInfo>> suspendOrders(@RequestBody List<String> orderIds) {
        return orderService.suspendOrders(orderIds);
    }

    /**
     * 修改订单
     */
    @PostMapping("edit")
    public ResultData<OrderInfoDTO> editOrder(@RequestBody OrderInfoDTO orderInfo) {
        return orderService.editOrder(orderInfo);
    }

    /**
     * 查看订单明细
     */
    @GetMapping("details/{orderId}")
    public ResultData<OrderInfoDTO> details(@PathVariable("orderId") String orderId) {
        return orderService.details(orderId);
    }

    /**
     * 按日历查看订单
     */
    @PostMapping("calendar")
    public ResultData<Map<String, DailyOrdersDTO>> calendarList(@RequestBody OrderQueryDTO orderQueryDTO) {
        return orderService.calendarList(orderQueryDTO);
    }

    @PostMapping("calendar/check")
    public ResultData<OrderInfoDTO> checkAppointment(@RequestBody OrderInfoDTO orderInfoDTO){
        return orderService.checkAppointment(orderInfoDTO);
    }
}

package com.ailifelab.photograph.service.impl;

import com.ailifelab.photograph.entity.common.ResultData;
import com.ailifelab.photograph.entity.dto.*;
import com.ailifelab.photograph.entity.po.*;
import com.ailifelab.photograph.repository.AppointmentInfoRepo;
import com.ailifelab.photograph.repository.MemberInfoRepo;
import com.ailifelab.photograph.repository.OrderInfoDetailRepo;
import com.ailifelab.photograph.repository.OrderInfoRepo;
import com.ailifelab.photograph.service.ComboService;
import com.ailifelab.photograph.service.OrderService;
import com.ailifelab.photograph.utils.DateUtils;
import com.ailifelab.photograph.utils.SessionUtils;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
@Service
public class OrderServiceImpl implements OrderService {
    @Resource
    private OrderInfoRepo orderInfoRepo;
    @Resource
    private MemberInfoRepo memberInfoRepo;
    @Resource
    private OrderInfoDetailRepo orderInfoDetailRepo;
    @Resource
    private ComboService comboService;
    @Resource
    private AppointmentInfoRepo appointmentInfoRepo;

    @Override
    public ResultData<Page<OrderInfo>> listOrders(OrderQueryDTO orderQueryDTO) {
        LambdaQueryWrapper<OrderInfo> queryWrapper = new LambdaQueryWrapper<OrderInfo>().ne(OrderInfo::getDeleteTag, 1)
                .like(StringUtils.isNotBlank(orderQueryDTO.getNickname()), OrderInfo::getNickname, orderQueryDTO.getNickname())
                .like(orderQueryDTO.getMsisdn() != null, OrderInfo::getMsisdn, orderQueryDTO.getMsisdn())
                .gt(orderQueryDTO.getBalancePayed() != null && 1 == orderQueryDTO.getBalancePayed(), OrderInfo::getBalancePayment, 0)
                .gt(orderQueryDTO.getTotalPriceLower() != null, OrderInfo::getTotalPrice, orderQueryDTO.getTotalPriceLower())
                .eq(orderQueryDTO.getFinishedTag() != null, OrderInfo::getFinishedTag, orderQueryDTO.getFinishedTag())
                .lt(orderQueryDTO.getTotalPriceUpper() != null, OrderInfo::getTotalPrice, orderQueryDTO.getTotalPriceUpper())
                .orderByDesc(OrderInfo::getOrderNum);
        Integer pageNum = orderQueryDTO.getPageNum();
        Integer pageSize = orderQueryDTO.getPageSize();
        if (pageNum == null) {
            pageNum = 1;
        }
        if (pageSize == null) {
            pageSize = 10;
        }
        Page<OrderInfo> all = this.orderInfoRepo.selectPage(new Page<>(pageNum, pageSize), queryWrapper);
        return ResultData.success(all);
    }

    @Transactional
    @Override
    public ResultData<OrderInfoDTO> newOrder(OrderInfoDTO orderInfoDTO) {
        if (orderInfoDTO.getDeposit() == null) {
            return ResultData.fail("请填写定金！");
        }
        Long memberId = orderInfoDTO.getMemberId();
        Date createTime = new Date();
        if (memberId != null) {
            MemberInfo memberInfo = this.memberInfoRepo.selectById(memberId);
            if (memberInfo == null) {
                return ResultData.fail("无效的会员信息，请重新选择！");
            } else {
                orderInfoDTO.setNickname(memberInfo.getNickname());
                orderInfoDTO.setXiaoHongShu(memberInfo.getXiaoHongShu());
                orderInfoDTO.setWechat(memberInfo.getWechat());
                orderInfoDTO.setEmail(memberInfo.getEmail());
                orderInfoDTO.setQqNumber(memberInfo.getQqNumber());
            }
        } else {
            return ResultData.fail("请选择会员！");
        }
        List<OrderInfoDetailDTO> comboList = orderInfoDTO.getComboList();
        if (comboList == null || comboList.isEmpty()) {
            return ResultData.fail("请选择套餐！");
        } else {
            long size = comboList.stream().filter(detail -> {
                ComboInfo comboInfo = this.comboService.getComboById(detail.getComboId());
                return comboInfo == null;
            }).count();
            if (size > 0) {
                return ResultData.fail("错误的套餐信息，请重选套餐后保存！");
            }
        }
        orderInfoDTO.setOrderTime(createTime);
        if (orderInfoDTO.getTotalPrice() != null && orderInfoDTO.getDeposit() != null) {
            orderInfoDTO.setBalanceToPay(orderInfoDTO.getTotalPrice() - orderInfoDTO.getDeposit());
        }
        orderInfoDTO.setIncome(orderInfoDTO.getDeposit());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        String idSuffix = sdf.format(createTime);
        String orderId = idSuffix + "000";
        orderInfoDTO.setOrderNum(orderId);
        for (int idExtend = 0; idExtend < 999; idExtend++) {
            orderId = idSuffix + String.format("%03d", idExtend);
            OrderInfo oldOrder = this.orderInfoRepo.selectOne(new LambdaQueryWrapper<OrderInfo>().eq(OrderInfo::getOrderNum, orderId));
            if (oldOrder == null) {
                orderInfoDTO.setOrderNum(orderId);
                break;
            }
        }
        orderInfoDTO.setDeleteTag(0);
        OrderInfo orderInfo = new OrderInfo();
        BeanUtils.copyProperties(orderInfoDTO, orderInfo);
        this.orderInfoRepo.insert(orderInfo);
        //新增关联套餐信息
        /*for (OrderInfoDetailDTO detail : comboList) {
            ComboInfo comboInfo = this.comboService.getComboById(detail.getComboId());
            OrderInfoDetail result = new OrderInfoDetail();
            BeanUtils.copyProperties(detail, result);
            result.setOrderNum(orderNum);
            result.setAmount(comboInfo.getNumSet());
            result.setPrice(comboInfo.getPrice());
            result.setCreateTime(createTime);
            this.orderInfoDetailRepo.insert(result);
            //新增关联预约信息
            List<AppointmentInfo> appointmentInfoList = detail.getAppointmentInfo();
            if (appointmentInfoList != null && !appointmentInfoList.isEmpty()) {
                for (AppointmentInfo appointmentInfo : appointmentInfoList) {
                    appointmentInfo.setOrderNum(orderNum);
                    appointmentInfo.setOrderInfoDetailId(result.getId());
                    appointmentInfo.setUpdateTime(createTime);
                    this.appointmentInfoRepo.insert(appointmentInfo);
                }
            }
        }*/
        this.insertOrderInfoDetail(orderId, comboList, createTime);
        return ResultData.success(orderInfoDTO);
    }

    private void insertOrderInfoDetail(String orderNum, List<OrderInfoDetailDTO> orderInfoDetailDTOList, Date createTime) {
        for (OrderInfoDetailDTO detail : orderInfoDetailDTOList) {
            ComboInfo comboInfo = this.comboService.getComboById(detail.getComboId());
            OrderInfoDetail result = new OrderInfoDetail();
            BeanUtils.copyProperties(detail, result);
            result.setOrderNum(orderNum);
            result.setAmount(comboInfo.getNumSet());
            result.setPrice(comboInfo.getPrice());
            result.setCreateTime(createTime);
            this.orderInfoDetailRepo.insert(result);
            //新增关联预约信息
            List<AppointmentInfo> appointmentInfoList = detail.getAppointmentInfo();
            if (appointmentInfoList != null && !appointmentInfoList.isEmpty()) {
                for (AppointmentInfo appointmentInfo : appointmentInfoList) {
                    appointmentInfo.setOrderNum(orderNum);
                    appointmentInfo.setOrderInfoDetailId(result.getId());
                    appointmentInfo.setUpdateTime(createTime);
                    this.appointmentInfoRepo.insert(appointmentInfo);
                }
            }
        }
    }

    @Override
    public ResultData<Page<OrderInfo>> deleteOrders(List<String> orderIds) {
        this.orderInfoRepo.deleteBatchIds(orderIds);
        this.orderInfoDetailRepo.delete(new LambdaQueryWrapper<OrderInfoDetail>().in(OrderInfoDetail::getOrderNum, orderIds));
        this.appointmentInfoRepo.delete(new LambdaQueryWrapper<AppointmentInfo>().in(AppointmentInfo::getOrderNum, orderIds));
        OrderQueryDTO orderQueryDTO = new OrderQueryDTO();
        orderQueryDTO.setPageNum(1);
        orderQueryDTO.setPageSize(10);
        return this.listOrders(orderQueryDTO);
    }

    @Override
    public ResultData<Page<OrderInfo>> suspendOrders(List<String> orderIds) {
        OrderInfo orderInfo = new OrderInfo();
        orderInfo.setDeleteTag(1);
        orderInfo.setDeleteTime(new Date());
        this.orderInfoRepo.update(orderInfo, new LambdaQueryWrapper<OrderInfo>().in(OrderInfo::getOrderNum, orderIds));
        OrderQueryDTO orderQueryDTO = new OrderQueryDTO();
        orderQueryDTO.setPageNum(1);
        orderQueryDTO.setPageSize(10);
        return this.listOrders(orderQueryDTO);
    }

    @Transactional
    @Override
    public ResultData<OrderInfoDTO> editOrder(OrderInfoDTO orderInfoDTO) {
        String orderId = orderInfoDTO.getOrderNum();
        if (orderId == null) {
            return ResultData.fail("请指定要修改的订单号！");
        } else {
            OrderInfo data = this.orderInfoRepo.selectById(orderId);
            if (data == null) {
                return ResultData.fail("该订单不存在！");
            } else if (1 == data.getFinishedTag()) {
                return ResultData.success(orderInfoDTO, "已完成的订单无需修改！");
            }
        }
        Date updateTime = new Date();
        List<AppointmentInfo> updateAppointmentInfoList = new ArrayList<>();
        List<Long> editDetailIds = new ArrayList<>();
        List<OrderInfoDetailDTO> newOrderInfoDetailDTOList = new ArrayList<>();
        List<Integer> picTags = new ArrayList<>();
        for (OrderInfoDetailDTO orderInfoDetailDTO : orderInfoDTO.getComboList()) {
            if (orderInfoDetailDTO.getId() != null) {
                //更新已有的记录
                for (AppointmentInfo appointmentInfo : orderInfoDetailDTO.getAppointmentInfo()) {
                    picTags.add(appointmentInfo.getPicTag());
                    if (appointmentInfo.getOrderInfoDetailId() != null) {
                        appointmentInfo.setUpdateTime(updateTime);
                        updateAppointmentInfoList.add(appointmentInfo);
                        this.appointmentInfoRepo.updateById(appointmentInfo);
                    } else {
                        appointmentInfo.setOrderNum(orderId);
                        appointmentInfo.setOrderInfoDetailId(orderInfoDetailDTO.getId());
                        appointmentInfo.setUpdateTime(updateTime);
                        this.appointmentInfoRepo.insert(appointmentInfo);
                        updateAppointmentInfoList.add(appointmentInfo);
                    }
                    OrderInfoDetail orderInfoDetail = new OrderInfoDetail();
                    BeanUtils.copyProperties(orderInfoDetailDTO, orderInfoDetail);
                    editDetailIds.add(orderInfoDetail.getId());
                    this.orderInfoDetailRepo.updateById(orderInfoDetail);
                }
            } else {
                //需要插入的记录
                newOrderInfoDetailDTOList.add(orderInfoDetailDTO);
                picTags.addAll(orderInfoDetailDTO.getAppointmentInfo().stream().map(AppointmentInfo::getPicTag).toList());
            }
        }
        //删除多余的记录
        LambdaQueryWrapper<OrderInfoDetail> orderInfoDetailQueryWrapper = new LambdaQueryWrapper<OrderInfoDetail>().eq(OrderInfoDetail::getOrderNum, orderId);
        if (!editDetailIds.isEmpty()) {
            orderInfoDetailQueryWrapper.notIn(OrderInfoDetail::getId, editDetailIds);
        }
        this.orderInfoDetailRepo.delete(orderInfoDetailQueryWrapper);
        List<Long> editAppointmentIds = updateAppointmentInfoList.stream().map(AppointmentInfo::getId).toList();
        LambdaQueryWrapper<AppointmentInfo> appointmentInfoQueryWrapper = new LambdaQueryWrapper<AppointmentInfo>().eq(AppointmentInfo::getOrderNum, orderId);
        if (!editAppointmentIds.isEmpty()) {
            appointmentInfoQueryWrapper.notIn(AppointmentInfo::getId, editAppointmentIds);
        }
        this.appointmentInfoRepo.delete(appointmentInfoQueryWrapper);
        //追加新记录
        insertOrderInfoDetail(orderId, newOrderInfoDetailDTOList, updateTime);

        OrderInfo orderInfo = new OrderInfo();
        BeanUtils.copyProperties(orderInfoDTO, orderInfo);
        orderInfo.setLastUpdateTime(updateTime);
        orderInfo.setLastUpdateUser(SessionUtils.getUser().getId());
        long picTag0 = picTags.stream().filter(data -> 0 == data || 1 == data).count();
        long picTag1 = picTags.stream().filter(data -> 2 == data).count();
        long picTag2 = picTags.stream().filter(data -> 3 == data).count();
        if (picTag1 > 0) {
            orderInfo.setFinishedTag(2);
        } else if (picTag2 == 0) {
            orderInfo.setFinishedTag(0);
        } else if (picTag0 == 0) {
            orderInfo.setFinishedTag(1);
        }
        this.orderInfoRepo.updateById(orderInfo);
        return this.details(orderId);
    }

    @Override
    public ResultData<OrderInfoDTO> details(String orderNum) {
        OrderInfo data = this.orderInfoRepo.selectById(orderNum);
        //获取关联套餐明细信息
        List<OrderInfoDetail> orderInfoDetails = this.orderInfoDetailRepo.selectList(new LambdaQueryWrapper<OrderInfoDetail>().eq(OrderInfoDetail::getOrderNum, orderNum));
        List<OrderInfoDetailDTO> orderInfoDetailDTOList = new ArrayList<>();
        for (OrderInfoDetail orderInfoDetail : orderInfoDetails) {
            OrderInfoDetailDTO orderInfoDetailDTO = new OrderInfoDetailDTO();
            BeanUtils.copyProperties(orderInfoDetail, orderInfoDetailDTO);
            List<AppointmentInfo> appointmentInfoList = this.appointmentInfoRepo.selectList(new LambdaQueryWrapper<AppointmentInfo>().eq(AppointmentInfo::getOrderInfoDetailId, orderInfoDetail.getId()));
            orderInfoDetailDTO.setAppointmentInfo(appointmentInfoList);
            orderInfoDetailDTOList.add(orderInfoDetailDTO);
        }
        OrderInfoDTO orderInfoDTO = new OrderInfoDTO();
        BeanUtils.copyProperties(data, orderInfoDTO);
        orderInfoDTO.setComboList(orderInfoDetailDTOList);
        return ResultData.success(orderInfoDTO);
    }

    @Override
    public ResultData<Map<String, DailyOrdersDTO>> calendarList(OrderQueryDTO orderQueryDTO) {
        Date watchMonth = orderQueryDTO.getWatchMonth();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(watchMonth);
        String year = Integer.toString(calendar.get(Calendar.YEAR));
        String month = Integer.toString(calendar.get(Calendar.MONTH) + 1);
        month = month.length() == 1 ? "0" + month : month;
        String monthPriv = Integer.toString(calendar.get(Calendar.MONTH) == Calendar.JANUARY ? Calendar.DECEMBER : calendar.get(Calendar.MONTH));
        monthPriv = monthPriv.length() == 1 ? "0" + monthPriv : monthPriv;
        String monthNext = Integer.toString(calendar.get(Calendar.MONTH) == Calendar.DECEMBER ? Calendar.JANUARY + 1 : calendar.get(Calendar.MONTH) + 2);
        monthNext = monthNext.length() == 1 ? "0" + monthNext : monthNext;
        List<AppointmentInfo> appointments = this.appointmentInfoRepo.selectMonth(year, month);
        List<AppointmentInfo> appointmentsPriv = this.appointmentInfoRepo.selectMonth(year, monthPriv);
        List<AppointmentInfo> appointmentsNext = this.appointmentInfoRepo.selectMonth(year, monthNext);
        List<String> orderNums = new ArrayList<>(appointments.stream().map(AppointmentInfo::getOrderNum).toList());
        List<String> orderNums1 = appointmentsPriv.stream().map(AppointmentInfo::getOrderNum).toList();
        List<String> orderNums2 = appointmentsNext.stream().map(AppointmentInfo::getOrderNum).toList();
        if (!orderNums1.isEmpty()) {
            orderNums.addAll(orderNums1);
        }
        if (!orderNums2.isEmpty()) {
            orderNums.addAll(orderNums2);
        }
        List<String> orderNumUse = orderNums.stream().distinct().toList();
        Map<String, DailyOrdersDTO> appointmentMap = new HashMap<>();
        if (!orderNumUse.isEmpty()) {
            List<OrderInfo> orderInfoList = this.orderInfoRepo.selectBatchIds(orderNumUse);
            this.getAppointments(appointmentMap, appointments, orderInfoList, month);
            this.getAppointments(appointmentMap, appointmentsPriv, orderInfoList, monthPriv);
            this.getAppointments(appointmentMap, appointmentsNext, orderInfoList, monthNext);
        }
        return ResultData.success(appointmentMap);
    }

    @Override
    public ResultData<OrderInfoDTO> checkAppointment(OrderInfoDTO orderInfoDTO) {
        List<Date> appointmentTime = new ArrayList<>();
        for (OrderInfoDetailDTO orderInfoDetail : orderInfoDTO.getComboList()) {
            List<Date> appointments = orderInfoDetail.getAppointmentInfo().stream().map(AppointmentInfo::getAppointmentTime)
                    .filter(Objects::nonNull).distinct().toList();
            if (!appointments.isEmpty()) {
                appointmentTime.addAll(appointments);
            }
        }
        List<Date> appointmentsDate = appointmentTime.stream().map(DateUtils::getStartOfDay).distinct().toList();
        if (appointmentsDate.isEmpty()) {
            return ResultData.success(null, "暂未预约拍照。");
        } else {
            List<AppointmentInfo> appointmentInfoList = new ArrayList<>();
            for (Date appointmentDate : appointmentsDate) {
                String orderNum = orderInfoDTO.getOrderNum();
                LambdaQueryWrapper<AppointmentInfo> wrapper = new LambdaQueryWrapper<>();
                if (orderNum != null) {
                    wrapper.ne(AppointmentInfo::getOrderNum, orderNum);
                }
                wrapper.between(AppointmentInfo::getAppointmentTime, DateUtils.getStartOfDay(appointmentDate), DateUtils.getEndOfDay(appointmentDate));
                List<AppointmentInfo> appointmentInfos = this.appointmentInfoRepo.selectList(wrapper);
                if (!appointmentInfos.isEmpty()) {
                    appointmentInfoList.addAll(appointmentInfos);
                }
            }
            if (appointmentInfoList.isEmpty()) {
                return ResultData.success(null, "预约成功！");
            } else {
                List<String> orderNums = appointmentInfoList.stream().map(AppointmentInfo::getOrderNum).distinct().toList();
                List<OrderInfo> orderInfoList = this.orderInfoRepo.selectBatchIds(orderNums);
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                List<String> timeStr = appointmentInfoList.stream().map(AppointmentInfo::getAppointmentTime).map(sdf::format).distinct().toList();
                List<String> nameAndNum = orderInfoList.stream().map(data -> data.getOrderNum() + ":" + data.getNickname()).toList();
                String msg = "以下时间已预约：" + StringUtils.join(timeStr, ",") + ";订单信息：" + StringUtils.join(nameAndNum, ",");
                ResultData<OrderInfoDTO> resultData = ResultData.success(null, msg);
                resultData.setCode(220);
                return resultData;
            }
        }
    }

    private Map<String, DailyOrdersDTO> getAppointments(Map<String, DailyOrdersDTO> appointmentMap, List<AppointmentInfo> appointments, List<OrderInfo> orderInfoList, String month) {
        Calendar calendar = Calendar.getInstance();
        for (AppointmentInfo appointmentInfo : appointments) {
            Date appointmentDate = appointmentInfo.getAppointmentTime();
            calendar.setTime(appointmentDate);
            int date = calendar.get(Calendar.DATE);
            String key = month + "-" + date;
            DailyOrdersDTO orders = appointmentMap.get(key);
            DailyAppointmentDTO dailyAppointmentDTO = new DailyAppointmentDTO();
            BeanUtils.copyProperties(appointmentInfo, dailyAppointmentDTO);
            OrderInfo orderInfo = this.getOrderInfoFromList(appointmentInfo.getOrderNum(), orderInfoList);
            if (orderInfo == null || 1 == orderInfo.getDeleteTag()) {
                continue;
            }
            dailyAppointmentDTO.setNickname(orderInfo.getNickname());
            dailyAppointmentDTO.setMemberId(orderInfo.getMemberId());
            if (orders == null) {
                orders = new DailyOrdersDTO();
                List<DailyAppointmentDTO> appointmentList = new ArrayList<>();
                appointmentList.add(dailyAppointmentDTO);
                orders.setDate(appointmentDate);
                orders.setMonth(month);
                orders.setWeek(calendar.get(Calendar.DAY_OF_WEEK));
                orders.setOrderInfoList(appointmentList);
            } else {
                List<DailyAppointmentDTO> appointmentList = orders.getOrderInfoList();
                appointmentList.add(dailyAppointmentDTO);
                orders.setOrderInfoList(appointmentList);
            }
            appointmentMap.put(key, orders);
        }
        return appointmentMap;
    }

    private OrderInfo getOrderInfoFromList(String orderNum, List<OrderInfo> orderInfoList) {
        for (OrderInfo orderInfo : orderInfoList) {
            if (orderNum.equals(orderInfo.getOrderNum())) {
                return orderInfo;
            }
        }
        return null;
    }

    private void createNewMember(OrderInfo orderInfo, Date createTime) {
        MemberInfo newMember = new MemberInfo();
        newMember.setNickname(orderInfo.getNickname());
        newMember.setMsisdn(orderInfo.getMsisdn());
        newMember.setEmail(orderInfo.getEmail());
        newMember.setGender(orderInfo.getGender());
        newMember.setWechat(orderInfo.getWechat());
        newMember.setQqNumber(orderInfo.getQqNumber());
        newMember.setXiaoHongShu(orderInfo.getXiaoHongShu());
        newMember.setRegisterDate(createTime);
        this.memberInfoRepo.insert(newMember);
        orderInfo.setMemberId(newMember.getMemberId());
    }
}

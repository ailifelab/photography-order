package com.ailifelab.photograph.entity.dto;

import com.ailifelab.photograph.entity.po.OrderInfo;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class DailyOrdersDTO {
    private Date date;
    private String month;
    private Integer week;
    private List<DailyAppointmentDTO> orderInfoList;
}

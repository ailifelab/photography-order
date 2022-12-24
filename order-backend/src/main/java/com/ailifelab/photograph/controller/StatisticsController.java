package com.ailifelab.photograph.controller;

import com.ailifelab.photograph.entity.common.ResultData;
import com.ailifelab.photograph.entity.po.StatisticsViewMonComboIncome;
import com.ailifelab.photograph.entity.po.StatisticsViewOrderIncome;
import com.ailifelab.photograph.repository.StatisticsViewMonComboIncomeRepo;
import com.ailifelab.photograph.repository.StatisticsViewOrderIncomeRepo;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/statistics")
public class StatisticsController {
    @Resource
    private StatisticsViewMonComboIncomeRepo statisticsViewMonComboIncomeRepo;
    @Resource
    private StatisticsViewOrderIncomeRepo statisticsViewOrderIncomeRepo;

    @GetMapping("/combo")
    public ResultData<List<StatisticsViewMonComboIncome>> getStatisticsViewMonComboIncome() {
        List<StatisticsViewMonComboIncome> data = this.statisticsViewMonComboIncomeRepo.selectList(new LambdaQueryWrapper<>());
        return ResultData.success(data);
    }

    @GetMapping("/order")
    public ResultData<StatisticsViewOrderIncome> getStatisticsViewOrderIncome() {
        List<StatisticsViewOrderIncome> data = this.statisticsViewOrderIncomeRepo.selectList(new LambdaQueryWrapper<>());
        if (!data.isEmpty()) {
            return ResultData.success(data.get(0));
        } else {
            return ResultData.success(new StatisticsViewOrderIncome());
        }
    }
}

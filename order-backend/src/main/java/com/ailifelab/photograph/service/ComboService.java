package com.ailifelab.photograph.service;

import com.ailifelab.photograph.entity.common.ResultData;
import com.ailifelab.photograph.entity.dto.ComboInfoDTO;
import com.ailifelab.photograph.entity.po.ComboInfo;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.List;

public interface ComboService {
    ResultData<ComboInfo> addCombo(ComboInfo comboInfo);

    ResultData<Page<ComboInfo>> deleteCombo(List<Long> comboIds);

    ResultData<ComboInfo> editCombo(ComboInfo comboInfo);

    ResultData<ComboInfo> details(Long comboId);

    ResultData<Page<ComboInfo>> list(ComboInfoDTO comboInfo);

    ResultData<List<ComboInfo>> selectMembers(ComboInfoDTO comboInfo);

    ComboInfo getComboById(Long comboId);
}

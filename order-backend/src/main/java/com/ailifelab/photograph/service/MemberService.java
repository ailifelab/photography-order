package com.ailifelab.photograph.service;

import com.ailifelab.photograph.entity.common.ResultData;
import com.ailifelab.photograph.entity.dto.MemberInfoDTO;
import com.ailifelab.photograph.entity.po.MemberInfo;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.List;

public interface MemberService {
    ResultData<Page<MemberInfo>> list(MemberInfoDTO memberInfo);

    ResultData<MemberInfo> newMember(MemberInfo memberInfo);

    ResultData<List<MemberInfo>> deleteMembers(List<Long> memberIds);

    ResultData<MemberInfo> editMember(MemberInfo memberInfo);

    ResultData<MemberInfo> details(Long memberId);

    ResultData<List<MemberInfo>> selectMembers(MemberInfoDTO memberInfo);
}

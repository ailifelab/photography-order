package com.ailifelab.photograph.test;

import com.ailifelab.photograph.utils.PasswdUtils;
import org.junit.jupiter.api.Test;

public class UserTest {
    @Test
    public void genPwd(){
        String encPwd = PasswdUtils.getMd5Pwd("123" + "xx5x");
        System.out.println(encPwd);
    }
}

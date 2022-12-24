package com.ailifelab.photograph.utils;

import org.springframework.util.DigestUtils;

import java.util.Random;

public class PasswdUtils {
    public static String getRandomString(int length) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int number = random.nextInt(3);
            long result = 0;
            switch (number) {
                case 0 -> {
                    result = Math.round(Math.random() * 25 + 65);
                    sb.append((char) result);
                }
                case 1 -> {
                    result = Math.round(Math.random() * 25 + 97);
                    sb.append((char) result);
                }
                case 2 -> sb.append(new Random().nextInt(10));
            }
        }
        return sb.toString();
    }

    public static String getMd5Pwd(String password) {
        return DigestUtils.md5DigestAsHex(password.getBytes());
    }
}

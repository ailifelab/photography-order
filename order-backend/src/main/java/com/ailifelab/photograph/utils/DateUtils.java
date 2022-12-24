package com.ailifelab.photograph.utils;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;

public class DateUtils {

    /**
     * 获得某天最大时间 2022-11-11 23:59:59
     * @param date
     * @return
     */
    public static Date getEndOfDay(Date date) {

        if (date == null) date = new Date();
        LocalDateTime localDateTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(date.getTime()), ZoneId.systemDefault());;
        LocalDateTime endOfDay = localDateTime.with(LocalTime.MAX);
        return Date.from(endOfDay.atZone(ZoneId.systemDefault()).toInstant());
    }

    /**
     * 获得某天最小时间 2022-11-11 00:00:00
     * @param date
     * @return
     */
    public static Date getStartOfDay(Date date) {
        if (date == null) date = new Date();
        LocalDateTime localDateTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(date.getTime()), ZoneId.systemDefault());
        LocalDateTime startOfDay = localDateTime.with(LocalTime.MIN);
        return Date.from(startOfDay.atZone(ZoneId.systemDefault()).toInstant());
    }


    /**
     * 获得某小时的开始时间
     * @param date
     * @return
     */
    public static Date getStarOfHour(Date date) {

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

    /**
     * 获得某小时的结束时间
     * @param date
     * @return
     */
    public static Date getEndOfHour(Date date) {

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        return calendar.getTime();
    }

    /**
     * 获得某天的前后多少天的时间
     * @param date
     * @return
     */
    public static Date getNumOfDay(Date date, int num) {

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, num);
        return calendar.getTime();
    }

    /**
     * 获得某天的前后多少小时时间
     * @param date
     * @return
     */
    public static Date getNumOfHour(Date date, int num) {

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR, calendar.get(Calendar.HOUR) + num);
        return calendar.getTime();
    }

    /**
     * 获取时间对应的字符串
     * @param date
     * @param pattern
     * @return
     */
    public static String getDatePatternStr (Date date, String pattern) {

        if (pattern == null) {
            pattern = "yyyy-MM-dd HH:mm:ss";
        }

        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        return sdf.format(date);
    }
}

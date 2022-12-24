-- photo_order.order_info definition

-- Drop table

-- DROP TABLE photo_order.order_info;

CREATE TABLE order_info (
	order_num varchar(200) NOT NULL,
    order_time timestamp,
    nickname varchar(20) NOT NULL,
    member_id int8,
    msisdn varchar(30) ,
    wechat varchar(30) ,
    qq_number varchar(30) ,
    xiao_hong_shu varchar(30) ,
    email varchar(100) ,
    gender varchar(6) ,
    deposit float8 DEFAULT 0,
    balance_to_pay float8 DEFAULT 0,
    total_price float8 DEFAULT 0,
    package_remarks varchar(255) ,
    appointment_time timestamp,
    topic_detail varchar(255) ,
    balance_payment float8 DEFAULT 0,
    balance_payment_time timestamp,
    expenditure float8,
    expenditure_remarks varchar(255) ,
    income float8 DEFAULT 0,
    finished_tag int2 DEFAULT 0,
    delete_tag int4 DEFAULT 0,
    delete_time timestamp,
    last_update_time timestamp,
    last_update_user bigint,
	CONSTRAINT order_info_pkey PRIMARY KEY (order_num)
);
comment on table order_info is '订单基础信息';
comment on column order_info.order_num is '订单编号';
comment on column order_info.order_time is '预定时间';
comment on column order_info.nickname is '昵称/姓名';
comment on column order_info.member_id is '会员编号';
comment on column order_info.msisdn is '预定人手机号';
comment on column order_info.wechat is '预定人微信';
comment on column order_info.qq_number is '预定人QQ';
comment on column order_info.xiao_hong_shu is '预定人小红书';
comment on column order_info.email is '邮箱地址';
comment on column order_info.gender is '预定人性别';
comment on column order_info.deposit is '定金';
comment on column order_info.balance_to_pay is '应付尾款';
comment on column order_info.total_price is '订单总额';
comment on column order_info.package_remarks is '预定套餐情况';
comment on column order_info.appointment_time is '预约拍照时间';
comment on column order_info.topic_detail is '预约主题备注';
comment on column order_info.balance_payment is '已收尾款';
comment on column order_info.balance_payment_time is '尾款收入时间';
comment on column order_info.expenditure is '额外支出费用';
comment on column order_info.expenditure_remarks is '额外支出备注';
comment on column order_info.income is '合计收入';
comment on column order_info.finished_tag is '办结标记';
comment on column order_info.delete_tag is '作废标记';
comment on column order_info.delete_time is '作废时间';
comment on column order_info.last_update_time is '上次操作时间';
comment on column order_info.last_update_user is '上次操作人员';


-- photo_order.member_info definition

-- Drop table

-- DROP TABLE photo_order.member_info;

CREATE TABLE member_info (
	member_id bigserial,
    nickname varchar(20) NOT NULL,
    msisdn varchar(30) ,
    wechat varchar(30) ,
    qq_number varchar(30) ,
    xiao_hong_shu varchar(30) ,
    email varchar(100) ,
    name varchar(20) ,
    gender varchar(6) ,
    birthday date,
    register_date timestamp,
    remarks varchar(255) ,
    delete_tag int2 DEFAULT 0,
    delete_time timestamp,
	CONSTRAINT member_info_pkey PRIMARY KEY (member_id)
);
comment on table member_info is '会员信息';
comment on column member_info.member_id is '会员编号';
comment on column member_info.nickname is '预定人昵称/姓名';
comment on column member_info.msisdn is '预定人手机号';
comment on column member_info.wechat is '预定人微信号';
comment on column member_info.qq_number is '预定人QQ号';
comment on column member_info.xiao_hong_shu is '小红书账号';
comment on column member_info.email is '预定人邮箱地址';
comment on column member_info.name is '姓名';
comment on column member_info.gender is '性别';
comment on column member_info.birthday is '生日';
comment on column member_info.register_date is '第一次预定时间';
comment on column member_info.remarks is '备注信息(偏好、风格)';
comment on column member_info.delete_tag is '删除标识';
comment on column member_info.delete_time is '作废时间';

-- photo_order.stuff_account definition

-- Drop table

-- DROP TABLE photo_order.stuff_account;

CREATE TABLE stuff_account (
	id bigserial,
    account varchar(36) NOT NULL,
    password varchar(255) NOT NULL,
    salt varchar(255) NOT NULL,
    nickname varchar(20) NOT NULL,
    gender varchar(6) ,
    msisdn varchar(30) ,
    identification varchar(18) ,
    name varchar(20) ,
    user_status int4,
    avatar varchar(50) ,
    email varchar(50) ,
    access varchar(20) ,
    create_time timestamp,
	CONSTRAINT stuff_account_pkey PRIMARY KEY (id)
);
comment on table stuff_account is '员工信息';
comment on column stuff_account.id is '员工标识';
comment on column stuff_account.account is '账号';
comment on column stuff_account.password is '密码';
comment on column stuff_account.salt is '密码噪声';
comment on column stuff_account.nickname is '花名';
comment on column stuff_account.gender is '性别';
comment on column stuff_account.msisdn is '手机号';
comment on column stuff_account.identification is '身份识别码';
comment on column stuff_account.name is '姓名';
comment on column stuff_account.user_status is '删除标识';
comment on column stuff_account.avatar is '头像';
comment on column stuff_account.email is '电子邮箱地址';
comment on column stuff_account.access is 'access:admin/normal';
comment on column stuff_account.create_time is '创建日期';

CREATE TABLE combo_info (
    id bigserial,
    name varchar(50) NOT NULL,
    price float8,
    remark varchar(255) ,
    num_set int8,
    create_time date,
    delete_tag int2 DEFAULT 0,
    delete_time timestamp,
	CONSTRAINT combo_info_pkey PRIMARY KEY (id)
);
comment on table combo_info is '套餐信息表';
comment on column combo_info.id is '套餐编码';
comment on column combo_info.name is '套餐名称';
comment on column combo_info.price is '套餐价格';
comment on column combo_info.remark is '套餐描述';
comment on column combo_info.num_set is '包含套数';
comment on column combo_info.create_time is '创建日期';
comment on column combo_info.delete_tag is '删除标识';
comment on column combo_info.delete_time is '作废时间';

CREATE TABLE order_info_detail (
    id bigserial,
    order_num varchar(200) ,
    combo_id bigint,
    price float8,
    off_price float8,
    amount int8,
    create_time date,
	CONSTRAINT order_info_detail_pkey PRIMARY KEY (id)
);
comment on table order_info_detail is '订单套餐明细';
comment on column order_info_detail.id is '编号';
comment on column order_info_detail.order_num is '订单编号';
comment on column order_info_detail.combo_id is '套餐编码';
comment on column order_info_detail.price is '套餐价格';
comment on column order_info_detail.off_price is '优惠金额';
comment on column order_info_detail.amount is '数量';
comment on column order_info_detail.create_time is '创建日期';

CREATE TABLE appointment_info (
    id bigserial,
    order_num varchar(200) ,
    combo_id bigint,
    order_info_detail_id bigint,
    pic_tag int4,
    pic_url varchar(255) ,
    appointment_time timestamp,
    update_time timestamp,
	CONSTRAINT appointment_info_pkey PRIMARY KEY (id)
);
comment on table appointment_info is '预约信息表';
comment on column appointment_info.id is '编号';
comment on column appointment_info.order_num is '订单编号';
comment on column appointment_info.combo_id is '套餐编码';
comment on column appointment_info.order_info_detail_id is '订单套餐明细编码';
comment on column appointment_info.pic_tag is '返图标记：0未拍摄，1已拍摄，2.已返原图，3.已返精修';
comment on column appointment_info.pic_url is '本地图片路径备注';
comment on column appointment_info.appointment_time is '预约拍照时间';
comment on column appointment_info.update_time is '数据更新时间';

CREATE VIEW statistics_view_order_income AS
SELECT
--历史订单总金额
SUM(total_price) AS his_total_price,
--历史订单总收入
SUM(coalesce(income,0)+coalesce(expenditure,0)) AS his_income,
--历史订单总支出
SUM(coalesce(expenditure,0)) his_expenditure,
--历史订单毛利润
SUM(income) AS his_gross_profit,
--年度订单总金额
SUM(CASE WHEN to_char(now(),'YYYY')=to_char(order_time,'YYYY') THEN total_price ELSE 0 END) AS year_total_price,
--年度订单总收入
SUM(CASE WHEN to_char(now(),'YYYY')=to_char(order_time,'YYYY') THEN coalesce(income,0)+coalesce(expenditure,0) ELSE 0 END) AS year_income,
--年度订单总支出
SUM(CASE WHEN to_char(now(),'YYYY')=to_char(order_time,'YYYY') THEN coalesce(expenditure,0) ELSE 0 END) AS year_expenditure,
--年度订单毛利润
SUM(CASE WHEN to_char(now(),'YYYY')=to_char(order_time,'YYYY') THEN income ELSE 0 END) AS year_gross_profit,
--季度订单总金额
SUM(CASE WHEN date_trunc('quarter',now())=date_trunc('quarter',order_time) THEN total_price ELSE 0 END) AS quarter_total_price,
--季度订单总收入
SUM(CASE WHEN date_trunc('quarter',now())=date_trunc('quarter',order_time) THEN coalesce(income,0)+coalesce(expenditure,0) ELSE 0 END) AS quarter_income,
--季度订单总支出
SUM(CASE WHEN date_trunc('quarter',now())=date_trunc('quarter',order_time) THEN coalesce(expenditure,0) ELSE 0 END) AS quarter_expenditure,
--季度订单毛利润
SUM(CASE WHEN date_trunc('quarter',now())=date_trunc('quarter',order_time) THEN income ELSE 0 END) AS quarter_gross_profit,
--月度订单总金额
SUM(CASE WHEN to_char(now(),'YYYY-MM')=to_char(order_time,'YYYY-MM') THEN total_price ELSE 0 END) AS mon_total_price,
--月度订单总收入
SUM(CASE WHEN to_char(now(),'YYYY-MM')=to_char(order_time,'YYYY-MM') THEN coalesce(income,0)+coalesce(expenditure,0) ELSE 0 END) AS mon_income,
--月度订单总支出
SUM(CASE WHEN to_char(now(),'YYYY-MM')=to_char(order_time,'YYYY-MM') THEN coalesce(expenditure,0) ELSE 0 END) AS mon_expenditure,
--月度订单毛利润
SUM(CASE WHEN to_char(now(),'YYYY-MM')=to_char(order_time,'YYYY-MM') THEN income ELSE 0 END) AS mon_gross_profit,
--月度订单毛利润同比
SUM(CASE WHEN to_char(now(),'YYYY-MM')=to_char(order_time,'YYYY-MM') THEN income ELSE 0 END)
-SUM(CASE WHEN to_char((now() + interval '-1 year'),'YYYY-MM')=to_char(order_time,'YYYY-MM') THEN income ELSE 0 END)
 AS year_on_year_gross_profit,
--月度订单毛利润环比
SUM(CASE WHEN to_char(now(),'YYYY-MM')=to_char(order_time,'YYYY-MM') THEN income ELSE 0 END)
-SUM(CASE WHEN to_char((now() + interval '-1 month'),'YYYY-MM')=to_char(order_time,'YYYY-MM') THEN income ELSE 0 END)
AS mon_on_mon_gross_profit,
--待收款
SUM(CASE WHEN finished_tag<>1 THEN coalesce(balance_to_pay,0)-coalesce(balance_payment,0) ELSE 0 END) AS sum_balance_to_pay
FROM order_info WHERE delete_tag=0;

comment on column statistics_view_order_income.his_total_price is '历史订单总金额';
comment on column statistics_view_order_income.his_income is '历史订单总收入';
comment on column statistics_view_order_income.his_expenditure is '历史订单总支出';
comment on column statistics_view_order_income.his_gross_profit is '历史订单毛利润';
comment on column statistics_view_order_income.year_total_price is '年度订单总金额';
comment on column statistics_view_order_income.year_income is '年度订单总收入';
comment on column statistics_view_order_income.year_expenditure is '年度订单总支出';
comment on column statistics_view_order_income.year_gross_profit is '年度订单毛利润';
comment on column statistics_view_order_income.quarter_total_price is '季度订单总金额';
comment on column statistics_view_order_income.quarter_income is '季度订单总收入';
comment on column statistics_view_order_income.quarter_expenditure is '季度订单总支出';
comment on column statistics_view_order_income.quarter_gross_profit is '季度订单毛利润';
comment on column statistics_view_order_income.mon_total_price is '月度订单总金额';
comment on column statistics_view_order_income.mon_income is '月度订单总收入';
comment on column statistics_view_order_income.mon_expenditure is '月度订单总支出';
comment on column statistics_view_order_income.mon_gross_profit is '月度订单毛利润';
comment on column statistics_view_order_income.year_on_year_gross_profit is '月度订单毛利润同比';
comment on column statistics_view_order_income.mon_on_mon_gross_profit is '月度订单毛利润环比';
comment on column statistics_view_order_income.sum_balance_to_pay is '待收款';

CREATE VIEW statistics_view_mon_combo_income AS
SELECT
b.name AS combo_name,
b.id AS combo_id,
--月度套餐数量占比情况
COUNT(a.id) AS num,
--月度套餐金额占比情况
SUM(b.price) AS price
FROM order_info_detail a
INNER JOIN order_info c
ON a.order_num=c.order_num
LEFT JOIN combo_info b
ON a.combo_id=b.id
WHERE c.delete_tag=0
GROUP BY b.name,b.id;
comment on column statistics_view_mon_combo_income.combo_name is '套餐名称';
comment on column statistics_view_mon_combo_income.combo_id is '套餐编码';
comment on column statistics_view_mon_combo_income.num is '月度套餐数量占比情况';
comment on column statistics_view_mon_combo_income.price is '月度套餐金额占比情况';

--初始化管理员用户 默认密码123456
INSERT INTO photo_order.stuff_account
(id, account, create_time, gender, identification, msisdn, name, nickname, "password", salt, user_status, avatar, email, "access")
VALUES(1, 'admin', '2022-10-01 00:00:00.000', 'female', '5301', '', 'admin', '管理员', '6262c562b2ff22ef1b1bfa9f8e2d0446', 'Umb6H6', 0, 'https://ailifelab.com/assets/img/face.png', NULL, 'admin');


import { Settings as LayoutSettings } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: LayoutSettings & {
    pwa?: boolean;
    logo?: string;
} = {
    navTheme: 'light',
    // 拂晓蓝
    colorPrimary: '#1890ff',
    layout: 'mix',
    contentWidth: 'Fluid',
    fixedHeader: false,
    fixSiderbar: true,
    colorWeak: false,
    title: '订单管理',
    pwa: false,
    logo: '/logo-title.png',
    iconfontUrl: '',
    menu: { locale: false }
};

export default Settings;

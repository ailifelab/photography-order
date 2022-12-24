// import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';

const Footer: React.FC = () => {
    // const defaultMessage = intl.formatMessage({
    //     id: 'app.copyright.produced',
    //     defaultMessage: 'AILifeLab',
    // });

    const currentYear = new Date().getFullYear();

    return (
        <DefaultFooter
            style={{
                background: 'none',
            }}
            copyright={`${currentYear} AILifeLab`}
            links={[
                {
                    key: 'AILifeLab',
                    title: '爱生活摄影',
                    href: 'https://ailifelab.com',
                    blankTarget: true,
                },
                {
                    key: 'Light-visions',
                    title: '爱生活轻摄影',
                    href: 'https://lightvisions.net',
                    blankTarget: true,
                },
            ]}
        />
    );
};

export default Footer;

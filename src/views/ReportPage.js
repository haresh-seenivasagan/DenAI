import React from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Input, Typography } from 'antd';
import './ReportPage.css'; // Consider importing an Ant Design CSS file here if not globally imported

const { TextArea } = Input;
const { Title } = Typography;

const ReportPage = () => {
    const location = useLocation();
    const { report } = location.state;
    const combinedDescription = report.choices[0].message.content;

    const parseAndGenerateFormItems = (description) => {
        const parts = description.split('. ').filter(part => part.trim() !== '');
        return parts.map((part, index) => (
            <Form.Item
                key={index}
                label={`Issue ${index + 1}`}
                name={`issue_${index}`}
            >
                <TextArea defaultValue={part} readOnly autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>
        ));
    };

    return (
        <div style={styles.container}>
            <Title level={2} style={styles.header}>Report</Title>
            <Form layout="vertical">
                {parseAndGenerateFormItems(combinedDescription)}
            </Form>
        </div>
    );
};

// Optional: Styles for your container and header, if needed
const styles = {
    container: {
        maxWidth: '600px',
        margin: '20px auto',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
    },
    header: {
        textAlign: 'center',
    },
};

export default ReportPage;

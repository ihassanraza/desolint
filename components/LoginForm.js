import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Row, Col, Form, Input, Button, message } from 'antd';
import Cookies from 'js-cookie';
import Classes from '../styles/login-form.module.css';

export default function LoginForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            router.push('/cars');
        }
    }, [router]);

    const onFinish = async (values) => {
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify(values)
            });

            const result = await response.json();

            if (response.ok) {
                message.success('Login successful!');
                
                Cookies.set('token', result.token, {
                    expires: 1 / 3,
                    path: '/',
                    secure: process.env.NODE_ENV === 'production',
                });

                router.push('/cars');
            } else {
                message.error(result.message || 'Login failed!');
            }
        } catch (error) {
            message.error('Something went wrong! Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        message.error('Please complete the form correctly.');
    };

    return (
        <Row justify="center" align="middle" className={Classes.row}>
            <Col xs={24} sm={18} md={12} lg={8}>
                <div className={Classes.container}>
                    <h2 className={Classes.header}>Desol Int Test</h2>
                    <Form
                        name="login"
                        layout="vertical"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        initialValues={{ email: "", password: "" }}
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Please enter your email!" },
                                { type: "email", message: "Please enter a valid email!" },
                            ]}
                        >
                            <Input placeholder="Enter your email" />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                { required: true, message: "Please enter your password!" },
                            ]}
                        >
                            <Input.Password placeholder="Enter your password" />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                className={Classes.button}
                            >
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Col>
        </Row>
    );
}
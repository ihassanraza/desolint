import React, { useState } from 'react';
import { Row, Col, Form, Input, InputNumber, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Classes from '../styles/car-form.module.css';

export default function CarForm() {
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    const handleUpload = ({ fileList: newFileList }) => {
        setFileList(newFileList.slice(0, 10));
    };

    const onFinish = async (values) => {
        const { maxPictures, ...restValues } = values;

        if (fileList.length > maxPictures) {
            message.error(`You can upload a maximum of ${maxPictures} pictures.`);
            return;
        }

        const formData = {
            ...restValues,
            user: '6755ee70161495befd86a5e2',
            images: fileList.map(file => file.thumbUrl)
        };

        try {
            setLoading(true);

            const response = await fetch("https://desolint-backend-alpha.vercel.app/api/cars", {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                message.success("Car details submitted successfully!");
            } else {
                message.error(result.msg || "Submission failed!");
            }
        } catch (error) {
            message.error("An error occurred. Please try again." + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row justify="center" align="middle" className={Classes.row}>
            <Col xs={24} sm={18} md={18} lg={18}>
                <div className={Classes.container}>
                    <h2 className={Classes.header}>Sell your Car</h2>
                    <Form
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            model: "",
                            price: "",
                            phone: "",
                            city: "",
                        }}
                    >
                        <Form.Item
                            label="Car Model"
                            name="model"
                            rules={[
                                { required: true, message: "Please enter the car model!" },
                                { min: 3, message: "Car model must be at least 3 characters!" },
                            ]}
                        >
                            <Input placeholder="Enter car model" />
                        </Form.Item>
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: "Please enter the price!" }]}
                        >
                            <InputNumber
                                placeholder="Enter price"
                                style={{ width: "100%" }}
                                min={0}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Phone Number"
                            name="phone"
                            rules={[
                                { required: true, message: "Please enter your phone number!" },
                                { pattern: /^\d{11}$/, message: "Phone number must be 11 digits!" },
                            ]}
                        >
                            <Input placeholder="Enter phone number" maxLength={11} />
                        </Form.Item>
                        <Form.Item
                            label="City"
                            name="city"
                            rules={[{ required: true, message: "Please enter your city!" }]}
                        >
                            <Input placeholder="Enter city" />
                        </Form.Item>
                        <Form.Item
                            label="Max Number of Pictures"
                            name="maxPictures"
                            rules={[
                                {
                                    required: true,
                                    message: "Please specify the maximum number of pictures!",
                                },
                                {
                                    type: "number",
                                    min: 1,
                                    max: 10,
                                    message: "Value must be between 1 and 10.",
                                },
                            ]}
                        >
                            <InputNumber
                                placeholder="Enter max pictures (1-10)"
                                style={{ width: "100%" }}
                                min={1}
                                max={10}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Upload Pictures"
                            rules={[
                                { required: true, message: "Please upload at least one picture!" },
                            ]}
                        >
                            <Upload
                                listType="picture"
                                fileList={fileList}
                                onChange={handleUpload}
                                beforeUpload={() => false}
                                multiple
                            >
                                <Button icon={<UploadOutlined />}>Upload Pictures</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                className={Classes.button}
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Col>
        </Row>
    );
}
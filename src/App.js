import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import axios from 'axios';


const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function App() {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await axios.get('http://localhost:3001/users');
    setData(result.data);
  };

  const handleSubmit = async (values) => {
    await axios.post('http://localhost:3001/users', values);
    setModalVisible(false);
    form.resetFields();
    fetchData();
  };

  const handleUpdate = async (id, values) => {
    await axios.put(`http://localhost:3001/users/${id}`, values);
    setModalVisible(false);
    form.resetFields();
    fetchData();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/users/${id}`);
    fetchData();
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  const handleEdit = (record) => {
    setModalVisible(true);
    form.setFieldsValue(record);
  };
  return (
    <div>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        Add User
      </Button>
      <Modal
        title="Add User"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          {...layout}
          onFinish={form.getFieldValue('id') ? (values) => handleUpdate(form.getFieldValue('id'), values) : handleSubmit}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter an email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter a phone number' }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
}

export default App;

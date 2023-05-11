import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axios from 'axios';


const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 },
};

function App() {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { confirm } = Modal;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await axios.get('http://localhost:3001/users');
    setData(result.data);
  };

  const handleCreate =  () => {
    form.resetFields();
    setModalVisible(true);
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

  const deleteBtnHandler = (record) => {
    confirm({
      title: "Do you want to delete this user?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleDelete(record);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
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
      render: (text) => (
        <>
          <Button type="primary" onClick={() => handleEdit(text)}>
            Edit
          </Button>
          <Button type="primary" danger onClick={() => deleteBtnHandler(text.id)} className='ml-2' > 
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
    <div className='mt-0 mx-auto w-75'>
      <div className='text-right m-4'>
        <Button type="primary" onClick={() => handleCreate()}>
          Add User
        </Button>
      </div>
      <Modal
        title="Add User"
        visible={
          modalVisible}
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
            <div className='text-right w-100'>
              <Button type="primary" htmlType="submit" className='mr-5'>
                Submit
              </Button>
            </div>
          
        </Form>
      </Modal>
      <Table columns={columns} dataSource={data} rowKey="id" pagination={{
          position: ['bottomCenter'],
        }}/>
    </div>
  );
}

export default App;

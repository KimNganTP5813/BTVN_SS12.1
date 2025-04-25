/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Modal, Space, Table, Tag } from "antd";
import axios, { Axios } from "axios";

export default function ManagerLibrary() {
  const [libraries, setLibraries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [id, setId] = useState(null);

  //Gọi API lấy danh sách quản lý thư viện
  const getAllLibrary = async () => {
    //Hiển thị loading
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/libraries");

      if (response.data) {
        setLibraries(response.data);
      }
    } catch (error) {
      message.error("Lấy danh sách mượn thất bại!");
    } finally {
      //Tắt loading
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllLibrary();
  }, []);

  //Hàm mở modal xác nhận xóa
  const handleConfirmDelete = (id) => {
    //Mở modal xác nhận xóa
    setShowConfirm(true);
    //Cập nhật lại Id cần xóa
    setId(id);
  };

  //Hàm đóng modal xác nhận xóa
  const handleCloseConfirmDelete = () => {
    //Đóng modal xác nhận xóa
    setShowConfirm(false);
    //Cập nhật lại Id
    setId(null);
  };

  //Hàm xóa thông tin
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/libraries/${id}`
      );
      //Kiểm tra dữ liệu response từ server để xử lý logic
      if (response.status === 200) {
        //Tắt modal
        handleCloseConfirmDelete();
        //Render lại giao diện
        getAllLibrary();
        //Thông báo thành công
        message.success("Xóa thành công");
      }
    } catch (error) {
      message.error("Xóa thông tin thất bại");
    }
  };

  const columns = [
    {
      title: "Tên sách",
      dataIndex: "bookName",
      key: "bookName",
    },
    {
      title: "Sinh viên mượn",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Ngày mượn",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "Ngày trả",
      dataIndex: "endDate",
      key: "endDate",
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a onClick={() => handleConfirmDelete(record.id)}>Delete</a>
        </Space>
      ),
    },
  ];
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {/* Modal thêm mới và sửa thông tin */}
      <Modal open={false} title="Thêm mới thông tin" footer={null}>
        <Form
          layout="vertical"
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Tên sách"
            name="bookName"
            rules={[
              { required: true, message: "Tên sách không được để trống!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tên người nhận"
            name="studentName"
            rules={[
              {
                required: true,
                message: "Tên người mượn không được để trống!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ngày mượn"
            name="startDate"
            rules={[
              { required: true, message: "Ngày mượn không được để trống!" },
            ]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            label="Ngày trả"
            name="endDate"
            rules={[
              { required: true, message: "Ngày trả không được để trống!" },
            ]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item label={null} className="flex justify-end mb-0">
            <Button type="" htmlType="button">
              Hủy
            </Button>
            <Button className="ml-3" type="primary" htmlType="submit">
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal xác nhận xóa */}
      <Modal
        onCancel={handleCloseConfirmDelete}
        onOk={handleDelete}
        open={showConfirm}
        title="Xác nhận xóa"
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa thông tin này?</p>
      </Modal>
      <div className="flex flex-col">
        <header className="flex items-center justify-between mb-3">
          <h3>Quản lý mượn trả sách</h3>
          <Button type="primary">Thêm thông tin</Button>
        </header>
        <main>
          <Table
            loading={isLoading}
            columns={columns}
            dataSource={libraries}
          ></Table>
        </main>
      </div>
    </>
  );
}

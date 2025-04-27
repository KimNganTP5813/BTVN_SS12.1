/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  notification,
  Space,
  Table,
  Tag,
} from "antd";
import axios, { Axios, HttpStatusCode } from "axios";
import http from "../utils/http";
import useDounce from "../hooks/useDounce";

export default function ManagerLibrary() {
  const [libraries, setLibraries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [id, setId] = useState(null); //id quản lý trạng thái của sửa, xóa..
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [inputValue, setInputValue] = useState("");

  //Sử dụng hook useDounce
  const delaySearch = useDounce(inputValue, 500);

  //Gọi API lấy danh sách quản lý thư viện
  const getAllLibrary = async () => {
    //Hiển thị loading
    setIsLoading(true);
    try {
      const response = await http.get(`libraries?bookName_like=${inputValue}`);

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
  }, [delaySearch]);

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
      const response = await http.delete(`libraries/${id}`);
      //Kiểm tra dữ liệu response từ server để xử lý logic
      if (response.status === HttpStatusCode.Ok) {
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

  //Hàm mở modal thêm mới
  const handleShowModal = () => {
    setShowModal(true);
  };

  //Hàm đóng modal thêm mới
  const handleCloseModal = () => {
    setShowModal(false);
    //Cập nhật lại id
    setId(null);
  };

  //Hàm mở modal edit
  const handleModalEdit = (id) => {
    //mở modal
    setShowModal(true);
    //Tìm kiếm thông tin theo id
    const findInfo = libraries.find((library) => library.id === id);
    //fill dữ liệu vào form
    form.setFieldValue(findInfo);
    //cập nhật lại id cần sửa
    setId(id);
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
          <a onClick={() => handleModalEdit(record.id)}>Edit {record.name}</a>
          <a onClick={() => handleConfirmDelete(record.id)}>Delete</a>
        </Space>
      ),
    },
  ];
  const onFinish = async (values) => {
    //Gọi API thêm mới thông tin
    try {
      if (id) {
        //tiến hành cập nhật
        await http.put(`libraries/${id}`, values);
        //kiểm tra điều kiện trả về
      } else {
        //tiến hành thêm
        await http.post("libraries", values);
        // Kiểm tra điều kiện
      }

      //Tắt modal
      handleCloseModal();
      //Render lại giao diện
      getAllLibrary();
      //Hiển thị thông báo
      notification.success({
        message: "Thành công",
        description: `${id ? "Thêm mới" : "Cập nhật"} thông tin thành công`,
      });
    } catch (error) {
      notification.success({
        message: "Thất bại",
        description: `${id ? "Cập nhật" : "Thêm mới"} thông tin thất bại`,
      });
    }
  };

  return (
    <>
      {/* Modal thêm mới và sửa thông tin */}
      <Modal
        onCancel={handleCloseModal}
        open={showModal}
        title={`${id ? "Cập nhật" : "Thêm mới"} thông tin`}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
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
            <Button onClick={handleCloseModal} type="" htmlType="button">
              Hủy
            </Button>
            <Button className="ml-3" type="primary" htmlType="submit">
              {id ? "Lưu" : "Thêm"}
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
          <Button onClick={handleShowModal} type="primary">
            Thêm thông tin
          </Button>
        </header>

        <div className="mb-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>

        <main>
          <Table
            rowKey="id"
            loading={isLoading}
            columns={columns}
            dataSource={libraries}
          ></Table>
        </main>
      </div>
    </>
  );
}

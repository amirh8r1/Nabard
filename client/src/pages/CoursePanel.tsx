import { FC, useEffect, useState } from "react";
import { Table, Spin, Alert, Button, Modal, message, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../api/course";
import { Course, CreateCourseRequest } from "../api/course/type";
import CourseForm from "../components/CoursePanel/CourseForm";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const CoursePanel: FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [creating, setCreating] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [updating, setUpdating] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [searchText, setSearchText] = useState("");

  const fetchData = () => {
    setLoading(true);
    getAllCourses()
      .then((response) => {
        if (response.status === 200) {
          setCourses(response?.courses);
        } else {
          setError("خطا در دریافت لیست دروس");
        }
      })
      .catch((err) => {
        setError(`خطا در دریافت لیست دروس: ${err.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (values: CreateCourseRequest) => {
    setCreating(true);
    try {
      const res = await createCourse(values);
      if (res.status === 201) {
        message.success("درس جدید با موفقیت اضافه شد");
        setAddModalVisible(false);
        fetchData();
      } else {
        message.error("خطا در ثبت درس جدید");
      }
    } catch {
      message.error("خطا در ثبت درس جدید");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setEditModalVisible(true);
  };

  const handleUpdate = async (values: any) => {
    if (!editingCourse) return;
    setUpdating(true);
    try {
      await updateCourse(editingCourse.id, values);
      message.success("ویرایش درس با موفقیت انجام شد");
      setEditModalVisible(false);
      setEditingCourse(null);
      fetchData();
    } catch {
      message.error("خطا در ویرایش درس");
    } finally {
      setUpdating(false);
    }
  };

  const showDeleteModal = (course: Course) => {
    setCourseToDelete(course);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    setDeleting(true);
    try {
      await deleteCourse(courseToDelete.id);
      message.success("درس حذف شد");
      setDeleteModalVisible(false);
      setCourseToDelete(null);
      fetchData();
    } catch {
      message.error("خطا در حذف درس");
    } finally {
      setDeleting(false);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name &&
      course.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Course> = [
    {
      title: "نام درس",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 150,
    },
    {
      title: "تعداد واحد",
      dataIndex: "credit",
      key: "credit",
      width: 100,
    },
    {
      title: "مدت هفتگی (دقیقه)",
      dataIndex: "durationPerWeek",
      key: "durationPerWeek",
      width: 150,
    },
    {
      title: "ترم",
      dataIndex: "semester",
      key: "semester",
      width: 100,
      sorter: (a, b) => a.semester - b.semester,
    },
    {
      title: "عملیات",
      key: "action",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            size="small"
            icon={<DeleteOutlined />}
            danger
            onClick={() => showDeleteModal(record)}
          />
        </div>
      ),
    },
  ];

  if (loading)
    return (
      <div
        style={{
          width: "100%",
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  if (error)
    return (
      <div
        style={{
          width: "100%",
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Alert type="error" message={error} />
      </div>
    );

  return (
    <>
      <Table
        dataSource={filteredCourses}
        columns={columns}
        rowKey={"id"}
        pagination={false}
        scroll={{ y: "calc(100vh - 300px)", x: "max-content" }}
        title={() => (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Input
              placeholder="جستجو نام درس"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
              allowClear
            />
            <Button type="primary" onClick={() => setAddModalVisible(true)}>
              افزودن درس جدید
            </Button>
          </div>
        )}
      />
      {/* افزودن درس */}
      <Modal
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        title="افزودن درس جدید"
        destroyOnClose
        style={{ minWidth: 600, marginTop: "5%" }}
      >
        <CourseForm onFinish={handleCreate} />
      </Modal>

      {/* ویرایش درس */}
      <Modal
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingCourse(null);
        }}
        footer={null}
        title="ویرایش درس"
        destroyOnClose
        style={{ minWidth: 600, marginTop: "5%" }}
      >
        {editingCourse && (
          <CourseForm
            onFinish={handleUpdate}
            initialValues={{
              name: editingCourse.name,
              credit: editingCourse.credit,
              semester: editingCourse.semester,
            }}
          />
        )}
      </Modal>

      {/* حذف درس */}
      <Modal
        open={deleteModalVisible}
        onCancel={() => {
          setDeleteModalVisible(false);
          setCourseToDelete(null);
        }}
        confirmLoading={deleting}
        okText="حذف"
        okType="danger"
        cancelText="انصراف"
        onOk={handleConfirmDelete}
        title={`حذف درس ${courseToDelete?.name ?? ""}`}
        destroyOnClose
      >
        <p>آیا از حذف این درس مطمئن هستید؟</p>
      </Modal>
    </>
  );
};

export { CoursePanel };

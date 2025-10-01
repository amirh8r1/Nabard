import { FC, useEffect, useState } from "react";
import { Table, Spin, Alert, Button, Modal, message, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  getAllProfessors,
  createProfessor,
  updateProfessor,
  deleteProfessor,
} from "../api/professor";
import { Professor, CreateProfessorRequest } from "../api/professor/types";
import { ProfessorForm } from "../components/ProfessorPanel/ProfessorForm";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const weekDaysFa = {
  saturday: "شنبه",
  sunday: "یکشنبه",
  monday: "دوشنبه",
  tuesday: "سه‌شنبه",
  wednesday: "چهارشنبه",
};

const cleanWorkingHours = (workingHours: any) => {
  const result: any = {};
  Object.entries(workingHours).forEach(([day, arr]) => {
    const validArr = (Array.isArray(arr) ? arr : []).filter(
      (item) => typeof item?.start === "number" && typeof item?.end === "number"
    );
    if (validArr.length > 0) {
      result[day] = validArr;
    }
  });
  return result;
};

const ProfessorPanel: FC = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [creating, setCreating] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(
    null
  );
  const [updating, setUpdating] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [professorToDelete, setProfessorToDelete] = useState<Professor | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  const [searchText, setSearchText] = useState("");

  const fetchData = () => {
    setLoading(true);
    getAllProfessors()
      .then((response) => {
        if (response.status === 200) {
          setProfessors(response.professors);
        } else {
          setError("خطا در دریافت لیست اساتید");
        }
      })
      .catch((err) => {
        setError(`خطا در دریافت لیست اساتید: ${err.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (values: CreateProfessorRequest) => {
    setCreating(true);
    const cleaned = {
      ...values,
      workingHours: cleanWorkingHours(values.workingHours),
    };
    try {
      const res = await createProfessor(cleaned);
      if (res.status === 201) {
        message.success("استاد جدید با موفقیت اضافه شد");
        setAddModalVisible(false);
        fetchData();
      } else {
        message.error("خطا در ثبت استاد جدید");
      }
    } catch (err: any) {
      message.error("خطا در ثبت استاد جدید");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (prof: Professor) => {
    setEditingProfessor(prof);
    setEditModalVisible(true);
  };

  const handleUpdate = async (values: any) => {
    if (!editingProfessor) return;
    setUpdating(true);
    try {
      await updateProfessor(editingProfessor.id, {
        ...values,
        workingHours: cleanWorkingHours(values.workingHours),
      });
      message.success("ویرایش با موفقیت انجام شد");
      setEditModalVisible(false);
      setEditingProfessor(null);
      fetchData();
    } catch (err) {
      message.error("خطا در ویرایش استاد");
    } finally {
      setUpdating(false);
    }
  };

  const showDeleteModal = (prof: Professor) => {
    setProfessorToDelete(prof);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!professorToDelete) return;
    setDeleting(true);
    try {
      await deleteProfessor(professorToDelete.id);
      message.success("استاد حذف شد");
      setDeleteModalVisible(false);
      setProfessorToDelete(null);
      fetchData();
    } catch {
      message.error("خطا در حذف استاد");
    } finally {
      setDeleting(false);
    }
  };

  const filteredProfessors = professors.filter(
    (prof) =>
      prof.name && prof.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Professor> = [
    {
      title: "نام استاد",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 120,
    },
    ...Object.entries(weekDaysFa).map(([key, value]) => ({
      title: value,
      dataIndex: ["workingHours", key],
      key: key,
      width: 120,
      render: (value: any) =>
        value && value.length > 0 ? `${value[0].start} - ${value[0].end}` : "-",
    })),
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
        dataSource={filteredProfessors}
        columns={columns}
        rowKey={"id"}
        pagination={false}
        scroll={{ y: "calc(100vh - 300px)", x: "max-content" }}
        title={() => (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Input
              placeholder="جستجو نام استاد"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
              allowClear
            />
            <Button type="primary" onClick={() => setAddModalVisible(true)}>
              افزودن استاد جدید
            </Button>
          </div>
        )}
      />
      <Modal
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        title="افزودن استاد جدید"
        destroyOnClose
        style={{ minWidth: 1000, marginTop: "5%" }}
      >
        <ProfessorForm onFinish={handleCreate} loading={creating} />
      </Modal>
      <Modal
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingProfessor(null);
        }}
        footer={null}
        title="ویرایش استاد"
        destroyOnClose
        style={{ minWidth: 1000, marginTop: "5%" }}
      >
        {editingProfessor && (
          <ProfessorForm
            onFinish={handleUpdate}
            loading={updating}
            initialValues={{
              name: editingProfessor.name,
              workingHours: editingProfessor.workingHours,
            }}
          />
        )}
      </Modal>
      <Modal
        open={deleteModalVisible}
        onCancel={() => {
          setDeleteModalVisible(false);
          setProfessorToDelete(null);
        }}
        confirmLoading={deleting}
        okText="حذف"
        okType="danger"
        cancelText="انصراف"
        onOk={handleConfirmDelete}
        title={`حذف استاد ${professorToDelete?.name ?? ""}`}
        destroyOnClose
      >
        <p>آیا از حذف استاد مطمئن هستید؟</p>
      </Modal>
    </>
  );
};

export { ProfessorPanel };

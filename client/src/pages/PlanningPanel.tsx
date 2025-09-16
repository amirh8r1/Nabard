import { FC, useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  Table,
  Checkbox,
  Button,
  Alert,
  Typography,
  Spin,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { getAllCourses } from "../api/course"; // 📥 API دریافت لیست دروس
import { getAllProfessors } from "../api/professor"; // 📥 API دریافت لیست اساتید
import { Course } from "../api/course/types";
import { Professor } from "../api/professor/types";

const PlanningPanel: FC = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProfessors, setSelectedProfessors] = useState<number[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [assignments, setAssignments] = useState<{
    [courseId: number]: number[];
  }>({});

  const [profSearch, setProfSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profRes, courseRes] = await Promise.all([
          getAllProfessors(),
          getAllCourses(),
        ]);

        if (profRes.status === 200) {
          setProfessors(profRes.professors);
        } else {
          message.error("خطا در دریافت لیست اساتید");
        }

        if (courseRes.status === 200) {
          setCourses(courseRes.courses);
        } else {
          message.error("خطا در دریافت لیست دروس");
        }
      } catch (err: any) {
        message.error(`خطا در دریافت داده‌ها: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProfessors = professors.filter((p) =>
    p.name.includes(profSearch)
  );
  const filteredCourses = courses.filter((c) => c.name.includes(courseSearch));

  const professorColumns: ColumnsType<any> = [
    {
      title: "نام استاد",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name), // 📌 مرتب‌سازی حروفی
    },
    {
      title: "ساعات کاری",
      render: (_, record: Professor) => {
        const daysMap: Record<string, string> = {
          saturday: "شنبه",
          sunday: "یکشنبه",
          monday: "دوشنبه",
          tuesday: "سه‌شنبه",
          wednesday: "چهارشنبه",
        };
        return Object.entries(record.workingHours || {})
          .map(
            ([day, hours]) =>
              `${daysMap[day]} ${hours
                .map((h) => `${h.start}-${h.end}`)
                .join(", ")}`
          )
          .join(" | ");
      },
    },
  ];

  const courseColumns: ColumnsType<Course> = [
    {
      title: "نام درس",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name), // 📌 مرتب‌سازی حروفی
    },
    {
      title: "واحد",
      dataIndex: "credit",
      sorter: (a, b) => a.credit - b.credit, // 📌 مرتب‌سازی عددی
    },
    {
      title: "ترم",
      dataIndex: "semester",
      sorter: (a, b) => a.semester - b.semester, // 📌 مرتب‌سازی عددی
    },
  ];

  const handleCheckboxChange = (
    courseId: number,
    profId: number,
    checked: boolean
  ) => {
    setAssignments((prev) => {
      const current = prev[courseId] || [];
      const updated = checked
        ? [...current, profId]
        : current.filter((id) => id !== profId);
      return { ...prev, [courseId]: updated };
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: "100%" }}>
      <Row gutter={16}>
        {/* لیست اساتید */}
        <Col span={12}>
          <Card
            title="لیست اساتید"
            extra={
              <Input.Search
                placeholder="جستجو استاد..."
                onSearch={setProfSearch}
                allowClear
              />
            }
          >
            <Table
              rowKey="id"
              dataSource={filteredProfessors}
              columns={professorColumns}
              pagination={false}
              rowSelection={{
                type: "checkbox",
                selectedRowKeys: selectedProfessors,
                onChange: (keys) => setSelectedProfessors(keys as number[]),
              }}
              scroll={{ y: 300 }}
            />
          </Card>
        </Col>

        {/* لیست دروس */}
        <Col span={12}>
          <Card
            title="لیست دروس"
            extra={
              <Input.Search
                placeholder="جستجو درس..."
                onSearch={setCourseSearch}
                allowClear
              />
            }
          >
            <Table
              rowKey="id"
              dataSource={filteredCourses}
              columns={courseColumns}
              pagination={false}
              rowSelection={{
                type: "checkbox",
                selectedRowKeys: selectedCourses,
                onChange: (keys) => setSelectedCourses(keys as number[]),
              }}
              scroll={{ y: 300 }}
            />
          </Card>
        </Col>
      </Row>

      <br />

      {/* ماتریس استاد - درس */}
      <Row gutter={16}>
        <Col span={24}>
          <Card title="انتخاب استاد برای هر درس" bodyStyle={{ padding: 0 }}>
            <div style={{ width: "100%", overflowX: "auto" }}>
              {selectedCourses.length === 0 ||
              selectedProfessors.length === 0 ? (
                <Alert
                  message="برای ایجاد ارتباط، حداقل یک درس و یک استاد انتخاب کنید"
                  type="info"
                  style={{ margin: 16 }}
                />
              ) : (
                <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={selectedCourses.map((courseId) => {
                    const course = courses.find((c) => c.id === courseId)!;
                    return { id: course.id, name: course.name };
                  })}
                  columns={[
                    {
                      title: "نام درس",
                      dataIndex: "name",
                      fixed: "left", // 📌 در حالت RTL این میشه سمت راست کاربر
                      width: 200,
                      onCell: () => ({
                        style: {
                          background: "#fafafa", // 📌 پس زمینه مثل هدر
                          fontWeight: "bold", // کمی بولد تر برای تاکید
                          borderLeft: "1px solid #f0f0f0", // خط جدا کننده
                        },
                      }),
                    },
                    ...selectedProfessors.map((profId) => {
                      const prof = professors.find((p) => p.id === profId)!;
                      return {
                        title: prof.name,
                        dataIndex: `prof-${prof.id}`,
                        width: 150,
                        render: (_: any, record: any) => (
                          <Checkbox
                            checked={(assignments[record.id] || []).includes(
                              profId
                            )}
                            onChange={(e) =>
                              handleCheckboxChange(
                                record.id,
                                profId,
                                e.target.checked
                              )
                            }
                          />
                        ),
                      };
                    }),
                  ]}
                  scroll={{
                    x: 200 + selectedProfessors.length * 150,
                    y: 600,
                  }}
                  style={{ minWidth: "100%" }}
                  direction="rtl" // 🚀 این مهمه
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <br />

      {/* دکمه ایجاد پلن */}
      <Button
        type="primary"
        onClick={() => {
          const payload = Object.entries(assignments).map(
            ([courseId, profs]) => ({
              courseId: Number(courseId),
              professors: profs,
            })
          );
          console.log("Assignments payload to send:", payload);
          message.info("در نسخه بعدی این دکمه به API generate وصل می‌شود");
        }}
      >
        تولید برنامه پیشنهادی
      </Button>

      <Typography.Text style={{ fontSize: 12, display: "block", marginTop: 8 }}>
        نسخه متصل به API لیست اساتید و دروس
      </Typography.Text>
    </div>
  );
};

export { PlanningPanel };

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
import Toast from "../components/PlanningPanel/Toast";
import type { ColumnsType } from "antd/es/table";
import { getAllCourses } from "../api/course"; // 📥 API دریافت لیست دروس
import { getAllProfessors } from "../api/professor"; // 📥 API دریافت لیست اساتید
import { generatePlan } from "../api/planning";
import { Course } from "../api/course/types";
import { Professor } from "../api/professor/types";
import { GeneratedSession } from "../api/planning/types";

const PlanningPanel: FC = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [plan, setPlan] = useState<GeneratedSession[]>([]);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
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

      if (updated.length === 0) {
        const { [courseId]: _, ...rest } = prev;
        return rest;
      }

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

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
  };

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

      <br />
      {plan.length > 0 && (
        <div>
          <Typography.Title level={4}>برنامه پیشنهادی</Typography.Title>
          {Array.from(
            new Set(
              plan.map((p) => {
                const course = courses.find((c) => c.id === p.courseId);
                return course?.semester;
              })
            )
          )
            .sort((a, b) => (a || 0) - (b || 0))
            .map((semester) => {
              const semesterPlan = plan.filter((p) => {
                const course = courses.find((c) => c.id === p.courseId);
                return course?.semester === semester;
              });

              // روزهای هفته فارسی
              const daysFa: Record<string, string> = {
                saturday: "شنبه",
                sunday: "یکشنبه",
                monday: "دوشنبه",
                tuesday: "سه‌شنبه",
                wednesday: "چهارشنبه",
              };

              // تعیین اسلات‌ها (سورت بر اساس شروع)
              const timeSlots = Array.from(
                new Set(semesterPlan.map((s) => `${s.start}-${s.end}`))
              ).sort((a, b) => {
                const [sa] = a.split("-").map(Number);
                const [sb] = b.split("-").map(Number);
                return sa - sb;
              });

              const columns = [
                {
                  title: "روز",
                  dataIndex: "day",
                  key: "day",
                  fixed: "left",
                  width: 100,
                },
                ...timeSlots.map((slot) => ({
                  title: slot,
                  dataIndex: slot,
                  key: slot,
                  align: "center" as const,
                  render: (sessions: any[]) => {
                    if (!sessions || sessions.length === 0) return "-";
                    return sessions.map((ses, i) => (
                      <div key={i}>
                        <b>{ses.courseName}</b>
                        <br />
                        <span style={{ fontSize: 12, color: "#888" }}>
                          {ses.profName}
                        </span>
                      </div>
                    ));
                  },
                })),
              ];

              // ساخت داده جدول (هر ردیف = یک روز)
              const rows = Object.keys(daysFa).map((dayKey) => {
                const row: any = { day: daysFa[dayKey] };
                timeSlots.forEach((slot) => {
                  const [start, end] = slot.split("-").map(Number);
                  row[slot] = semesterPlan
                    .filter(
                      (s) =>
                        s.day === dayKey && s.start === start && s.end === end
                    )
                    .map((s) => ({
                      courseName:
                        courses.find((c) => c.id === s.courseId)?.name || "",
                      profName:
                        professors.find((p) => p.id === s.professorId)?.name ||
                        "",
                    }));
                });
                return row;
              });

              return (
                <div key={semester} style={{ marginBottom: 40 }}>
                  <Typography.Title level={5}>ترم {semester}</Typography.Title>
                  <Table
                    columns={columns}
                    dataSource={rows}
                    rowKey="day"
                    pagination={false}
                    bordered
                    size="small"
                    scroll={{ x: "max-content" }}
                  />
                </div>
              );
            })}
        </div>
      )}

      {/* دکمه ایجاد پلن */}
      <Button
        type="primary"
        onClick={async () => {
          const payload = Object.entries(assignments).map(
            ([courseId, profs]) => ({
              courseId: Number(courseId),
              professors: profs,
            })
          );

          if (payload.length === 0) {
            message.warning("هیچ ارتباطی بین استاد و درس تعریف نشده است");
            return;
          }

          message.loading({ content: "در حال تولید برنامه...", key: "plan" });

          try {
            const res = await generatePlan({ assignments: payload });

            if (res.status === 200 && res.plan) {
              setPlan(res.plan);
              showToast("success", "برنامه تولید شد");
            } else {
              showToast("error", res.message || "خطا در تولید برنامه");
            }
          } catch (err) {
            message.error({
              content: "ارتباط با سرور برقرار نشد",
              key: "plan",
            });
          }
        }}
      >
        تولید برنامه پیشنهادی
      </Button>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.text}
          onClose={() => setToast(null)}
          duration={4}
        />
      )}
    </div>
  );
};

export { PlanningPanel };

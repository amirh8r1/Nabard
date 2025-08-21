import { FC } from "react";
import { Form, Input, Button, InputNumber, Select } from "antd";
import { CreateCourseRequest } from "../../api/course/type";

const faToEnDigits = (str?: string): number => {
  if (!str) return NaN;
  const english = str.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
  const num = Number(english);
  return isNaN(num) ? NaN : num;
};

interface Props {
  onFinish: (values: CreateCourseRequest) => void;
  loading?: boolean;
  initialValues?: Partial<CreateCourseRequest>;
}

const semesterOptions = Array.from({ length: 8 }, (_, i) => ({
  label: `ترم ${i + 1}`,
  value: i + 1,
}));

const CourseForm: FC<Props> = ({ onFinish, loading, initialValues }) => {
  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={
        initialValues || {
          name: "",
          credit: 1,
          semester: 1,
        }
      }
    >
      {/* نام درس */}
      <Form.Item
        style={{ maxWidth: 500 }}
        label="نام درس"
        name="name"
        rules={[{ required: true, message: "نام درس را وارد کنید" }]}
      >
        <Input placeholder="مثال: ریاضی عمومی" />
      </Form.Item>

      {/* تعداد واحد */}
      <Form.Item
        style={{ maxWidth: 200 }}
        label="تعداد واحد"
        name="credit"
        rules={[
          { required: true, message: "تعداد واحد را وارد کنید" },
          { type: "number", min: 1, max: 10, message: "واحد بین ۱ تا ۱۰ باشد" },
        ]}
      >
        <InputNumber
          min={1}
          max={10}
          style={{ width: "100%" }}
          parser={faToEnDigits}
        />
      </Form.Item>

      {/* ترم ارائه */}
      <Form.Item
        style={{ maxWidth: 200 }}
        label="ترم"
        name="semester"
        rules={[
          { required: true, message: "ترم ارائه را انتخاب کنید" },
          { type: "number", min: 1, max: 8, message: "ترم بین ۱ تا ۸ باشد" },
        ]}
      >
        <Select options={semesterOptions} />
      </Form.Item>

      {/* دکمه ثبت */}
      <Form.Item style={{ marginTop: 20 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          ثبت درس
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CourseForm;

import { FC } from "react";
import { Form, Input, Button, Row, Col, InputNumber, Card } from "antd";
import { WeekDay } from "../../api/professor/types";

const weekDays: WeekDay[] = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
];

const weekDaysFa = {
  saturday: "شنبه",
  sunday: "یکشنبه",
  monday: "دوشنبه",
  tuesday: "سه‌شنبه",
  wednesday: "چهارشنبه",
};

interface Props {
  onFinish: (values: any) => void;
  loading?: boolean;
  initialValues?: any;
}

const faToEnDigits = (str?: string): number => {
  if (!str) return NaN;
  const english = str.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
  const num = Number(english);
  return isNaN(num) ? NaN : num;
};

const ProfessorForm: FC<Props> = ({ onFinish, loading, initialValues }) => {
  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={
        initialValues || {
          name: "",
          workingHours: {},
        }
      }
    >
      <Form.Item
        style={{ maxWidth: 900 }}
        label="نام استاد"
        name="name"
        rules={[{ required: true, message: "نام استاد را وارد کنید" }]}
      >
        <Input />
      </Form.Item>

      <Row gutter={16} wrap={false} style={{ maxWidth: 550 }}>
        {weekDays.map((day) => (
          <Col span={8} key={day}>
            <Card size="small" title={weekDaysFa[day]}>
              <Form.Item
                name={["workingHours", day, 0, "start"]}
                label="شروع"
                rules={[
                  {
                    type: "number",
                    min: 0,
                    max: 23,
                    message: "ساعت باید بین ۰ تا ۲۳ باشد",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  max={23}
                  style={{ width: "100%" }}
                  parser={faToEnDigits}
                />
              </Form.Item>
              <Form.Item
                name={["workingHours", day, 0, "end"]}
                label="پایان"
                rules={[
                  {
                    type: "number",
                    min: 0,
                    max: 23,
                    message: "ساعت باید بین ۰ تا ۲۳ باشد",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const start = getFieldValue([
                        "workingHours",
                        day,
                        0,
                        "start",
                      ]);
                      if (
                        value === undefined ||
                        start === undefined ||
                        value > start
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        "ساعت پایان باید بزرگتر از ساعت شروع باشد"
                      );
                    },
                  }),
                ]}
              >
                <InputNumber
                  min={0}
                  max={23}
                  style={{ width: "100%" }}
                  parser={faToEnDigits}
                />
              </Form.Item>
            </Card>
          </Col>
        ))}
      </Row>

      <Form.Item style={{ marginTop: 20 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          ثبت استاد
        </Button>
      </Form.Item>
    </Form>
  );
};

export { ProfessorForm };

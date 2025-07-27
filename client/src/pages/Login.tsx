import { Button, Card, Flex, Form, Input, Typography } from "antd";
import { useSetAtom } from "jotai";
import { useNavigate } from "react-router";
import { login } from "../api/auth";
import { useAntTheme } from "../hooks/useAntTheme";
import { useTranslation } from "../hooks/useTranslation";
import { authAtom } from "../store/states";
import { ROUTES } from "../utils/constants";

const { Title } = Typography;

export const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const setAuth = useSetAtom(authAtom);

  const t = useTranslation();
  const {
    token: { customPaddingInlineLayout },
  } = useAntTheme();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const {
        session: { accessToken },
      } = await login(values);

      if (accessToken) {
        setAuth({
          accessToken,
        });

        navigate(ROUTES.home);
      }
    } catch (error: unknown) {
      let message = "Login failed. Please try again.";

      if (typeof error === "object" && error !== null && "response" in error) {
        const apiError = error as { response: { data: { message: string } } };
        if (apiError.response.data && "message" in apiError.response.data) {
          message = apiError.response.data.message;
        }
      }

      form.setFields([
        {
          name: "username",
          errors: [message],
        },
        {
          name: "password",
          errors: [message],
        },
      ]);
    }
  };

  return (
    <Flex style={{ margin: "auto", padding: customPaddingInlineLayout }}>
      <Card style={{ width: 400 }} bordered={false}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          {t("login.title")}
        </Title>
        <Form form={form} name="login" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={t("login.userName")}
            name="username"
            rules={[
              { required: true, message: t("login.userNameRequiredMessage") },
            ]}
          >
            <Input placeholder={t("login.userNamePlaceHolder")} />
          </Form.Item>

          <Form.Item
            label={t("login.password")}
            name="password"
            rules={[
              { required: true, message: t("login.passwordRequiredMessage") },
            ]}
          >
            <Input.Password placeholder={t("login.passwordPlaceHolder")} />
          </Form.Item>

          <Form.Item style={{ marginTop: 54 }}>
            <Button type="primary" htmlType="submit" block>
              {t("login.submitButton")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

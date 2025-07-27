import { Button, Result } from "antd";
import { Link } from "react-router";
import { useTranslation } from "../hooks/useTranslation";
import { ROUTES } from "../utils/constants";

export const ServerError = () => {
  const t = useTranslation();

  return (
    <Result
      status="500"
      title={t("serverError.title")}
      subTitle={t("serverError.subtitle")}
      extra={
        <Button size="large" type="primary">
          <Link to={ROUTES.home}> {t("serverError.backHome")}</Link>
        </Button>
      }
      style={{
        margin: "auto",
      }}
    />
  );
};

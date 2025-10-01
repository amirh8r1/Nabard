import { Button, Result } from "antd";
import { Link } from "react-router";
import { useTranslation } from "../hooks/useTranslation";
import { ROUTES } from "../utils/constants";

export const NotFound = () => {
  const t = useTranslation();

  return (
    <Result
      status="404"
      title={t("notFound.title")}
      subTitle={t("notFound.subtitle")}
      extra={
        <Button size="large" type="primary">
          <Link to={ROUTES.home}> {t("notFound.backHome")}</Link>
        </Button>
      }
      style={{
        margin: "auto",
      }}
    />
  );
};

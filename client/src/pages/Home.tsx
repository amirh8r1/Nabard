import { Flex, Typography } from "antd";
import { FC } from "react";
import { FlightIcon } from "../blocks/Icons";
import CardItem from "../components/Home/CardItem";
import { useAntTheme } from "../hooks/useAntTheme";
import { useTranslation } from "../hooks/useTranslation";
import { CONFIGURATIONS } from "../utils/configurations";
import { ROUTES } from "../utils/constants";

export const Home: FC = () => {
  const t = useTranslation();

  const {
    token: { colorText },
  } = useAntTheme();

  return (
    <>
      <Flex
        wrap
        gap={24}
        style={{
          padding: "72px 202px",
          height: "fit-content",
        }}
      >
        <CardItem
          title={t("home.technicalPanel")}
          icon={
            <FlightIcon
              style={{
                fontSize: 100,
                fill: colorText,
              }}
            />
          }
          link={ROUTES.home}
        />
      </Flex>
      <Typography.Text
        style={{
          fontSize: 12,
          position: "absolute",
          left: "8px",
          bottom: "8px",
        }}
      >
        {CONFIGURATIONS.VERSION}
      </Typography.Text>
    </>
  );
};

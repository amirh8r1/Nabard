import {
  theme as antTheme,
  App,
  ConfigProvider,
  ConfigProviderProps,
} from "antd";
import { DirectionType } from "antd/es/config-provider";
import enUS from "antd/locale/en_US";
import faIR from "antd/locale/fa_IR";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { PropsWithChildren, useEffect, useState } from "react";
import { languageAtom, themeAtom } from "../store/states";
import { Locales, THEMES } from "../utils/constants";
import { ExtendedThemeConfig } from "../utils/types";

import "dayjs/locale/en";
import "dayjs/locale/fa";

type Locale = ConfigProviderProps["locale"];

const tokenBase = {
  customPaddingInlineLayout: "48px",

  fontFamily: "IRANSansX",
  fontSizeHeading1: 38,
  fontSizeHeading2: 32,
  fontSizeHeading3: 24,
  fontSizeHeading4: 18,
  fontSizeHeading5: 16,
  fontSizeXL: 20,
  fontSizeLG: 18,
  fontSize: 14,
  fontSizeSM: 12,

  controlHeightLG: 56,
};

const tokenDark = {
  ...tokenBase,
  customColorBgHeader: "#434343",
  customColorBgTechnicalPanelHeader: "#595959",
  customColorBgTechnicalPanelMenuLayout: "#262626",
  customColorTextHoverTechnicalPanelMenu: "#F5F5F5",
  customColorTextTechnicalPanelMenu: "#BFBFBF",
  customColorBgTextHoverTechnicalPanelMenu: "#595959",

  customColorBgTechnicalPanelRecentEntity: "#434343",

  customColorBgEntityDetailsHeader: "#595959",

  colorPrimaryBg: "#262626",
  colorPrimaryBgHover: "#3C3C3C",
  colorPrimaryBorder: "#4F4F4F",
  colorPrimaryBorderHover: "#6D6D6D",
  colorPrimaryHover: "#D1D1D1",
  colorPrimary: "#BBBBBB",
  colorPrimaryActive: "#949494",
  colorPrimaryTextHover: "#D1D1D1",
  colorPrimaryText: "#BBBBBB",
  colorPrimaryTextActive: "#949494",
  // colorText: '#262626',
  // colorTextSecondary: '#595959',
  // colorTextTertiary: '#8C8C8C',
  // colorTextQuaternary: '#BFBFBF',
  // colorBorder: '#D9D9D9',
  // colorBorderSecondary: '#F0F0F0',

  colorBgContainer: "#262626",
};

const tokenLight = {
  ...tokenBase,
  customColorBgHeader: "#D9D9D9",
  customColorBgTechnicalPanelHeader: "#FAFAFA",
  customColorBgTechnicalPanelMenuLayout: "#F5F5F5",
  customColorTextHoverTechnicalPanelMenu: "#262626",
  customColorTextTechnicalPanelMenu: "#8C8C8C",
  customColorBgTextHoverTechnicalPanelMenu: "#D9D9D9",

  customColorBgTechnicalPanelRecentEntity: "#FFFFFF",

  customColorBgEntityDetailsHeader: "#F4F4F4",

  colorPrimaryBg: "#E6F4FA",
  colorPrimaryBgHover: "#595959",
  colorPrimaryBorder: "#4D4D4D",
  colorPrimaryBorderHover: "#434343",
  colorPrimaryHover: "#595959",
  colorPrimary: "#262626",
  colorPrimaryActive: "#000000",
  colorPrimaryTextHover: "#333333",
  colorPrimaryText: "#262626",
  colorPrimaryTextActive: "#000000",
  colorText: "#262626",
  colorTextSecondary: "#595959",
  colorTextTertiary: "#8C8C8C",
  colorTextQuaternary: "#BFBFBF",
  colorBorder: "#D9D9D9",
  colorBorderSecondary: "#F0F0F0",

  colorBgContainer: "#FFFFFF",
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const theme = useAtomValue(themeAtom);
  const language = useAtomValue(languageAtom);
  const [locale, setLocal] = useState<Locale>(
    language.locale === Locales.Fa ? faIR : enUS
  );
  const [direction, setDirection] = useState<DirectionType>(language.direction);

  useEffect(() => {
    setLocal(language.locale === Locales.Fa ? faIR : enUS);
    setDirection(language.direction);
    dayjs.locale(language.locale);
  }, [language]);

  return (
    <ConfigProvider
      theme={
        {
          algorithm:
            THEMES.light === theme
              ? antTheme.defaultAlgorithm
              : antTheme.darkAlgorithm,
          token: THEMES.light === theme ? tokenLight : tokenDark,
          components: {
            Layout: {
              headerPadding: "0px",
            },
            Form: {
              labelColor: "#8C8C8C",
              labelRequiredMarkColor: "#8C8C8C",
              labelFontSize: 16,
              verticalLabelPadding: "0 0 12px 0",
            },
          },
        } as ExtendedThemeConfig
      }
      direction={direction}
      locale={locale}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
};

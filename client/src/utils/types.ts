import { GlobalToken, theme, ThemeConfig } from "antd";
import { AliasToken } from "antd/lib/theme/interface";

export interface CustomToken {
  customPaddingInlineLayout: string;
  customColorBgHeader: string;
  customColorBgTechnicalPanelHeader: string;
  customColorBgTechnicalPanelMenuLayout: string;
  customColorTextHoverTechnicalPanelMenu: string;
  customColorTextTechnicalPanelMenu: string;
  customColorBgTextHoverTechnicalPanelMenu: string;

  customColorBgTechnicalPanelRecentEntity: string;

  customColorBgEntityDetailsHeader: string;
}

export type ExtendedThemeConfig = Omit<ThemeConfig, "token"> & {
  token?: Partial<AliasToken & CustomToken>;
};

export type AntTokenType = ReturnType<typeof theme.useToken>;

export type ExtendedAntTokenType = Omit<AntTokenType, "token"> & {
  token: GlobalToken & Partial<CustomToken>;
};

export interface Language {
  locale: "fa" | "en";
  direction: "rtl" | "ltr";
}

import { UserOutlined } from "@ant-design/icons";
import { Avatar, Breadcrumb, Flex } from "antd";
import { NavLink, useLocation } from "react-router";
import { useAntTheme } from "../hooks/useAntTheme";
import { useTranslation } from "../hooks/useTranslation";
import { ROUTES } from "../utils/constants";

export const Header = () => {
  // const [language, setLanguage] = useAtom(languageAtom);
  // const [theme, setTheme] = useAtom(themeAtom);
  // const setAuth = useSetAtom(authAtom);
  const {
    token: { customPaddingInlineLayout, customColorBgHeader },
  } = useAntTheme();
  const t = useTranslation();
  const location = useLocation();

  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const pathSnippetsTemp = pathSnippets.filter((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    const key =
      Object.entries(ROUTES).find(([, val]) => val.includes(url))?.[0] || null;
    return !!key;
  });

  const items = pathSnippetsTemp
    .map((_, index) => {
      const url = `/${pathSnippetsTemp.slice(0, index + 1).join("/")}`;
      const key =
        Object.entries(ROUTES).find(([, val]) => val.includes(url))?.[0] ||
        null;
      return {
        title:
          index === pathSnippetsTemp.length - 1 ? (
            t(`pages.${key}`)
          ) : (
            <NavLink to={url}>{t(`pages.${key}`)}</NavLink>
          ),
      };
    })
    .filter((i) => i);

  const breadcrumbItems = [
    {
      title:
        items.length < 1 ? (
          t("pages.home")
        ) : (
          <NavLink to={ROUTES.home}>{t("pages.home")}</NavLink>
        ),
    },
    ...items,
  ];

  return (
    <Flex
      align="center"
      justify="space-between"
      gap="middle"
      style={{
        backgroundColor: customColorBgHeader,
        height: "100%",
        width: "100%",
        paddingInline: customPaddingInlineLayout,
        paddingBlock: "15px",
      }}
      wrap
    >
      <Breadcrumb items={breadcrumbItems} />
      {/* <Flex wrap gap="small">
        <Select
          placeholder="Please select language"
          value={language.locale}
          onChange={(value) => {
            if (value === LANGUAGES.english.locale) {
              setLanguage(LANGUAGES.english as Language);
            } else {
              setLanguage(LANGUAGES.farsi as Language);
            }
          }}
          options={[
            {
              value: LANGUAGES.english.locale,
              label: t('others.en'),
            },
            {
              value: LANGUAGES.farsi.locale,
              label: t('others.fa'),
            },
          ]}
        />
        <Select
          placeholder="Please select theme"
          value={theme}
          onChange={(value) => {
            if (value === THEMES.light) {
              setTheme(THEMES.light);
            } else {
              setTheme(THEMES.dark);
            }
          }}
          options={[
            {
              value: THEMES.light,
              label: t('others.light'),
            },
            {
              value: THEMES.dark,
              label: t('others.dark'),
            },
          ]}
        />
        <Button
          onClick={() => {
            setAuth(null);
          }}
        >
          {t('others.logout')}
        </Button>
      </Flex> */}
      <Avatar size={40} icon={<UserOutlined />} />
    </Flex>
  );
};

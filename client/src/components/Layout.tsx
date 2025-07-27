import { LoadingOutlined } from "@ant-design/icons";
import { Layout as AntLayout, Flex, Spin } from "antd";
import { Header as AntHeader, Content } from "antd/es/layout/layout";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { getAuth } from "../api/auth";
import { Header } from "../components/Header";
import { useAntTheme } from "../hooks/useAntTheme";
import { authAtom } from "../store/states";
import { ROUTES } from "../utils/constants";

export function Layout() {
  const auth = useAtomValue(authAtom);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const {
    token: { colorBgBase },
  } = useAntTheme();

  useEffect(() => {
    if (auth) {
      getAuth().then(() => {
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    if (!auth && location.pathname === ROUTES.login) {
      setLoading(false);
    }
  }, [location, auth]);

  return (
    <AntLayout style={{ height: "100vh" }}>
      {!loading && auth && (
        <AntHeader style={{ height: "70px" }}>
          <Header />
        </AntHeader>
      )}
      <Content style={{ height: "100%" }}>
        <Flex
          style={{
            height: "100%",
          }}
        >
          <Outlet />
          {loading && (
            <Flex
              align="center"
              justify="center"
              style={{
                height: "100%",
                width: "100%",
                position: "absolute",
                backgroundColor: colorBgBase,
              }}
            >
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 64 }} spin />}
              />
            </Flex>
          )}
        </Flex>
      </Content>
    </AntLayout>
  );
}

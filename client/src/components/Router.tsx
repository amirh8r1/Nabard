import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AuthGuard } from "../guards/AuthGuard";
import { NoAuthGuard } from "../guards/NoAuthGuard";
import { Home } from "../pages/Home";
import { ProfessorPanel } from "../pages/ProfessorPanel";
import { CoursePanel } from "../pages/CoursePanel";
import { PlanningPanel } from "../pages/PlanningPanel";
import { Login } from "../pages/Login";
import { NotFound } from "../pages/NotFound";
import { ServerError } from "../pages/ServerError";
import { ROUTES } from "../utils/constants";
import { Layout } from "./Layout";

const authRoutes = [
  {
    path: ROUTES.home,
    element: <Home />,
  },
  {
    path: ROUTES.professorPanel,
    element: <ProfessorPanel />,
  },
  {
    path: ROUTES.coursePanel,
    element: <CoursePanel />,
  },
  {
    path: ROUTES.planningPanel,
    element: <PlanningPanel />,
  },
];

const noAuthRoutes = [
  {
    path: ROUTES.login,
    element: <Login />,
  },
];

const publicRoutes = [
  {
    path: ROUTES.serverError,
    element: <ServerError />,
  },
  {
    path: ROUTES.notFound,
    element: <NotFound />,
  },
  {
    path: ROUTES.others,
    element: <Navigate to={ROUTES.notFound} replace />,
  },
];

export const Router = () => {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <Spin indicator={<LoadingOutlined style={{ fontSize: 64 }} spin />} />
        }
      >
        <Routes>
          <Route element={<Layout />}>
            <Route element={<AuthGuard />}>
              <Route>
                {authRoutes.map((r) => (
                  <Route key={r.path} path={r.path} element={r.element} />
                ))}
              </Route>
            </Route>
            <Route element={<NoAuthGuard />}>
              {noAuthRoutes.map((r) => (
                <Route key={r.path} path={r.path} element={r.element} />
              ))}
            </Route>
            {publicRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

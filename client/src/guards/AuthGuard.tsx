import { useAtomValue } from 'jotai/react';
import { Navigate, Outlet } from 'react-router';
import { authAtom } from '../store/states';
import { ROUTES } from '../utils/constants';

export function AuthGuard() {
  const auth = useAtomValue(authAtom);

  return auth ? <Outlet /> : <Navigate to={ROUTES.login} replace />;
}

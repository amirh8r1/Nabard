import { theme } from 'antd';
import { ExtendedAntTokenType } from '../utils/types';

export const useAntTheme = (): ExtendedAntTokenType => {
  const t = theme.useToken();

  return t;
};

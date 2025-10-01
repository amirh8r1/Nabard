import { useIntl } from 'react-intl';

export const useTranslation = () => {
  const intl = useIntl();

  return (value: string) => {
    return intl.formatMessage({ id: value });
  };
};

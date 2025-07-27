import { flatten } from "flat";
import { useAtomValue } from "jotai";
import { PropsWithChildren, useEffect } from "react";
import { IntlProvider as ReactIntlProvider } from "react-intl";
import englishMessages from "../messages/en.json";
import farsiMessages from "../messages/fa.json";
import { languageAtom } from "../store/states";
import { Locales } from "../utils/constants";

export const IntlProvider = ({ children }: PropsWithChildren) => {
  const language = useAtomValue(languageAtom);
  const messages =
    language.locale === Locales.Fa ? farsiMessages : englishMessages;

  useEffect(() => {
    document.documentElement.lang = language.locale;
    document.documentElement.dir = language.direction;

    document.title = messages.others.title;
  }, [language, messages]);

  return (
    <ReactIntlProvider locale={language.locale} messages={flatten(messages)}>
      {children}
    </ReactIntlProvider>
  );
};

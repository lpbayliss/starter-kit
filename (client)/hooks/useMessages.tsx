import { useState, useEffect } from 'react';
import { usePageContext } from 'vike-react/usePageContext';
import { loadMessages } from '../i18n/message-loader';
import { getClientLocale } from '../i18n/client-locale-detector';
import { isValidLocale, DEFAULT_LOCALE } from '../i18n/config';
import type { Messages, Locale } from '../i18n/types';

export function useMessages() {
  const pageContext = usePageContext();
  const [clientMessages, setClientMessages] = useState<Messages>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const locale = pageContext.locale || getClientLocale();
  const messages = pageContext.messages || clientMessages;
  
  useEffect(() => {
    // If we don't have messages from server, load them on client
    if (!pageContext.messages && Object.keys(clientMessages).length === 0) {
      setIsLoading(true);
      const validLocale = isValidLocale(locale) ? locale as Locale : DEFAULT_LOCALE;
      loadMessages(validLocale)
        .then(setClientMessages)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [locale, pageContext.messages, clientMessages]);
  
  return { locale, messages, isLoading };
}
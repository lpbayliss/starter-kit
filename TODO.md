# i18n Implementation Plan - FormatJS + React Intl with Vike SSR

## Architecture Overview

**Approach**: Cookie-based internationalization for invisible locale persistence with clean URLs and optimal SSR compatibility.

**Key Technologies**:
- FormatJS (React Intl) for message formatting
- Vike SSR hooks for server-side locale handling  
- Cookie-based locale detection with Accept-Language fallback
- Namespace-based message organization

**Locale Detection Strategy**:
1. **Primary**: HTTP cookie (`locale=fr`) - persistent user preference
2. **Fallback**: Accept-Language header - browser/OS preference  
3. **Default**: English (`en`) - safe fallback

## Implementation Phases

### Phase 1: Core Setup & Dependencies

#### 1.1 Install Dependencies
```bash
pnpm add react-intl
pnpm add -D @formatjs/cli @formatjs/ts-transformer
```

#### 1.2 Directory Structure Setup
```
(client)/
├── i18n/
│   ├── config.ts              # Intl configuration
│   ├── locale-detector.ts     # Locale detection logic
│   └── message-loader.ts      # Message loading utilities
├── locales/
│   ├── en/
│   │   ├── common.json        # Common translations
│   │   ├── pages.json         # Page-specific translations
│   │   └── components.json    # Component translations
│   └── fr/
│       ├── common.json
│       ├── pages.json
│       └── components.json
└── compiled-locales/          # Build output for compiled messages
    ├── en.json
    └── fr.json
```

#### 1.3 Package.json Scripts
```json
{
  "scripts": {
    "extract-messages": "formatjs extract \"(client)/**/*.{ts,tsx}\" --out-file locales/extracted.json --id-interpolation-pattern '[sha512:contenthash:base64:6]'",
    "compile-messages": "formatjs compile locales/en/**/*.json --ast --out-file compiled-locales/en.json && formatjs compile locales/fr/**/*.json --ast --out-file compiled-locales/fr.json",
    "build-i18n": "pnpm extract-messages && pnpm compile-messages",
    "dev": "pnpm build-i18n && vike dev",
    "build": "pnpm build-i18n && vike build"
  }
}
```

### Phase 2: Vike SSR Integration

#### 2.1 Locale Detection Hook (`+onBeforeRoute.ts`)
```typescript
// (client)/pages/+onBeforeRoute.ts
export function onBeforeRoute(pageContext: PageContextBuiltIn) {
  // Priority: Cookie > Accept-Language > Default
  const cookieLocale = parseCookieLocale(pageContext.headers?.cookie)
  const browserLocale = parseAcceptLanguage(pageContext.headers?.['accept-language'])
  const locale = cookieLocale || browserLocale || 'en'
  
  return {
    pageContext: {
      locale,
      // Clean URLs without locale parameters
      urlLogical: pageContext.urlParsed.pathname
    }
  }
}

function parseCookieLocale(cookieHeader?: string): string | null {
  if (!cookieHeader) return null
  const match = cookieHeader.match(/locale=([^;]+)/)
  const locale = match?.[1]
  return ['en', 'fr'].includes(locale) ? locale : null // Validate against supported locales
}

function parseAcceptLanguage(acceptLanguage?: string): string | null {
  if (!acceptLanguage) return null
  // Parse "en-US,en;q=0.9,fr;q=0.8" format
  const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0].split('-')[0])
  return languages.find(lang => ['en', 'fr'].includes(lang)) || null
}
```

#### 2.2 Message Loading Hook (`+onBeforeRender.ts`)
```typescript
// (client)/pages/+onBeforeRender.ts
export async function onBeforeRender(pageContext: PageContextBuiltInServer) {
  const { locale } = pageContext
  const messages = await loadMessages(locale)
  
  return {
    pageContext: {
      messages,
      locale
    }
  }
}
```

#### 2.3 Page Context Types (`global.d.ts` extension)
```typescript
declare global {
  namespace Vike {
    interface PageContext {
      locale: string
      messages: Record<string, any>
    }
  }
}
```

### Phase 3: React Integration

#### 3.1 Enhanced Wrapper Component
```typescript
// (client)/pages/+Wrapper.tsx
import { IntlProvider } from 'react-intl'
import { usePageContext } from 'vike-react/usePageContext'

export default function Wrapper({ children }: { children: ReactNode }) {
  const { locale, messages } = usePageContext()
  
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <IntlProvider 
          locale={locale} 
          messages={messages}
          onError={() => {}} // Prevent SSR hydration errors
        >
          {children}
        </IntlProvider>
      </TRPCProvider>
    </QueryClientProvider>
  )
}
```

#### 3.2 Custom Translation Hook
```typescript
// (client)/hooks/useTranslation.tsx
import { useIntl } from 'react-intl'

export function useTranslation() {
  const intl = useIntl()
  
  return {
    t: (id: string, values?: Record<string, any>) => 
      intl.formatMessage({ id }, values),
    locale: intl.locale,
    formatDate: intl.formatDate,
    formatNumber: intl.formatNumber
  }
}
```

#### 3.3 Locale Provider Context
```typescript
// (client)/components/LocaleProvider.tsx
import { createContext, useContext, ReactNode } from 'react'

interface LocaleContextType {
  locale: string
  setLocale: (locale: string) => void
  availableLocales: string[]
}

const LocaleContext = createContext<LocaleContextType | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const { locale } = usePageContext()
  
  const setLocale = (newLocale: string) => {
    // Set cookie and reload to trigger SSR with new locale
    document.cookie = `locale=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}` // 1 year
    window.location.reload() // Reload to trigger SSR with new locale
  }
  
  return (
    <LocaleContext.Provider value={{
      locale,
      setLocale,
      availableLocales: ['en', 'fr']
    }}>
      {children}
    </LocaleContext.Provider>
  )
}

export const useLocale = () => {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return context
}
```

### Phase 4: Component Development

#### 4.1 Language Switcher Component
```typescript
// (client)/components/LanguageSwitcher.tsx
import { useLocale } from './LocaleProvider'
import { useTranslation } from '../hooks/useTranslation'

export function LanguageSwitcher() {
  const { locale, setLocale, availableLocales } = useLocale()
  const { t } = useTranslation()
  
  return (
    <select 
      value={locale} 
      onChange={(e) => setLocale(e.target.value)}
      aria-label={t('language.switcher.label')}
    >
      {availableLocales.map((loc) => (
        <option key={loc} value={loc}>
          {t(`language.${loc}`)}
        </option>
      ))}
    </select>
  )
}
```

#### 4.2 Localized Link Component
```typescript
// (client)/components/Link.tsx (enhanced)
// With cookie-based approach, links remain clean - no URL modifications needed

interface LocalizedLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

export function Link({ href, ...props }: LocalizedLinkProps) {
  // No locale-specific logic needed - cookie persists preference automatically
  return <a href={href} {...props} />
}
```

### Phase 5: Build Process & Optimization

#### 5.1 Vite Configuration Enhancement
```typescript
// vite.config.ts additions
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    // Add FormatJS transformer
    {
      name: 'formatjs-transform',
      transform(code, id) {
        if (/\.(ts|tsx)$/.test(id) && !id.includes('node_modules')) {
          // Transform React Intl message definitions
          return transformFormatJS(code, id)
        }
      }
    }
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate locale data into chunks
          'locale-en': ['../compiled-locales/en.json'],
          'locale-fr': ['../compiled-locales/fr.json']
        }
      }
    }
  }
})
```

#### 5.2 Message Extraction Workflow
```typescript
// (client)/i18n/message-loader.ts
const messageCache = new Map<string, any>()

export async function loadMessages(locale: string): Promise<Record<string, any>> {
  if (messageCache.has(locale)) {
    return messageCache.get(locale)
  }
  
  try {
    // Dynamic import for client-side code splitting
    const messages = await import(`../compiled-locales/${locale}.json`)
    messageCache.set(locale, messages.default)
    return messages.default
  } catch (error) {
    console.warn(`Failed to load locale ${locale}, falling back to English`)
    const fallback = await import('../compiled-locales/en.json')
    return fallback.default
  }
}
```

### Phase 6: Testing & Quality Assurance

#### 6.1 Component Testing
```typescript
// (client)/components/__tests__/LanguageSwitcher.test.tsx
import { render, screen } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { LanguageSwitcher } from '../LanguageSwitcher'

const renderWithIntl = (locale = 'en', messages = {}) => {
  return render(
    <IntlProvider locale={locale} messages={messages}>
      <LanguageSwitcher />
    </IntlProvider>
  )
}

test('renders language options', () => {
  renderWithIntl()
  expect(screen.getByRole('combobox')).toBeInTheDocument()
})
```

#### 6.2 SSR Testing
- Test locale detection from query parameters
- Verify message loading on server-side
- Ensure hydration without client-server mismatches
- Test fallback behavior for missing translations

## Performance Considerations

### Bundle Optimization
- **Code Splitting**: Locale-specific chunks loaded on demand
- **Message Compilation**: Pre-compile to AST format for runtime performance  
- **Tree Shaking**: Import only required FormatJS features
- **Caching**: Server-side message cache for repeated requests

### SEO Optimization
- **Clean URLs**: Single URL per content (no locale parameters)
- **hreflang tags**: Generate for each supported locale variant
- **Meta tags**: Localized page titles and descriptions  
- **Cookie-based detection**: Search engines see consistent content
- **Canonical URLs**: No duplicate content issues

### Cookie Implementation Benefits
- **No URL pollution**: Clean, shareable URLs
- **Instant preference**: No page reload needed for detection
- **SEO friendly**: Single URL per content, proper indexing
- **Cross-tab consistency**: Preference shared across browser tabs

## Migration Strategy

### Development Phase
1. Implement core i18n infrastructure
2. Convert existing components one namespace at a time
3. Add translations for critical user flows first
4. Test SSR behavior thoroughly

### Production Rollout
1. Feature flag for i18n enable/disable
2. A/B test locale detection accuracy
3. Monitor bundle size impact
4. Gradual rollout by user segments

## Maintenance Guidelines

### Message Management
- **Extraction**: Automated on build
- **Translation**: External service integration (Crowdin, Lokalise)
- **Validation**: Missing translation checks in CI
- **Versioning**: Track translation completeness per release

### Developer Experience
- **IDE Integration**: FormatJS VS Code extension
- **Type Safety**: Generate TypeScript definitions from messages
- **Linting**: Enforce translation key naming conventions
- **Documentation**: Clear guidelines for message creation

## Security Considerations

- **XSS Prevention**: All user-provided content through FormattedMessage
- **Input Validation**: Sanitize interpolated values
- **Locale Validation**: Whitelist supported locales
- **Content Security Policy**: Allow inline styles for RTL text

## Browser Support

- **Modern Browsers**: Full Intl API support
- **Legacy Support**: Polyfills for older browsers if needed
- **Progressive Enhancement**: Graceful degradation for JS-disabled users

---

## Success Metrics

- **Performance**: < 100ms additional load time for locale switching
- **Bundle Size**: < 50KB increase per additional locale
- **Developer Productivity**: < 2 minutes to add new translation
- **User Experience**: Seamless language switching without page reload
- **SEO**: Proper indexing of localized content

This implementation plan provides a robust, scalable internationalization solution that leverages FormatJS and React Intl while maintaining excellent SSR performance and developer experience with Vike.
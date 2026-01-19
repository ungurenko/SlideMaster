# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**СлайдМастер (SlideMaster)** — веб-приложение для создания Instagram-каруселей с тёплым эстетичным дизайном. Пользователи создают карусели из шаблонов, автоматически генерируют слайды из текста через AI (Wizard), настраивают шрифты/цвета и экспортируют в JPG.

- **Стек:** React 18 + TypeScript 5 + Vite 5 + Tailwind CSS
- **Хранение:** localStorage (нет бэкенда)
- **Деплой:** Vercel (SPA routing)

## Commands

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера (http://localhost:5173)
npm run dev

# Сборка для production (TypeScript check + Vite build → /dist)
npm run build

# Предпросмотр production сборки
npm run preview
```

**Переменные окружения:** `.env.local` с `GEMINI_API_KEY` для AI-функций (Wizard).

## Architecture

### Views (роутинг через состояние в App.tsx)

| View | Компонент | Описание |
|------|-----------|----------|
| `home` | WelcomeScreen | Главная, выбор шаблонов, недавние проекты |
| `editor` | CarouselEditor | Основной редактор (926 LOC) |
| `wizard` | Wizard | AI-генерация карусели из текста |
| `admin` | AdminPanel | Управление шаблонами и hero-изображениями |

### Key Directories

```
components/     # React UI компоненты
services/       # Бизнес-логика
  ├── autoParser.ts      # Парсинг текста → слайды (3 формата)
  └── downloadService.ts # Экспорт в ZIP+JPG через html2canvas
utils/          # Утилиты (сжатие изображений)
types.ts        # TypeScript типы, DEFAULT_TEMPLATES
```

### Core Types (types.ts)

```typescript
SlideData        // Данные слайда (id, text, title?, isCover)
CarouselConfig   // Настройки карусели (шрифты, цвета, opacity)
Template         // Шаблон (6 встроенных: СТАРТАП, ДРАМА, ЛЮКС, ПРОСТОТА, ВОЗДУХ, НЕОН)
SavedProject     // Сохранённый проект
```

### Data Flow

- **Состояние:** React useState (нет Redux/Context)
- **Персистентность:** localStorage
  - `carousel_projects` — SavedProject[]
  - `hero_images` — HeroImage[]
  - `carousel_templates` — Template[]

### External Libraries (CDN в index.html)

- html2canvas 1.4.1 — рендеринг DOM в canvas
- JSZip 3.10.1 — создание ZIP-архивов
- FileSaver.js 2.0.5 — сохранение файлов
- Google Fonts (9 семейств)

## Design System

| Назначение | Цвет |
|------------|------|
| Primary | `#9CAF88` (sage green) |
| Background | `#FFFDF9` (cream) |
| Accent | `#F4D35E` (warm yellow) |
| Text | `#333333` (soft charcoal) |

## Common Modifications

### Добавление нового шаблона

Редактировать `types.ts` → массив `DEFAULT_TEMPLATES`:

```typescript
{
  id: 'new-template',
  name: 'НАЗВАНИЕ',
  previewColor: '#HEX',
  textColor: '#HEX',
  isHidden: false,
  config: { /* CarouselConfig */ }
}
```

### Изменение формата экспорта

`services/downloadService.ts` — размеры canvas (сейчас 1080×1350 для Instagram), качество JPEG.

### Парсинг текста

`services/autoParser.ts` — поддерживаемые форматы:
1. `Слайд N:` / `Slide N:` — метки
2. `# Слайд N` — markdown заголовки
3. `1. Title ...` — нумерованные списки

## Notes

- **html2canvas:** слайды обрабатываются последовательно (избежание конфликтов SVG-фильтров)
- **localStorage:** лимит ~5-10MB (осторожно с большими base64 изображениями)
- **TypeScript:** `noUnusedLocals: false` в tsconfig.json

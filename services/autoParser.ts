
import { SlideData } from '../types';

interface ParsedRawSlide {
  number: number;
  content: string;
}

export const parseCarouselText = (inputText: string): ParsedRawSlide[] | null => {
  const slides: ParsedRawSlide[] = [];

  // 1. Format: "Слайд N:" or "Slide N:"
  // Looks for "Slide 1:" followed by content until the next "Slide N:" or end of string
  const regex1 = /(?:^|\n)(?:Слайд|Slide)\s*(\d+)\s*:?\s*(.*?)(?=(?:\n(?:Слайд|Slide)\s*\d+)|$)/gis;
  const matches1 = [...inputText.matchAll(regex1)];
  
  if (matches1.length >= 2) {
    matches1.forEach(match => {
      slides.push({
        number: parseInt(match[1]),
        content: match[2].trim()
      });
    });
    return slides;
  }

  // 2. Format: "# Слайд N" or "# Slide N" (Markdown headers)
  const regex2 = /#\s*(?:Слайд|Slide)\s*(\d+)\s*(.*?)(?=(?:#\s*(?:Слайд|Slide))|$)/gis;
  const matches2 = [...inputText.matchAll(regex2)];

  if (matches2.length >= 2) {
    matches2.forEach(match => {
      slides.push({
        number: parseInt(match[1]),
        content: match[2].trim()
      });
    });
    return slides;
  }

  // 3. Format: Numbered list "1. Title ... 2. Title ..."
  // Careful not to catch bullet points inside text. We look for Digit + Dot + Newline or Start of line
  const regex3 = /(?:^|\n)(\d+)\.\s+(.*?)(?=(?:\n\d+\.\s)|$)/gis;
  const matches3 = [...inputText.matchAll(regex3)];

  if (matches3.length >= 2) {
    matches3.forEach(match => {
      slides.push({
        number: parseInt(match[1]),
        content: match[2].trim()
      });
    });
    return slides;
  }

  return null;
};

export const structureSlides = (rawSlides: ParsedRawSlide[]): SlideData[] => {
  return rawSlides.map((slide, index) => {
    const lines = slide.content.split('\n').map(l => l.trim()).filter(l => l);
    const id = `slide-${Date.now()}-${index}`;

    // Logic for Cover Slide (First one)
    if (index === 0) {
      return {
        id,
        text: lines[0] || 'ЗАГОЛОВОК',
        subtitle: lines.slice(1).join('\n') || '',
        isCover: true,
        title: undefined // Cover doesn't use the separate title field in generic structure usually, uses 'text' as main
      };
    }

    // Logic for Content Slides
    // Heuristic: If first line is short (< 60 chars) or fully uppercase, treat as Title.
    const firstLine = lines[0] || '';
    const isHeading = firstLine.length < 60 || firstLine === firstLine.toUpperCase();

    if (isHeading && lines.length > 1) {
      return {
        id,
        isCover: false,
        title: firstLine,
        text: lines.slice(1).join('\n'),
      };
    } else {
      // Treat everything as body text
      return {
        id,
        isCover: false,
        title: '', // Empty title
        text: lines.join('\n')
      };
    }
  });
};

export const SAMPLE_TEXT = `Слайд 1: ГЛАВНАЯ ОШИБКА
(сохрани пост и попробуй этот метод)

Слайд 2: ПОНИМАНИЕ
Почему важно понимать свою аудиторию лучше, чем они понимают себя сами. Это ключ к доверию.

Слайд 3: АНАЛИЗ
Не гадайте на кофейной гуще. Используйте метрики и опросы, чтобы узнать реальные боли клиентов.

Слайд 4: РЕЗУЛЬТАТ
Высокая вовлеченность и рост продаж. Люди пишут "ты прочитал мои мысли" в комментариях.`;

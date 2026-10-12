/**
 * textCleaner.ts
 * Strips formatting that would sound wrong when read aloud by SpeechSynthesis.
 * Import `cleanForTTS` before speaking any assistant reply.
 */

/** Expand common symbols / patterns to spoken equivalents */
const SYMBOL_MAP: Array<[RegExp, string]> = [
  [/\$(\d[\d,]*\.?\d*)/g, '$1 dollars'],
  [/€(\d[\d,]*)/g, '$1 euros'],
  [/₹(\d[\d,]*)/g, '$1 rupees'],
  [/(\d+)%/g, '$1 percent'],
  [/(\d{1,2}):(\d{2})\s*(am|pm)/gi, '$1 $2 $3'],
  [/(\d+)\s*x\s*(\d+)/gi, '$1 by $2'],
  [/&amp;/g, 'and'],
  [/&lt;/g, 'less than'],
  [/&gt;/g, 'greater than'],
  [/&nbsp;/g, ' '],
  [/\+(\d+)/g, 'plus $1'],
];

/** Replace URLs with a spoken proxy */
function replaceUrls(text: string): string {
  return text.replace(/https?:\/\/\S+/g, 'link on screen');
}

/** Strip markdown formatting characters */
function stripMarkdown(text: string): string {
  return text
    // Code blocks (triple backtick)
    .replace(/```[\s\S]*?```/g, 'code block omitted')
    // Inline code
    .replace(/`([^`]+)`/g, '$1')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '$1')
    // Italic
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // Strikethrough
    .replace(/~~(.*?)~~/g, '$1')
    // Headings
    .replace(/^#{1,6}\s+/gm, '')
    // Blockquotes
    .replace(/^>\s+/gm, '')
    // Horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Markdown links [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Markdown images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Bullet points / list markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    // Numbered lists
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remaining asterisks, underscores, hashes, tildes, backticks
    .replace(/[*_#~`]/g, '');
}

/** Strip emoji characters */
function stripEmoji(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
    .replace(/[\u{2600}-\u{26FF}]/gu, '')
    .replace(/[\u{2700}-\u{27BF}]/gu, '')
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
    .replace(/[\u{1F000}-\u{1F02F}]/gu, '')
    .replace(/[⭐🔥💡✅❌⚡🎯🚀💼🏆🎓]/gu, '');
}

/** Apply symbol expansions */
function applySymbolMap(text: string): string {
  let result = text;
  for (const [pattern, replacement] of SYMBOL_MAP) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

/** Collapse multiple blank lines / excessive whitespace */
function normalizeWhitespace(text: string): string {
  return text
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/•/g, ',')
    .trim();
}

/**
 * Main export: prepare text for browser SpeechSynthesis.
 * Order matters: URLs first (avoid treating markdown link URLs as text),
 * then markdown, then emoji, then symbols, then whitespace.
 */
export function cleanForTTS(raw: string): string {
  if (!raw) return '';
  let text = raw;
  text = replaceUrls(text);
  text = stripMarkdown(text);
  text = stripEmoji(text);
  text = applySymbolMap(text);
  text = normalizeWhitespace(text);
  return text;
}

/**
 * Split a TTS-cleaned string into sentence-sized chunks for streaming synthesis.
 * Chrome silently truncates utterances longer than ~200 chars; chunking avoids that.
 */
export function splitIntoSentences(text: string): string[] {
  // Split on sentence-ending punctuation followed by space or end-of-string
  const raw = text
    .split(/(?<=[.!?;])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  // Safety: if a chunk is still very long (e.g. no punctuation), break on comma
  const chunks: string[] = [];
  for (const chunk of raw) {
    if (chunk.length > 220) {
      const byComma = chunk.split(/,\s+/).map((s) => s.trim()).filter(Boolean);
      chunks.push(...byComma);
    } else {
      chunks.push(chunk);
    }
  }
  return chunks;
}

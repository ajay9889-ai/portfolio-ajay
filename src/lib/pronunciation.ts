/**
 * pronunciation.ts
 * Maps portfolio-specific proper nouns, acronyms, and tech names to TTS-friendly equivalents.
 * Apply AFTER cleanForTTS so the text is already stripped of markdown.
 */

export const PRONUNCIATION_MAP: Array<[RegExp, string]> = [
  // Portfolio specific projects & organizations
  [/\bElderNest\b/gi, 'Elder Nest'],
  [/\bWisdomPlay\b/gi, 'Wisdom Play'],
  [/\bBrikUp\b/gi, 'Brick Up'],
  [/\bHackVerse\b/gi, 'Hack Verse'],
  [/\bBMSIT&M\b/gi, 'B M S I T and M'],
  [/\bBMSIT\b/gi, 'B M S I T'],

  // Tech & frameworks
  [/\bNext\.js\b/gi, 'Next J S'],
  [/\bReact\.js\b/gi, 'React J S'],
  [/\bNode\.js\b/gi, 'Node J S'],
  [/\bVue\.js\b/gi, 'View J S'],
  [/\bTailwind\s*CSS\b/gi, 'Tailwind C S S'],
  [/\bTailwindCSS\b/gi, 'Tailwind C S S'],
  [/\bPostgreSQL\b/gi, 'Postgres Q L'],
  [/\bMongoDB\b/gi, 'Mongo D B'],
  [/\bTypeScript\b/gi, 'TypeScript'],
  [/\bJavaScript\b/gi, 'JavaScript'],

  // Acronyms & standards
  [/\bUI\/UX\b/gi, 'U I, U X'],
  [/\bWCAG\b/gi, 'W C A G'],
  [/\bRFID\b/gi, 'R F I D'],
  [/\bREST\s*APIs?\b/gi, 'Rest A P I'],
  [/\bAPI\b/g, 'A P I'],
  [/\bAPIs\b/g, 'A P Is'],
  [/\bIoT\b/g, 'I O T'],
  [/\bSDK\b/g, 'S D K'],
  [/\bSDKs\b/g, 'S D Ks'],
  [/\bLLM\b/g, 'L L M'],
  [/\bLLMs\b/g, 'L L Ms'],
  [/\bSDE\b/g, 'S D E'],
  [/\bMCA\b/g, 'M C A'],
  [/\bBCA\b/g, 'B C A'],
  [/\bCGPA\b/g, 'C G P A'],
  [/\bTTS\b/g, 'T T S'],
  [/\bSTT\b/g, 'S T T'],
  [/\bSSE\b/g, 'S S E'],
  [/\bJSON\b/gi, 'Jason'],
  [/\bHTML\b/g, 'H T M L'],
  [/\bCSS\b/g, 'C S S'],
  [/\bSQL\b/gi, 'Sequel'],
];

/**
 * Applies phonetic corrections to text before feeding to Web Speech API speech synthesis.
 */
export function applyPronunciation(text: string): string {
  if (!text) return '';
  let result = text;
  for (const [pattern, replacement] of PRONUNCIATION_MAP) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

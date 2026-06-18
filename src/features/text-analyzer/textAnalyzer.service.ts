export interface TextAnalysisResult {
  wordCount: number;
  charWithSpaces: number;
  charNoSpaces: number;
  sentenceCount: number;
  readingTimeMinutes: number;
  readabilityScore: number;
  readabilityLevel: string;
  keywordDensity: { word: string; count: number; percentage: number }[];
}

const TURKISH_STOPWORDS = new Set([
  've', 'veya', 'ama', 'fakat', 'ise', 'ile', 'bir', 'bu', 'su', 'o',
  'da', 'de', 'ki', 'en', 'daha', 'icin', 'gibi', 'kadar', 'olan', 'olarak',
  'olanlar', 'vb', 'veb', 'hepsı', 'hepsi', 'her', 'hic', 'bazi', 'bazı',
  'cunku', 'çünkü', 'dolayi', 'dolayı', 'oturu', 'ötürü', 'veya', 'yahut',
  'ise', 'biri', 'birisi', 'kendi', 'kendisi', 'mu', 'mi', 'mı', 'mü',
  'belki', 'sanki', 'yani', 'neyse', 'haliyle', 'ancak', 'yalniz', 'yalnız'
]);

export function analyzeText(text: string): TextAnalysisResult {
  if (!text || !text.trim()) {
    return {
      wordCount: 0,
      charWithSpaces: 0,
      charNoSpaces: 0,
      sentenceCount: 0,
      readingTimeMinutes: 0,
      readabilityScore: 100,
      readabilityLevel: 'Belirlenemedi',
      keywordDensity: []
    };
  }

  const charWithSpaces = text.length;
  const charNoSpaces = text.replace(/\s+/g, '').length;

  // Clean words list
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9çğıöşüAEIİOÖUÜ\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0);

  const wordCount = words.length;

  // Sentence count (split by periods, exclamation, questions)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = Math.max(1, sentences.length);

  // Vowel count (Turkish syllable count)
  const vowels = text.match(/[aeıioöuüAEIİOÖUÜ]/g);
  const vowelCount = vowels ? vowels.length : 0;

  // Reading time (average 180 words per minute)
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  // Turkish Ateşman Readability Formula:
  // Score = 206.835 - (1.015 * Avg_Sentence_Length) - (84.6 * Avg_Syllable_Count)
  // where Avg_Sentence_Length = wordCount / sentenceCount
  // Avg_Syllable_Count = vowelCount / wordCount
  const avgSentenceLength = wordCount / sentenceCount;
  const avgSyllableCount = wordCount > 0 ? vowelCount / wordCount : 0;
  
  let readabilityScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllableCount);
  readabilityScore = Math.max(0, Math.min(100, Math.round(readabilityScore)));

  let readabilityLevel = 'Orta (Lise Seviyesi)';
  if (readabilityScore > 90) {
    readabilityLevel = 'Cok Kolay (Ilkokul Seviyesi)';
  } else if (readabilityScore > 70) {
    readabilityLevel = 'Kolay (Ortaokul Seviyesi)';
  } else if (readabilityScore > 50) {
    readabilityLevel = 'Orta (Lise Seviyesi)';
  } else if (readabilityScore > 30) {
    readabilityLevel = 'Zor (Universite Seviyesi)';
  } else {
    readabilityLevel = 'Cok Zor (Akademik Seviyesi)';
  }

  // Keyword Density
  const freqMap: Record<string, number> = {};
  words.forEach(w => {
    // Exclude short words and stopwords
    if (w.length > 2 && !TURKISH_STOPWORDS.has(w)) {
      freqMap[w] = (freqMap[w] || 0) + 1;
    }
  });

  const sortedKeywords = Object.keys(freqMap)
    .map(key => ({
      word: key,
      count: freqMap[key],
      percentage: Math.round((freqMap[key] / wordCount) * 1000) / 10
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15); // Top 15 keywords

  return {
    wordCount,
    charWithSpaces,
    charNoSpaces,
    sentenceCount,
    readingTimeMinutes,
    readabilityScore,
    readabilityLevel,
    keywordDensity: sortedKeywords
  };
}

export type LessonPair = { en: string; sw: string };
export type Lesson = {
  id: string;
  title: string;
  summary: string;
  pairs?: LessonPair[];
  notes?: string[];
};

export const lessons: Lesson[] = [
  {
    id: "greetings",
    title: "Basic greetings",
    summary: "The handful of greetings that carry almost every first conversation.",
    pairs: [
      { en: "Hello (general)", sw: "Habari" },
      { en: "Hello (to an elder)", sw: "Shikamoo" },
      { en: "Reply to Shikamoo", sw: "Marahaba" },
      { en: "How are you?", sw: "Hujambo?" },
      { en: "I am fine", sw: "Sijambo" },
      { en: "Welcome", sw: "Karibu" },
      { en: "Goodbye", sw: "Kwaheri" },
    ],
  },
  {
    id: "numbers",
    title: "Numbers",
    summary: "Counting from one to ten, plus the round numbers you need for prices.",
    pairs: [
      { en: "1", sw: "moja" },
      { en: "2", sw: "mbili" },
      { en: "3", sw: "tatu" },
      { en: "4", sw: "nne" },
      { en: "5", sw: "tano" },
      { en: "6", sw: "sita" },
      { en: "7", sw: "saba" },
      { en: "8", sw: "nane" },
      { en: "9", sw: "tisa" },
      { en: "10", sw: "kumi" },
      { en: "20", sw: "ishirini" },
      { en: "100", sw: "mia moja" },
      { en: "1000", sw: "elfu moja" },
    ],
  },
  {
    id: "days",
    title: "Days and months",
    summary: "Swahili week days count from Saturday; months are borrowed and familiar.",
    pairs: [
      { en: "Monday", sw: "Jumatatu" },
      { en: "Tuesday", sw: "Jumanne" },
      { en: "Wednesday", sw: "Jumatano" },
      { en: "Thursday", sw: "Alhamisi" },
      { en: "Friday", sw: "Ijumaa" },
      { en: "Saturday", sw: "Jumamosi" },
      { en: "Sunday", sw: "Jumapili" },
      { en: "January", sw: "Januari" },
      { en: "June", sw: "Juni" },
      { en: "December", sw: "Desemba" },
    ],
  },
  {
    id: "vocabulary",
    title: "Common vocabulary",
    summary: "Words that show up in nearly every daily exchange.",
    pairs: [
      { en: "water", sw: "maji" },
      { en: "food", sw: "chakula" },
      { en: "money", sw: "pesa" },
      { en: "house", sw: "nyumba" },
      { en: "friend", sw: "rafiki" },
      { en: "work", sw: "kazi" },
      { en: "road", sw: "barabara" },
      { en: "today", sw: "leo" },
      { en: "tomorrow", sw: "kesho" },
    ],
  },
  {
    id: "grammar",
    title: "Basic grammar",
    summary: "Three patterns that unlock most simple sentences.",
    notes: [
      "Verbs are built from blocks: subject + tense + verb. Ni- (I) + -na- (present) + kula (eat) = ninakula, \u201cI am eating\u201d.",
      "Tense markers: -na- present, -li- past, -ta- future, -me- perfect. Nilikula (I ate), nitakula (I will eat), nimekula (I have eaten).",
      "Nouns belong to classes, and adjectives agree with the class: mtoto mzuri (a good child), watoto wazuri (good children), nyumba nzuri (a good house).",
    ],
  },
  {
    id: "pronunciation",
    title: "Pronunciation",
    summary: "Swahili is spelled the way it sounds, which makes it forgiving.",
    notes: [
      "Vowels never change: a as in father, e as in bet, i as in machine, o as in bore, u as in flute.",
      "Stress almost always lands on the second-to-last syllable: ka-RI-bu, a-SAN-te.",
      "Every letter is pronounced. ng\u2019 is a single sound as in \u201csinger\u201d; ny is like the ni in \u201conion\u201d.",
    ],
  },
  {
    id: "expressions",
    title: "Everyday expressions",
    summary: "Short phrases that make you sound natural straight away.",
    pairs: [
      { en: "No problem", sw: "Hakuna shida" },
      { en: "Sorry (sympathy)", sw: "Pole" },
      { en: "Congratulations", sw: "Hongera" },
      { en: "Slowly", sw: "Polepole" },
      { en: "Let\u2019s go", sw: "Twende" },
      { en: "God willing", sw: "Inshallah" },
      { en: "Truly", sw: "Kweli" },
    ],
  },
];

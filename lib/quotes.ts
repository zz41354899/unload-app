import i18n from '../i18n';

const quotesZh = [
  // 關於接納與放手
  '有些事情不在你的掌控中，但你學會接納它們的勇氣令人敬佩。',
  '放手不是放棄，而是智慧的選擇——你把能量用在真正能改變的事情上。',
  '你無法控制他人的想法，但你已經掌握了最重要的——控制自己的反應。',
  '接納現實，正是你展現力量的時刻。',
  
  // 關於行動與掌控
  '專注於你能控制的部分，你已經在做最聰明的事了。',
  '每一個小行動，都是你改變世界的開始。',
  '你比你想像的更有力量——相信自己。',
  '改變從認清現實開始，而你已經踏出了第一步。',
  
  // 關於課題分離
  '分清楚這是你的課題還是別人的，你就贏了。',
  '課題分離不是冷漠，而是你對自己和他人的尊重。',
  '你不需要為別人的選擇負責，這是你的自由。',
  '照顧好自己，你就能以最好的狀態陪伴他人。',
  
  // 關於成長與反思
  '每一次釐清，都是你變得更強大的證明。',
  '反思不是自責，而是你對自己的理解和關愛。',
  '你正在變得更清楚、更堅強，這個過程很美。',
  '在這個過程中，你正在學會最重要的——愛自己。',
  
  // 關於焦慮與壓力
  '焦慮來自於不確定，而你正在透過釐清找到確定。',
  '深呼吸。你已經在做該做的事了，你做得很好。',
  '不是所有的壓力都需要你承擔，你有權放下。',
  '你的感受是真實的，你的努力更是值得被看見。',
  
  // 關於決定與方向
  '沒有完美的選擇，但你的選擇就是最好的選擇。',
  '相信你的直覺，它通常是對的——你比自己想像的更聰慧。',
  '每個決定都是一次學習的機會，你在變得更聰明。',
  '方向比速度更重要，而你已經找到了自己的方向。',
  
  // 關於自我價值
  '你的價值不由他人定義，你本身就很珍貴。',
  '你已經足夠好了，真的。',
  '停止與他人比較，開始與昨天的自己比較——你在進步。',
  '你值得被溫柔對待，尤其是被自己。你做得很好。',
  
  // 關於未來
  '未來充滿可能性，而你正在用行動塑造它。',
  '不要被未知嚇倒，你有應對的能力——你一直都有。',
  '今天的選擇，塑造明天的你。你正在創造更好的自己。',
  '最好的時刻，就是現在。而你已經在這裡了。',
];

const quotesEn = [
  // Acceptance & letting go
  'Some things are outside your control, but your courage to accept them is admirable.',
  'Letting go is not giving up — it is choosing wisely where to place your energy.',
  'You cannot control what others think, but you can always choose your response.',
  'Accepting reality is exactly when your strength shows.',

  // Action & agency
  'When you focus on what you can control, you are already making the smartest move.',
  'Every small action is the beginning of changing your world.',
  'You are more capable than you think — trust yourself.',
  'Change starts with seeing things clearly, and you have already taken that first step.',

  // Task separation
  'Once you know what is your task and what is not, you have already won.',
  'Separating tasks is not coldness — it is respect for yourself and others.',
  "You do not have to take responsibility for others' choices.",
  'When you take care of yourself, you can show up better for the people you care about.',

  // Growth & reflection
  'Every time you clarify a situation, you become stronger.',
  'Reflection is not blaming yourself — it is understanding and caring for yourself.',
  'You are becoming clearer and more resilient, and that process is beautiful.',
  'Through this, you are learning the most important thing — how to be kind to yourself.',

  // Anxiety & pressure
  'Anxiety often comes from uncertainty; by clarifying, you are creating certainty for yourself.',
  'Take a deep breath. You are already doing what you can, and that is enough for now.',
  'Not every weight is yours to carry; you are allowed to put some of it down.',
  'Your feelings are real, and your efforts deserve to be seen.',

  // Decisions & direction
  'There is no perfect choice, but the choice you make can still be good enough.',
  'Trust your intuition — it is often wiser than you think.',
  'Every decision is a chance to learn; you are becoming more experienced each time.',
  'Direction matters more than speed, and you are already finding your way.',

  // Self-worth
  'Your worth is not defined by others — you are valuable as you are.',
  'You are already enough, truly.',
  'Stop comparing yourself to others; compare with who you were yesterday — you are growing.',
  'You deserve gentleness, especially from yourself. You are doing well.',

  // Future
  'The future is full of possibilities, and your actions today are shaping it.',
  'Do not be scared by the unknown — you have handled so much already.',
  'The choices you make today shape who you become tomorrow.',
  'The best time is now — and you are already here.',
];

const getCurrentQuotes = () => {
  const lang = i18n.language;
  if (lang.startsWith('en')) return quotesEn;
  return quotesZh;
};

export const quotes = getCurrentQuotes();

export const getRandomQuote = (): string => {
  const list = getCurrentQuotes();
  return list[Math.floor(Math.random() * list.length)];
};

export const getQuoteByControlLevel = (controlLevel: number): string => {
  const lang = i18n.language;
  if (controlLevel < 20) {
    const lowControlQuotes = lang.startsWith('en')
      ? [
          'Some things are outside your control — accepting this is already a form of strength.',
          'Letting go is not giving up; it is choosing where your energy truly matters.',
          'You cannot control others, but you can always choose how you respond.',
          'Accepting what you cannot change is the beginning of real peace.',
          'Not every burden is yours to carry; you are allowed to put some down.',
        ]
      : [
          '有些事情不在你的掌控中，但你學會接納它們的勇氣令人敬佩。',
          '放手不是放棄，而是智慧的選擇——你把能量用在真正能改變的事情上。',
          '你無法控制他人的想法，但你已經掌握了最重要的——控制自己的反應。',
          '接納現實，正是你展現力量的時刻。',
          '不是所有的壓力都需要你承擔，你有權放下。',
        ];
    return lowControlQuotes[Math.floor(Math.random() * lowControlQuotes.length)];
  } else if (controlLevel < 60) {
    const mediumControlQuotes = lang.startsWith('en')
      ? [
          'When you see clearly which part is yours and which part is others’, you gain real freedom.',
          'Separating tasks is not distance — it is a respectful boundary for both sides.',
          'For shared tasks, communication and collaboration are your strongest tools.',
          'You are learning the art of balancing control and letting go — that is not easy, and you are doing it.',
          'Every time you clarify things, you grow stronger and calmer.',
        ]
      : [
          '分清楚這是你的課題還是別人的，你就贏了。',
          '課題分離不是冷漠，而是你對自己和他人的尊重。',
          '溝通和協作是解決共同課題的鑰匙，而你正在學會這一點。',
          '平衡掌控與放手，你正在學會這個藝術——你做得很好。',
          '每一次釐清，都是你變得更強大的證明。',
        ];
    return mediumControlQuotes[Math.floor(Math.random() * mediumControlQuotes.length)];
  } else {
    const highControlQuotes = lang.startsWith('en')
      ? [
          'You are focusing on what you can change — that is powerful.',
          'Every small step you take is moving your life forward.',
          'You have more influence than you give yourself credit for.',
          'Change begins when you face reality honestly — and you already have.',
          'Trust your sense of direction; you have learned a lot to get here.',
        ]
      : [
          '專注於你能控制的部分，你已經在做最聰明的事了。',
          '每一個小行動，都是你改變世界的開始。',
          '你比你想像的更有力量——相信自己。',
          '改變從認清現實開始，而你已經踏出了第一步。',
          '相信你的直覺，它通常是對的——你比自己想像的更聰慧。',
        ];
    return highControlQuotes[Math.floor(Math.random() * highControlQuotes.length)];
  }
};

// 每日語錄 - 根據日期返回固定的語錄，確保同一天顯示相同的語錄
export const getDailyQuote = (): string => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const list = getCurrentQuotes();
  const quoteIndex = dayOfYear % list.length;
  return list[quoteIndex];
};

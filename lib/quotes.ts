import i18n from '../i18n';

export type DailyStepId =
  | 'stress'
  | 'inabilityToCope'
  | 'anxiety'
  | 'easilyTriggered'
  | 'hypervigilance'
  | 'procrastination'
  | 'distortedBelief'
  | 'lowSelfEsteem'
  | 'neglectNeeds'
  | 'unhelpfulCoping';

export interface DailyCue {
  id: DailyStepId;
  stageTitle: string;
  stageDescription: string;
  practiceName: string;
  practiceHint: string;
  actionSentence: string;
  anchorQuote: string;
}

const dailyCuesZh: DailyCue[] = [
  {
    id: 'stress',
    stageTitle: '壓力',
    stageDescription: '事情一件一件堆上來，身體開始繃緊。',
    practiceName: '生理性嘆息',
    practiceHint: '用兩段吸氣、一段長呼氣，把神經系統從「警報」拉回來。',
    actionSentence: '今天可以找三個空檔，做兩回生理性嘆息，讓身體先鬆一點。',
    anchorQuote: '當你願意先照顧身體的緊繃，心裡也會慢慢找回一點空間。',
  },
  {
    id: 'inabilityToCope',
    stageTitle: '無力應付情緒',
    stageDescription: '覺得「好像怎麼做都不夠」，情緒一波一波上來。',
    practiceName: '情緒標記法',
    practiceHint: '先把感受用一句話說出來，讓大腦知道「我看見你了」。',
    actionSentence: '今天可以對自己說出一句：此刻我感到的是……。',
    anchorQuote: '把感受說出來，不是變得脆弱，而是讓自己不再一個人扛。',
  },
  {
    id: 'anxiety',
    stageTitle: '焦慮',
    stageDescription: '腦袋停不下來，不斷預演最壞的情況。',
    practiceName: '5-4-3-2-1 著陸練習',
    practiceHint: '用感官把自己帶回現在，而不是卡在腦中的劇本。',
    actionSentence: '今天花兩分鐘，用 5-4-3-2-1 觀察一次眼前的世界。',
    anchorQuote: '當你回到「此刻」，那些還沒發生的擔心就暫時不用全扛在身上。',
  },
  {
    id: 'easilyTriggered',
    stageTitle: '容易被觸發',
    stageDescription: '一點小事就踩到地雷，連自己也嚇一跳。',
    practiceName: '神聖暫停',
    practiceHint: '在反應之前，先幫自己按下暫停鍵。',
    actionSentence: '今天試著在回訊息或回話前，多停三秒再送出。',
    anchorQuote: '你願意慢一點回應，本身就是在保護關係，也保護自己。',
  },
  {
    id: 'hypervigilance',
    stageTitle: '高度警覺',
    stageDescription: '一直掃描危險，連休息時也放鬆不了。',
    practiceName: '視覺流動散步',
    practiceHint: '讓視線慢慢掃過遠方，告訴身體「現在是安全的」。',
    actionSentence: '今天找五分鐘，走路時抬頭看看遠方，而不是只盯著手機。',
    anchorQuote: '你的身體值得知道：此刻沒有戰爭，現在可以稍微休息一下。',
  },
  {
    id: 'procrastination',
    stageTitle: '延宕',
    stageDescription: '越覺得重要的事，反而越想往後推。',
    practiceName: '五分鐘規則',
    practiceHint: '只答應自己先做五分鐘，而不是一次做到好。',
    actionSentence: '挑一件一直想做的事，今天只做五分鐘就可以收工。',
    anchorQuote: '你不需要一次跨完全程，每一個五分鐘，都是在為自己打開一點點路。',
  },
  {
    id: 'distortedBelief',
    stageTitle: '扭曲的負面自我信念',
    stageDescription: '腦中開始出現「都是我不好」「我就是這樣」的聲音。',
    practiceName: 'FFS 三步驟',
    practiceHint: '把「事實、感受、腦中的故事」區分開來。',
    actionSentence: '今天挑一件讓你自責的事，寫下：事實是…／我感到…／我腦中編的故事是…。',
    anchorQuote: '你看見「故事」的那一刻，就已經不完全被故事綁住了。',
  },
  {
    id: 'lowSelfEsteem',
    stageTitle: '低自尊',
    stageDescription: '覺得自己怎麼樣都不夠好，很難肯定自己。',
    practiceName: '小勝利日記',
    practiceHint: '把真正做到了的小事記下來，讓大腦有新的證據。',
    actionSentence: '今天睡前寫下三件你有做到的「小小勝利」。',
    anchorQuote: '你的價值不在巨大成就裡，而是藏在這些被你忽略的小努力。',
  },
  {
    id: 'neglectNeeds',
    stageTitle: '忽略基本需求',
    stageDescription: '忙到吃飯、睡覺、休息都被往後擠。',
    practiceName: '不可協商的生活儀式',
    practiceHint: '替自己訂一個「再忙也要做」的小儀式。',
    actionSentence: '今天幫自己安排一個 10～15 分鐘「不可協商」的休息時間。',
    anchorQuote: '當你願意把自己也排進行事曆，你的人生就不再只有別人的需求。',
  },
  {
    id: 'unhelpfulCoping',
    stageTitle: '無助益的應對方式',
    stageDescription: '靠刷手機、暴飲暴食、過度工作來麻木自己。',
    practiceName: '衝動衝浪',
    practiceHint: '不是馬上改掉，而是多陪這個衝動待一會兒。',
    actionSentence: '下次想滑手機逃避時，先觀察一分鐘身體的感覺，再決定要不要滑。',
    anchorQuote: '你不一定要馬上戒掉什麼，只要多看見一點當下，就已經在改寫循環。',
  },
];

const dailyCuesEn: DailyCue[] = [
  {
    id: 'stress',
    stageTitle: 'Stress',
    stageDescription: 'Tasks keep piling up and your body starts to tense.',
    practiceName: 'Physiological sigh',
    practiceHint: 'Use two short inhales and one long exhale to tell your nervous system it can stand down.',
    actionSentence: 'Today, find three short moments to do two rounds of physiological sighs.',
    anchorQuote: 'When you care for your tense body first, your mind slowly finds more space too.',
  },
  {
    id: 'inabilityToCope',
    stageTitle: 'Inability to cope',
    stageDescription: 'It feels like nothing you do is enough and your emotions come in waves.',
    practiceName: 'Affect labelling',
    practiceHint: 'Name your feeling in one sentence so your brain knows you have noticed it.',
    actionSentence: 'Today, say to yourself once: "Right now I am feeling…" and fill in the blank.',
    anchorQuote: 'Putting feelings into words is not weakness – it means you are no longer carrying them alone.',
  },
  {
    id: 'anxiety',
    stageTitle: 'Anxiety',
    stageDescription: 'Your mind keeps running worst-case scenarios and will not switch off.',
    practiceName: '5-4-3-2-1 grounding',
    practiceHint: 'Use your senses to come back to the present instead of staying in mental movies.',
    actionSentence: 'Take two minutes today to do one round of the 5-4-3-2-1 grounding practice.',
    anchorQuote: 'When you return to this moment, the worries that have not happened yet do not all have to sit on your shoulders.',
  },
  {
    id: 'easilyTriggered',
    stageTitle: 'Easily triggered',
    stageDescription: 'Small things hit your nerves and you surprise even yourself with your reactions.',
    practiceName: 'The sacred pause',
    practiceHint: 'Before you respond, give yourself a brief pause.',
    actionSentence: 'Today, try waiting three seconds before you reply to a message or comment.',
    anchorQuote: 'Choosing to respond a little slower is already protecting your relationships – and yourself.',
  },
  {
    id: 'hypervigilance',
    stageTitle: 'Hypervigilance',
    stageDescription: 'You are constantly scanning for danger and cannot fully rest.',
    practiceName: 'Optic flow walk',
    practiceHint: 'Let your gaze move slowly across the distance to remind your body it is safe now.',
    actionSentence: 'Find five minutes today to look up and notice the distance while you walk, instead of only your phone.',
    anchorQuote: 'Your body deserves to know there is no war right now – it is allowed to rest a little.',
  },
  {
    id: 'procrastination',
    stageTitle: 'Procrastination',
    stageDescription: 'The more important something feels, the more you want to push it away.',
    practiceName: 'The five-minute rule',
    practiceHint: 'Promise yourself only the first five minutes instead of finishing everything at once.',
    actionSentence: 'Choose one task you have been avoiding and work on it for just five minutes today.',
    anchorQuote: 'You do not have to cross the whole distance at once – every five minutes opens a little more space for you.',
  },
  {
    id: 'distortedBelief',
    stageTitle: 'Distorted self-beliefs',
    stageDescription: 'Thoughts like "It is all my fault" or "I am just like this" start to grow louder.',
    practiceName: 'FFS method (Fact, Feeling, Story)',
    practiceHint: 'Gently separate what actually happened, how you feel, and the story in your head.',
    actionSentence: 'Today, pick one thing you feel guilty about and write: Fact… / Feeling… / Story….',
    anchorQuote: 'The moment you see the story as a story, it already has a little less power over you.',
  },
  {
    id: 'lowSelfEsteem',
    stageTitle: 'Low self-esteem',
    stageDescription: 'It feels hard to see anything good about yourself.',
    practiceName: 'Small wins journal',
    practiceHint: 'Collect small things you actually did to give your brain new evidence.',
    actionSentence: 'Before you sleep, write down three small wins you managed today.',
    anchorQuote: 'Your worth is not only in big achievements – it is woven through these small, quiet efforts.',
  },
  {
    id: 'neglectNeeds',
    stageTitle: 'Neglecting needs',
    stageDescription: 'Meals, sleep, and rest keep being pushed to the side.',
    practiceName: 'Non‑negotiable rituals',
    practiceHint: 'Create a tiny ritual you will do even on your busiest days.',
    actionSentence: 'Schedule one 10–15 minute non‑negotiable break for yourself today.',
    anchorQuote: 'When you also put yourself on the calendar, your life stops revolving only around others’ needs.',
  },
  {
    id: 'unhelpfulCoping',
    stageTitle: 'Unhelpful coping',
    stageDescription: 'You numb out with endless scrolling, overeating, or overworking.',
    practiceName: 'Urge surfing',
    practiceHint: 'You do not have to quit immediately – just stay with the urge a little longer.',
    actionSentence: 'Next time you want to escape into your phone, notice your body for one minute before deciding.',
    anchorQuote: 'You do not need to be perfect – simply noticing the urge is already a step toward a different cycle.',
  },
];

const getCurrentDailyCues = (): DailyCue[] => {
  const lang = i18n.language;
  if (lang.startsWith('en')) return dailyCuesEn;
  return dailyCuesZh;
};

export const getQuoteByControlLevel = (controlLevel: number): string => {
  if (controlLevel < 20) {
    return i18n.t('newTask.result.quote.low');
  }

  if (controlLevel < 60) {
    return i18n.t('newTask.result.quote.mid');
  }

  return i18n.t('newTask.result.quote.high');
};

// 每日循環步驟提示 - 根據日期返回固定的步驟與出口提示
export const getDailyCue = (): DailyCue => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const list = getCurrentDailyCues();
  const index = dayOfYear % list.length;
  return list[index];
};

export const getDailyCueForStep = (id: DailyStepId): DailyCue | null => {
  const list = getCurrentDailyCues();
  return list.find((cue) => cue.id === id) ?? null;
};

// 向下相容：若有地方仍期望取得「一句話語錄」，使用每日步驟的 anchorQuote
export const getDailyQuote = (): string => {
  const cue = getDailyCue();
  return cue.anchorQuote;
};

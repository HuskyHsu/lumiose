// Evolution method translations
export const evolutionMethodTranslations = {
  zh: {
    Hisui: '洗翠地區',
    LevelUp: '等級提升',
    LevelUpAffection50MoveType: '親密度50+特定屬性招式',
    LevelUpFormFemale1: '等級提升(雌性)',
    LevelUpFriendship: '親密度提升',
    LevelUpFriendshipMorning: '親密度提升(早晨)',
    LevelUpFriendshipNight: '親密度提升(夜晚)',
    LevelUpInverted: '等級提升(顛倒)',
    LevelUpMale: '等級提升(雄性)',
    LevelUpMorning: '等級提升(早晨)',
    LevelUpMoveType: '等級提升+特定屬性招式',
    LevelUpNight: '等級提升(夜晚)',
    LevelUpWeather: '等級提升+特定天氣',
    Trade: '通信交換',
    TradeHeldItem: '通信交換+攜帶道具',
    UseItem: '使用道具',
    UseItemFemale: '使用道具(雌性)',
    UseItemMale: '使用道具(雄性)',
    MegaEvolution: '超級進化',
  },
  en: {
    Hisui: 'Hisui',
    LevelUp: 'Level Up',
    LevelUpAffection50MoveType: 'Level Up + Affection 50 + Move Type',
    LevelUpFormFemale1: 'Level Up (Female)',
    LevelUpFriendship: 'Level Up + Friendship',
    LevelUpFriendshipMorning: 'Level Up + Friendship (Morning)',
    LevelUpFriendshipNight: 'Level Up + Friendship (Night)',
    LevelUpInverted: 'Level Up (Inverted)',
    LevelUpMale: 'Level Up (Male)',
    LevelUpMorning: 'Level Up (Morning)',
    LevelUpMoveType: 'Level Up + Move Type',
    LevelUpNight: 'Level Up (Night)',
    LevelUpWeather: 'Level Up + Weather',
    Trade: 'Trade',
    TradeHeldItem: 'Trade + Held Item',
    UseItem: 'Use Item',
    UseItemFemale: 'Use Item (Female)',
    UseItemMale: 'Use Item (Male)',
    MegaEvolution: 'Mega Evolution',
  },
} as const;

export type SupportedLanguage = keyof typeof evolutionMethodTranslations;
export type EvolutionMethod = keyof typeof evolutionMethodTranslations.zh;

// Default language
export const DEFAULT_LANGUAGE: SupportedLanguage = 'zh';

// Get translation for evolution method
export function getEvolutionMethodTranslation(
  method: string,
  language: SupportedLanguage = DEFAULT_LANGUAGE
): string {
  const translations = evolutionMethodTranslations[language];
  return translations[method as EvolutionMethod] || method;
}

// Hook for future i18n context integration
export function useTranslation(language: SupportedLanguage = DEFAULT_LANGUAGE) {
  return {
    getEvolutionMethodTranslation: (method: string) =>
      getEvolutionMethodTranslation(method, language),
  };
}

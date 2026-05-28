export interface Profile {
  major: string;
  habits: string;
  coping: string;
  philosophy: string;
}

export interface Stats {
  money: number;
  stress: number;
  codingSkill: number;
  reputation: number;
  motivation: number;
}

export interface Choice {
  id: string;
  text: string;
  flavorText: string;
}

export interface Phase {
  year: string;
  title: string;
  narrative: string;
  statChanges?: {
    money: number;
    stress: number;
    codingSkill: number;
    reputation: number;
    motivation: number;
  };
  choices?: Choice[];
  chosenId?: string; // Cache which choice was picked
  endingArchetype?: string;
  lessonsLearned?: string[];
  isEnding?: boolean;
}

export interface EventLog {
  year: string;
  title: string;
  narrative: string;
  chosenOptionText?: string;
}

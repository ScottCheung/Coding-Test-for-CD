/** @format */

export interface AflScore {
  goals: number;
  behinds: number;
  points: number;
}

export interface AflSquad {
  score: AflScore;
  code: string;
  id: number;
  name: string;
}

export interface AflMatchDate {
  startDate: string;   // "2019-03-21"
  startTime: string;   // "19:25:00"
  utcMatchStart: string;
}

export interface AflMatchStatus {
  id: number;
  name: string;
  code: string;
  typeId: number;
  typeName: string;
}

export interface AflMatchType {
  id: number;
  name: string;
  code: string;
}

export interface AflVenue {
  id: number;
  code: string;
  name: string;
  timeZone: string;
}

export interface AflMatch {
  id: number;
  roundOrder: number;
  squads: {
    away: AflSquad;
    home: AflSquad;
  };
  date: AflMatchDate;
  status: AflMatchStatus;
  type: AflMatchType;
  venue: AflVenue;
}

export interface AflRound {
  code: string;   // "R01"
  id: number;
  matches: AflMatch[];
}

export interface AflPhase {
  rounds: AflRound[];
}

export interface AflFixture {
  competitionCode: string;
  competitionId: number;
  competitionName: string;
  competitionType: string;
  endDate: string;
  endYear: number;
  firstMatchStart: string;
  phases: AflPhase[];
}

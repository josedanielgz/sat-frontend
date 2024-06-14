import { Action } from '@ngrx/store';
import { RiskUFPS, StatisticsRisk } from 'src/app/model/risk';

export const LOAD_RISK = '[RISK] Cargar riesgos';
export const REMOVE_RISK = '[RISK] Eliminar riesgos';
export const SET_RISK_GLOBAL = '[RISK] Cargar riesgo global';
export const LOAD_STATISTICS = '[RISK] Cargar filtro de estadisticas';
export const UNLOAD_STATISTICS = '[RISK] Quitar filtro de estadisticas';

export class LoadRiskAction implements Action {
  readonly type = LOAD_RISK;
  constructor(public payload: RiskUFPS[]) {}
}

export class SetRiskGlobalAction implements Action {
  readonly type = SET_RISK_GLOBAL;
  constructor(public payload: number) {}
}

export class RemoveRiskAction implements Action {
  readonly type = REMOVE_RISK;
  constructor() {}
}

export class LoadStatisticsAction implements Action {
  readonly type = LOAD_STATISTICS;
  constructor(public payload: StatisticsRisk) {}
}

export class UnloadStatisticsAction implements Action {
  readonly type = UNLOAD_STATISTICS;
  constructor() {}
}

export type actions =
  | LoadRiskAction
  | RemoveRiskAction
  | SetRiskGlobalAction
  | LoadStatisticsAction
  | UnloadStatisticsAction;

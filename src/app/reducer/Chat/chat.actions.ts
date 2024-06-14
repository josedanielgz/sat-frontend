import { Action } from '@ngrx/store';
import { ResponseChat } from 'src/app/model/chat';

export const LOADING_CHAT = '[CHAT] Loading Chat';
export const DELETE_CHAT = '[CHAT] Delete Chat';
export const NEW_MSG_CHAT = '[CHAT] Add Message Chat';

export class LoadingChatAction implements Action {
  readonly type = LOADING_CHAT;
  constructor(public payload: ResponseChat[]) {}
}

export class DeleteChatAction implements Action {
  readonly type = DELETE_CHAT;
  constructor() {}
}

export class AddMsgChatAction implements Action {
  readonly type = NEW_MSG_CHAT;
  constructor(public payload: ResponseChat) {}
}

export type actions = LoadingChatAction | DeleteChatAction | AddMsgChatAction;

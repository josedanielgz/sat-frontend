import { ResponseChat } from 'src/app/model/chat';
import * as fromChat from './chat.actions';

export interface ChatState {
  chat: ResponseChat[];
}
const initState: ChatState = {
  chat: [],
};

export const chatReducer = (
  state = initState,
  actions: fromChat.actions
): ChatState => {
  switch (actions.type) {
    case fromChat.LOADING_CHAT:
      return {
        ...state,
        chat: actions.payload,
      };

    case fromChat.DELETE_CHAT:
      return {
        ...state,
        chat: [],
      };

    case fromChat.NEW_MSG_CHAT:
      return {
        ...state,
        chat: [...state.chat, actions.payload],
      };

    default:
      return state;
  }
};

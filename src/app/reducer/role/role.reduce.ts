import { Role } from 'src/app/model/role';
import * as fromRole from './role.action';

export interface RoleState {
  roles: Role[];
}

const initState: RoleState = {
  roles: [],
};

export const roleReduce = (
  state = initState,
  actions: fromRole.actions
): RoleState => {
  switch (actions.type) {
    case fromRole.LOAD_ROLE:
      return { ...state, roles: [...actions.payload] };

    case fromRole.REMOVE_ROLE:
      return { ...initState };

    case fromRole.ADD_ROLE:
      return { ...state, roles: [...state.roles, actions.payload] };

    default:
      return { ...state };
  }
};

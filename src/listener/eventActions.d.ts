type UniqueNodeActionTypes = 'add parent and child 1' | 'add parent and child 2' | 'prune child'
type MainMapActionTypes = 'regen main map'
type AppActionTypes = 'reset session' | 'load user data'
type ControlPanelActionTypes = 'sign in with google' | 'sign out with google' | 'set active board' | 'add board' | 'delete board' | 'read board' | 'save board'




declare type ActionTypes = null | AppActionTypes | UniqueNodeActionTypes | MainMapActionTypes | ControlPanelActionTypes
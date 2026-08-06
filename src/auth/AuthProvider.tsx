import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useImmerReducer } from "use-immer";

interface User {
  token: string | null;
  username: string | null;
  role: string | null;
  attributeEditing: String[];
  geometryEditing: String[];
}

const AuthContext = createContext<any>(undefined);

type AuthAction = 
  | { type: "login"; data: User }
  | { type: "logout" };

interface AuthState {
  loggedIn: boolean;
  user: User;
}


function authReducer(draft:AuthState, action:AuthAction) {
  switch (action.type) {
    case "login":
      draft.loggedIn = true;
      draft.user = action.data;
      return;
    case "logout":
      draft.loggedIn = false;
      draft.user = {
        token: null,
        username: null,
        role: null,
        attributeEditing: [],
        geometryEditing: [],
      };
      return;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}
function AuthProvider({ children }:AuthProviderProps) {
   
  const initialState = {
    loggedIn: localStorage.getItem("token") !== null ? true : false,
    user: {
      token: localStorage.getItem("token"),
      username: localStorage.getItem("username"),
      role: null,
      attributeEditing: [],
      geometryEditing: [],
    }
  };
  const [state, dispatch] = useImmerReducer(authReducer, initialState);
  
  

  // login logic
  function login(data:User): void {
    dispatch({ type: "login", data });
    localStorage.setItem("token", data.token || "");
    localStorage.setItem("username", data.username || "");
  }

  // logout logic
  function logout() {
    dispatch({ type: "logout" });
    localStorage.clear();
  }

   
  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
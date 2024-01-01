import { createContext, useEffect } from "react";

interface MainContextProps {}

const mainContextProps: MainContextProps = {};

const MainContext = createContext<MainContextProps>(mainContextProps);

const MainProvider = ({ children }: any) => {
  // useEffect(() => {
  //   console.log("xD");
  // }, []);

  const value: MainContextProps = {};
  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

export default MainProvider;

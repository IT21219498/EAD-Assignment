import { createContext, useState } from "react";
import PropTypes from "prop-types";

const CommonContext = createContext();

export const CommonContextProvider = ({ children }) => {
  const [screenName, setScreenName] = useState("Dashboard");
  const [isDirty, setIsDirty] = useState(false);
  const [distributorName, setDistributorName] = useState("");

  return (
    <CommonContext.Provider
      value={{
        screenName,
        setScreenName,
        isDirty,
        setIsDirty,
        distributorName,
        setDistributorName,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};

//validate prop types
CommonContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CommonContext;

import { useAsyncThrowError } from "../hooks/useAsyncThrowError";
import { createContext, useState, useEffect, useContext } from "react";
import { getComplexes, getOrganizations } from "../services/codesService";

const CodesContext = createContext({});

export const useCodes = () => useContext(CodesContext);

export const CodesContextProvider = ({ children }) => {
  const { throwError } = useAsyncThrowError();

  const [complexes, setComplexes] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [currentComplex, setCurrentComplex] = useState(0);
  const [newDisabled, setNewDisabled] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: complexes }, { data: organizations }] = await Promise.all([
          getComplexes(),
          getOrganizations()
        ]);
        setComplexes(complexes);
        setOrganization(organizations);
      } catch (err) {
        throwError(err);
      }
    })();
  }, []);

  return (
    <CodesContext.Provider
      value={{ complexes, organization, currentComplex, newDisabled, setNewDisabled, setCurrentComplex }}
    >
      {children}
    </CodesContext.Provider>
  );
};

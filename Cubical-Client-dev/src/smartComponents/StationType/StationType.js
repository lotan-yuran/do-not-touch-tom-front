import { useState, useEffect } from "react";

// Style
import styles from "./stationType.module.scss";

// Design component
import { DropList } from "../../stories/DropList/DropList";

// Hooks
import { useAsyncThrowError } from "../../hooks/useAsyncThrowError";

// util
import { useCodes } from "../../context/codesContext";
import { isNullOrUndefinedOrEmpty } from "../../utilities/general";

// Services
import { getActiveAvailableStationsByComplex } from "../../services/codesService";

export const StationType = ({ stationId, onChange, PropsSelect, complexId, ...props }) => {
  const [loading, setLoading] = useState(false);
  const [availableStations, setAvailableStations] = useState(null);

  const { complexes, currentComplex } = useCodes();
  if (!complexId) {
    complexId = complexes[currentComplex]?.id;
  }

  const { throwError } = useAsyncThrowError("dialog");

  useEffect(() => {
    complexes &&
      complexId &&
      (async () => {
        try {
          let temp;
          setLoading(true);

          const { data } = await getActiveAvailableStationsByComplex(complexId);
          temp = data;

          setAvailableStations(temp);
          if (isNullOrUndefinedOrEmpty(stationId)) onChange(temp[0]?.id);

          setLoading(false);
        } catch (err) {
          setLoading(false);
          throwError(err);
        }
      })();
  }, [complexId]);

  return (
    <div className={styles["station-type"]}>
      <DropList
        fullWidth={true}
        {...props}
        {...PropsSelect}
        loading={loading}
        value={stationId ? stationId : availableStations?.length ? availableStations[0]?.id : null}
        onChange={onChange}
        options={availableStations}
      />
    </div>
  );
};

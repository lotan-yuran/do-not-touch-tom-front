import { useState, useEffect } from "react";

// Design component
import { DropList } from "../../stories/DropList/DropList";

// Hooks
import { useAsyncThrowError } from "../../hooks/useAsyncThrowError";

// Services
import { getActiveStationsByStationTypeAdmin } from "../../services/appointmentManagementService";
import { useCodes } from "../../context/codesContext";

export const Station = ({ stationId, onChange, stationTypeId, PropsSelect }) => {
  const [loading, setLoading] = useState(false);
  const [availableStations, setAvailableStations] = useState(null);
  const { complexes, currentComplex } = useCodes();
  const complexId = complexes[currentComplex]?.id;

  const { throwError } = useAsyncThrowError("dialog");

  useEffect(() => {
    (async () => {
      if (stationTypeId) {
        try {
          setLoading(true);
          const { data } = await getActiveStationsByStationTypeAdmin(stationTypeId, complexId);
          onChange(stationId || data[0]?.id);
          setAvailableStations(data.map(({ id, isActive }) => ({ id, name: id, disabled: !isActive })));
          setLoading(false);
        } catch (err) {
          setLoading(false);
          throwError(err);
        }
      }
    })();
  }, [stationTypeId]);

  return (
    <div>
      <DropList
        fullWidth={true}
        {...PropsSelect}
        loading={loading}
        value={stationId}
        onChange={onChange}
        options={availableStations}
      />
    </div>
  );
};

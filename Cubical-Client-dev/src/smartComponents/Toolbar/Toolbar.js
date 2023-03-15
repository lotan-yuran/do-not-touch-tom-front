import TomLogo from "../../icons/TomLogo";
import styles from "./toolbar.module.scss";
import { useState, useEffect } from "react";
import { admin } from "../../styles/colors";
import { InfoUser } from "../InfoUser/InfoUser";
import { ArrowDropDown } from "@material-ui/icons";
import { useCodes } from "../../context/codesContext";
import { ArrowLeft } from "../../icons/ArrowLeft/ArrowLeft";
import { ArrowRight } from "../../icons/ArrowRight/ArrowRight";
import { useAsyncThrowError } from "../../hooks/useAsyncThrowError";
import { getDateActiveIncrement, getDateActiveDecrement } from "../../utilities/date";
import {
  getScheduleAdmin,
  getAvailableStationsByComplexAdmin
} from "../../services/appointmentManagementService";

import { Input } from "../../stories/Input/Input";
import ComplexMenu from "./ComplexMenu/ComplexMenu";
import { Button } from "../../stories/Button/Button";
import { DropList } from "../../stories/DropList/DropList";
import { LinearProgress, Typography } from "@material-ui/core";
import { design, designIcons, designButton, designInput } from "../../constants/toolbar";
import { DateNavigatorOverlay } from "../../stories/DateNavigatorOverlay/DateNavigatorOverlay";

import { DrawerManagerSettings } from "../DrawerManagerSettings/DrawerManagerSettings";

export const Toolbar = ({
  dataStationsObjFilter,
  setDataStations,
  loading,
  date,
  setDate,
  setSearchMessage
}) => {
  const [stations, setStations] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filterBySearch, setFilterBySearch] = useState(false);
  const [stationValue, setStationValue] = useState(null);
  const [weekdaysActivityTime, setWeekdaysActivityTime] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [isComplexMenuOpen, setIsComplexMenuOpen] = useState(false);

  const toggleComplexMenu = event => {
    setMenuAnchor(event.currentTarget);
    setIsComplexMenuOpen(!isComplexMenuOpen);
  };

  const { complexes, currentComplex, setCurrentComplex } = useCodes();

  const { throwError } = useAsyncThrowError("dialog");

  useEffect(() => {
    (async () => {
      try {
        const [
          { data },
          {
            data: { weekdaysActivityTime }
          }
        ] = await Promise.all([
          //todo-complexid
          getAvailableStationsByComplexAdmin(complexes ? complexes[currentComplex]?.id : ""),
          getScheduleAdmin(complexes ? complexes[currentComplex]?.id : "")
        ]);
        setDate(getDateActiveIncrement(Object.keys(weekdaysActivityTime), new Date()));
        setStationValue(data.length + 1);
        setStations(data);
        setWeekdaysActivityTime(weekdaysActivityTime);
      } catch (err) {
        throwError(err);
      }
    })();
  }, [currentComplex]);

  const handleKeyDown = event => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (searchValue !== "") {
      setDataStations(
        Object.values(dataStationsObjFilter?.default).filter(
          item => item.id === Number(searchValue) || item?.name?.includes(searchValue)
        )
      );
      setSearchMessage(searchValue);
      setStationValue(stations.length + 2);
      setFilterBySearch(true);
    }
  };

  const clearSearch = () => {
    setDataStations(Object.values(dataStationsObjFilter?.default));
    setSearchValue("");
    setFilterBySearch(false);
  };

  return (
    <>
      <div className={styles["toolbar"]}>
        <div className={styles["logo"]}>
          <TomLogo fontSize="inherit" />
        </div>

        {complexes && (
          <div>
            <div onClick={toggleComplexMenu}>
              <div className={styles.complexDiv}>
                {complexes[currentComplex] && (
                  <Typography className={styles.complexTitle}>{complexes[currentComplex].name}</Typography>
                )}
                <ArrowDropDown />
              </div>

              <ComplexMenu
                isOpen={isComplexMenuOpen}
                onClose={() => setIsComplexMenuOpen(false)}
                data={complexes}
                setSelected={setCurrentComplex}
                menuAnchor={menuAnchor}
                setMenuAnchor={setMenuAnchor}
              />
            </div>
          </div>
        )}
        {complexes && (
          <div className={styles["manager-settings"]}>
            <DrawerManagerSettings complexId={complexes[currentComplex]?.id} />
          </div>
        )}

        <Button
          {...design}
          onClick={() => setDate(getDateActiveIncrement(Object.keys(weekdaysActivityTime), new Date()))}
        >
          {"היום"}
        </Button>
        <div className={styles["date-navigator"]}>
          <Button
            {...designIcons}
            onClick={() =>
              setDate(
                getDateActiveDecrement(
                  Object.keys(weekdaysActivityTime),
                  new Date(date?.setDate(date?.getDate() - 1))
                )
              )
            }
          >
            <ArrowRight />
          </Button>
          <DateNavigatorOverlay
            date={date}
            onChange={setDate}
            PropsComponent={design}
            typeComponentDisplay="Button"
            weekdaysActivityTime={weekdaysActivityTime}
          />
          <Button
            {...designIcons}
            onClick={() =>
              setDate(
                getDateActiveIncrement(
                  Object.keys(weekdaysActivityTime),
                  new Date(date?.setDate(date?.getDate() + 1))
                )
              )
            }
          >
            <ArrowLeft />
          </Button>
        </div>
        <div className={styles["search"]}>
          <Input
            {...designInput}
            value={searchValue}
            onKeyDown={handleKeyDown}
            onChange={e => {
              setSearchValue(e.target.value);
            }}
            endAdornment={
              filterBySearch ? (
                <Button {...designButton} onClick={clearSearch} backgroundColor={admin.blue}>
                  נקה
                </Button>
              ) : (
                <Button
                  {...designButton}
                  onClick={handleSearch}
                  disabled={searchValue === ""}
                  backgroundColor={searchValue === "" ? admin.disabled : admin.blue}
                >
                  הצגה
                </Button>
              )
            }
          />
        </div>
        <div className={styles["drop-list"]}>
          <DropList
            {...design}
            width={200}
            value={stationValue ? stationValue : 1}
            options={
              stations
                ? [
                    ...stations,
                    { id: stations.length + 1, name: "כל העמדות" },
                    { id: stations.length + 2, name: "", showOption: false }
                  ]
                : []
            }
            onChange={value => {
              setStationValue(value);
              setDataStations(
                dataStationsObjFilter[value] ?? Object.values(dataStationsObjFilter?.default || {})
              );
              setSearchValue("");
            }}
          />
        </div>
        <InfoUser />
      </div>
      {loading && <LinearProgress />}
    </>
  );
};

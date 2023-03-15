import moment from "moment-timezone";
import { useState, useEffect } from "react";
import { TextField, Typography } from "@material-ui/core";

import _ from "lodash";

// Style
import { admin, buttonStyle } from "../../styles/colors";
import style from "./drawerInfoStation.module.scss";

// Design component
import { Button } from "../../stories/Button/Button";
import { Dialog } from "../../stories/Dialog/Dialog";

// Hooks
import useStyles from "./DrawerInfoStation.style";
import { useAsyncThrowError } from "../../hooks/useAsyncThrowError";

// Services
import disabledStationService from "../../services/disabledStationService";
import { setStationActivityAdmin } from "../../services/appointmentManagementService";

// Material-ui
import { Close, Add, Remove } from "@material-ui/icons";
import { Drawer, IconButton, FormControlLabel, Switch } from "@material-ui/core";

// Constants
import { FORMAT, getMaxDate } from "../../utilities/date";
import { COMPONENT_IDS } from "../../constants/componentIds";
import { propsDesignDialog, messagesDialogCancelStation } from "../../constants/schedule";

const getChanges = (source, target) => {
  return source.filter(sourceData => !target.some(targetData => targetData.id === sourceData.id));
};

const isSameDisables = (updatedData, existData) => {
  if (existData?.length !== updatedData?.length) {
    return false;
  }

  return updatedData.every(updated => {
    return existData.some(
      exist => new Date(exist?.start_date).getTime() === new Date(updated?.start_date).getTime()
    );
  });
};

const getLocalDateTime = date => {
  const dateValue = new Date(date);

  return `${dateValue?.toLocaleTimeString(FORMAT).split(" ")[0]} ${dateValue?.toLocaleDateString(FORMAT)}`;
};
export const DrawerInfoStation = ({
  nameStation,
  idStation,
  setLoading,
  typStation,
  infoStation,
  setStationsFilter,
  setNewDisabled
}) => {
  const { throwError } = useAsyncThrowError("dialog");
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [infoStationState, setInfoStationState] = useState(infoStation);
  const [openDialog, setOpenDialog] = useState(false);
  const [disabledData, setDisabledData] = useState([]);
  const [existDisableData, setExistDisableData] = useState([]);
  const [disableStartDate, setDisableStartDate] = useState(null);
  const [disableEndDate, setDisableEndDate] = useState(null);
  const [isStationActive, setIsStationActive] = useState(true);

  useEffect(() => {
    setDisabledData([]);
    setExistDisableData([]);

    disabledStationService.getStationDisableData(idStation).then(data => {
      data?.forEach(disable => {
        setExistDisableData(prev => [
          ...prev,
          {
            id: disable.id,
            start_date: getLocalDateTime(disable.start_date),
            end_date: getLocalDateTime(disable.end_date),
            title: disable.title
          }
        ]);
        setDisabledData(prev => [
          ...prev,
          {
            id: disable.id,
            start_date: getLocalDateTime(disable.start_date),
            end_date: getLocalDateTime(disable.end_date),
            title: disable.title
          }
        ]);
      });

      if (!data || data.length > 1 || data.length === 0) {
        return false;
      }

      setIsStationActive(!moment(data[0].end_date).isSame(moment(getMaxDate())));
    });
  }, [infoStationState, open]);

  useEffect(() => {
    !open && setInfoStationState(infoStation);
    setDisabled(true);
  }, [open, openDialog]);

  useEffect(() => {
    disabledData?.length == 0 && setIsStationActive(true);
  }, [disabledData]);

  useEffect(() => {
    setDisabled(
      _.isEqual(_.omitBy(infoStation, _.isNil), _.omitBy(infoStationState, _.isNil)) &&
        isSameDisables(existDisableData, disabledData)
    );
  }, [infoStationState, disabledData, open]);

  const save = async () => {
    try {
      setOpen(false);
      setLoading(true);

      const { data } = await setStationActivityAdmin(
        idStation,
        getChanges(disabledData, existDisableData), /// get added disables
        getChanges(existDisableData, disabledData) /// get deleted disables
      );
      setStationsFilter(prev => {
        const temp = { ...prev };
        const objOfStationsByType = temp[infoStation.fieldNameOnObjFilter]?.[infoStation.indexOnObjFilter];
        if (Object.keys(objOfStationsByType).length > 0) {
          objOfStationsByType[infoStation.indexOnObjFilter] = {
            ...(objOfStationsByType[infoStation.indexOnObjFilter] || {}),
            ...data
          };
          temp.default[idStation] = { ...temp.default[idStation], ...data };
        }

        return temp;
      });
      setNewDisabled(prev => prev + 1);
    } catch (e) {
      setLoading(false);
      throwError(e);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOkDialog = async () => {
    setOpenDialog(false);
    save();
  };

  const handleSwitchChange = target => {
    if (!target.checked) {
      setIsStationActive(false);
      const endDate = getMaxDate();
      setDisabledData([
        {
          start_date: getLocalDateTime(moment()),
          end_date: endDate,
          title: ""
        }
      ]);
    } else {
      setDisabledData([]);
      setIsStationActive(true);
    }
  };

  return (
    <>
      <Button
        id={COMPONENT_IDS.ADMIN.BUTTONS.OPEN_STATION_DRAWER}
        shape="square"
        fullWidth={true}
        style={{ minHeight: 110 }}
        onClick={() => setOpen(true)}
        backgroundColor={"rgba(0, 0, 0, 0)"}
      >
        <>
          <Typography>{`עמדה ${idStation}`}</Typography>
          <Typography>
            {typStation}
            {nameStation && ` - ${nameStation}`}
          </Typography>
          {!isStationActive ? (
            <Typography className={style["text-inactive"]}>{"עמדה לא פעילה"}</Typography>
          ) : (
            <Typography className={style["transparent-text"]}></Typography>
          )}
        </>
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)} classes={{ paper: style.paper }}>
        <div className={style["line"]}>
          <IconButton id={COMPONENT_IDS.ADMIN.BUTTONS.CLOSE_STATION_DRAWER} onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
          <div className={style["button-save"]}>
            <Button
              id={COMPONENT_IDS.ADMIN.BUTTONS.SAVE_AND_EXIT_STATION_DRAWER}
              shape="square"
              color={buttonStyle.light}
              onClick={save}
              disabled={disabled}
              backgroundColor={disabled ? buttonStyle.lightBackground : admin.blue}
              className={classes.button}
            >
              {"שמור וסגור"}
            </Button>
          </div>
        </div>
        <div className={style["line"]}>
          <h3>{`עמדה ${idStation}`}</h3>
          <h4>{typStation}</h4>
          <FormControlLabel
            control={
              <Switch
                id={COMPONENT_IDS.ADMIN.BUTTONS.TOGGLE_STATION_INACTIVE}
                classes={style}
                checked={isStationActive}
                onChange={({ target }) => handleSwitchChange(target)}
              />
            }
            label={isStationActive ? "עמדה פעילה" : "עמדה לא פעילה"}
            className={classes.switch}
          />
          <div className={classes.dates}>
            {isStationActive && (
              <div>
                <Typography>השבתה לתאריכים מסוימים</Typography>
                <div className={classes.dates}>
                  <TextField
                    id={COMPONENT_IDS.ADMIN.DROPDOWNS.PARTIAL_DEACTIVATION_START_DATE}
                    label="התחלת ההשבתה"
                    type="datetime-local"
                    className={classes.textField}
                    value={disableStartDate}
                    defaultValue={new Date()}
                    onChange={({ target }) => {
                      setDisableStartDate(target.value);
                    }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                  <TextField
                    id={COMPONENT_IDS.ADMIN.DROPDOWNS.PARTIAL_DEACTIVATION_END_DATE}
                    label="סוף ההשבתה"
                    type="datetime-local"
                    className={classes.textField}
                    value={disableEndDate}
                    onChange={({ target }) => setDisableEndDate(target.value)}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                  <IconButton
                    id={COMPONENT_IDS.ADMIN.BUTTONS.ADD_PARTIAL_DEACTIVATION}
                    onClick={() => {
                      setDisabledData(prev => [
                        ...prev,
                        {
                          start_date: disableStartDate,
                          end_date: disableEndDate,
                          title: ""
                        }
                      ]);
                      setDisableStartDate(null);
                      setDisableEndDate(null);
                    }}
                  >
                    <Add />
                  </IconButton>
                </div>
              </div>
            )}

            {disabledData?.map((data, index) => {
              return (
                <div key={data.title}>
                  <div className={classes.disabledData}>
                    <IconButton
                      id={COMPONENT_IDS.ADMIN.BUTTONS.REMOVE_PARTIAL_DEACTIVATION}
                      onClick={() => setDisabledData(prev => prev.filter(existData => existData !== data))}
                    >
                      <Remove />
                    </IconButton>

                    <TextField
                      autoFocus
                      key={index}
                      label="כותרת"
                      value={data.title}
                      onChange={({ target }) =>
                        isStationActive
                          ? setDisabledData(prev =>
                              prev.map(disData => {
                                return disData === data ? { ...data, title: target.value } : disData;
                              })
                            )
                          : setDisabledData(prev => {
                              return [{ ...prev[0], title: target.value }];
                            })
                      }
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </div>
                  {isStationActive ? (
                    <Typography>
                      המתחם הושבת לתאריכים {data.start_date} - {data.end_date}
                    </Typography>
                  ) : (
                    <Typography>המתחם יושבת מתאריך {data.start_date}</Typography>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Drawer>

      <Dialog
        open={openDialog}
        onOk={handleOkDialog}
        {...propsDesignDialog}
        onClose={handleCloseDialog}
        onCancel={handleCloseDialog}
        {...messagesDialogCancelStation}
      >
        <Typography>
          {`הקפאת העמדה תחליף את ההזמנות הקיימות בעמדות חלופיות.`}
          <br />
          {`במידה ולא ימצאו עמדות פנויות, ההזמנות יבוטלו ונעדכן את המשתמש באסמס`}
        </Typography>
        <br />
        <br />
      </Dialog>
    </>
  );
};

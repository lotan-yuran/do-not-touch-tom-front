import { useState, useEffect } from "react";

// Icons
import { ManagerSettings } from "../../imgSvg/ManagerSettings/ManagerSettings";
// Style
import useStyles from "./DrawerManagerSettings.style";
import style from "./DrawerManagerSettings.module.scss";
// Design component
import { Loader } from "../../stories/Loader/Loader";
import { Drawer, IconButton, Button, Divider } from "@material-ui/core";

//Components
import { ComplexInfo } from "./ComplexInfo/ComplexInfo";
import { ComplexManagers } from "./ComplexManagers/ComplexManagers";
import { DisableComplex } from "./DisableComplex/DisableComplex";
// Services
import complexService from "../../services/complexService";
import { onSaveComplexData } from "./utils/complexManagerSettingsUtils";
import { useCodes } from "../../context/codesContext";

export const DrawerManagerSettings = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [complexData, setComplexData] = useState();
  const [complexDataAfterUpdate, setComplexDataAfterUpdate] = useState();
  const { complexes, currentComplex, newDisabled, setNewDisabled } = useCodes();

  useEffect(() => {
    (async () => {
      try {
        const data = await complexService.getComplexData(complexes[currentComplex]?.id);
        setComplexData(data);
        setComplexDataAfterUpdate(data);
      } catch (error) {
        console.log("err", error);
      }
    })();
  }, [complexes[currentComplex]?.id, open]);

  const onSave = async () => {
    setIsLoading(true);
    await onSaveComplexData(complexData, complexDataAfterUpdate);
    setNewDisabled(prev => prev + 1);
    setIsLoading(false);
    setOpen(false);
  };
  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <ManagerSettings />
      </IconButton>

      <Drawer open={open} onClose={() => setOpen(false)} classes={{ paper: style.paper }}>
        {isLoading ? (
          <Loader size={"100px"} />
        ) : (
          <div>
            {complexData && (
              <div className={style["data-manager"]}>
                <div className={style["section"]}>
                  <ComplexInfo
                    setOpen={setOpen}
                    complexData={complexData}
                    setComplexDataAfterUpdate={setComplexDataAfterUpdate}
                  />
                </div>
                <Divider />
                <div className={style["section"]}>
                  <DisableComplex
                    complexData={complexData}
                    setComplexDataAfterUpdate={setComplexDataAfterUpdate}
                  />
                </div>
                <Divider />
                <div className={style["section"]}>
                  <ComplexManagers
                    complexData={complexData}
                    setComplexDataAfterUpdate={setComplexDataAfterUpdate}
                  />
                </div>
              </div>
            )}

            <div className={style["actions"]}>
              <Button className={style["cancel-btn"]} variant="outlined" onClick={() => setOpen(false)}>
                ביטול
              </Button>
              <Button className={style["approve-btn"]} variant="contained" onClick={onSave}>
                שמירה
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};

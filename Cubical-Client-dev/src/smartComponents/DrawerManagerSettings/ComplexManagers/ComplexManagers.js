import { Typography, TextField, Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import { getUsersFullName } from "../../../services/userService";
import { Close } from "@material-ui/icons";
import style from "./ComplexManagers.module.scss";
export const ComplexManagers = ({ complexData, setComplexData, setComplexDataAfterUpdate }) => {
  const [complexAdminsNameId, setComplexAdminsNameId] = useState([]);
  const [complexAdminsId, setComplexAdminsId] = useState(complexData?.complexeAdmins || []);
  const [newManagerId, setNewManagerId] = useState();

  useEffect(() => {
    (async () => {
      const currentAdmins = complexAdminsId ? complexAdminsId : complexData?.complexeAdmins;

      const adminsId = currentAdmins.map(admin => {
        return admin.user_id;
      });

      try {
        const { data } = await getUsersFullName(adminsId);
        setComplexAdminsNameId(data);
      } catch (error) {
        console.log("err", error);
      }
    })();
  }, [complexData, complexAdminsId]);

  const addManager = () => {
    const newManager = {
      user_id: newManagerId,
      complex_id: complexData.id
    };

    setComplexDataAfterUpdate({ ...complexData, complexeAdmins: [...complexAdminsId, newManager] });
    setComplexAdminsId([...complexAdminsId, newManager]);
  };

  const removeManager = adminId => {
    const newArray = complexAdminsId.filter((item, key) => item.user_id !== adminId);
    setComplexDataAfterUpdate({ ...complexData, complexeAdmins: newArray });
    setComplexAdminsId(newArray);
  };

  const allComplexAdmins = complexAdminsNameId.map((admin, key) => {
    return (
      <Typography key={"admin" + key} className={style["manager-row"]}>
        <span className={style["manager-name"]}>{admin.fullName}</span>
        <span className={style["manager-id"]}>
          {admin.id}
          <Close
            className={style["delete-manager-btn"]}
            key={"adminCloseBtn" + key}
            onClick={() => removeManager(admin.id)}
          />
        </span>
      </Typography>
    );
  });
  return (
    <>
      <Typography>
        <u className={style["managers-title"]}>מנהלי מתחם</u>
      </Typography>
      {complexAdminsNameId && allComplexAdmins}
      <br />
      <div className={style["add-manager-row"]}>
        <TextField
          className={style["add-manager-input"]}
          id="standard-basic"
          onChange={({ target }) => setNewManagerId(target.value)}
          label="תעודת זהות מנהלן חדש"
          value={newManagerId}
          variant="standard"
        />
        <Button disabled={!newManagerId} variant="contained" onClick={addManager}>
          הוספת מנהלן
        </Button>
      </div>
    </>
  );
};

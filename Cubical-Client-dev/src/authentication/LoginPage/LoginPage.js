import classNames from "clsx";
import { useState } from "react";

// css
import style from "./loginPage.module.scss";

// materialUI
import { TextField } from "@material-ui/core";

// Img SVG
import { Login } from "../../imgSvg/Login/Login";

//utils
import { useMsal } from "../../context/msalContext";
import { loginRequest } from "../../config/authConfig";

// Design component
import { FixedBottomButton } from "../../smartComponents/FixedBottomButton/FixedBottomButton";

const LoginPage = () => {
  const [userId, setUserId] = useState(null);
  const { login } = useMsal();

  const handleKeyDown = event => {
    if (event.key === "Enter" && userId?.length === 9) {
      LoginToClick()
    }
  };

  const LoginToClick = () => {
    login({ ...loginRequest, loginHint: userId + "@idf.il" }, "loginRedirect");
  };

  return (
    <div className={style["login-page"]}>
      <div className={style["title"]}>Tom</div>
      <div className={classNames(style["title"], style["subtitle"])}>התחברות</div>
      <Login />
      <div className={style["input-label"]}>מספר תעודת הזהות שלי:</div>
      <div className={style["input-field"]}>
        <TextField
          autoFocus
          inputProps={{ inputMode: "numeric" }}
          type="number"
          onInput={e => {
            e.target.value = e.target.value.toString().slice(0, 9);
          }}
          fullWidth
          maxLength="9"
          minLength="9"
          value={userId || ""}
          onKeyDown={handleKeyDown}
          error={userId && userId.length !== 9}
          onChange={e => setUserId(e.target.value)}
          helperText={userId && userId.length != 9 ? "יש להכניס 9 ספרות" : ""}
        />
      </div>
      <FixedBottomButton
        textLabel={userId?.length != 9 ? "יש להכניס תז" : "הבא"}
        isDisabled={userId?.length != 9}
        onClick={() => LoginToClick()}
      />
      <div
        className={style["external-link"]}
        onClick={() => {
          window.open("https://my.idf.il/");
        }}
      >
        אין לך משתמש? הרשמה כאן
      </div>
    </div>
  );
};

export default LoginPage;

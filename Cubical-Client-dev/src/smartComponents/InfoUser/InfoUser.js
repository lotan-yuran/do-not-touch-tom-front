import { useState, useRef } from "react";

import { ExitToApp, AccountBox } from "@material-ui/icons";
import {
  Avatar,
  List,
  ListItemIcon,
  ListItem,
  ListItemText,
  Divider,
  ListItemAvatar
} from "@material-ui/core";

// Style
import styles from "./infoUser.module.scss";

// Img SVG
import { Person } from "../../imgSvg/Person/Person";

// Context
import { useMsal } from "../../context/msalContext";
import { useCodes } from "../../context/codesContext";

// Hooks
import { useClickOutside } from "../../hooks/useClickOutside";

export const InfoUser = () => {
  const { complexes } = useCodes();
  const wrapperRef = useRef(null);
  const { user, logout } = useMsal();

  const [openList, setOpenList] = useState(false);

  useClickOutside(wrapperRef, () => setOpenList(false));

  return (
    <div ref={wrapperRef}>
      <div className={styles.divAvatar} onClick={() => setOpenList(!openList)}>
        <Avatar className={styles.avatar}>
          <Person className={styles.person} style={{ fontSize: 40 }} />
        </Avatar>
      </div>
      {openList && (
        <div className={styles.root}>
          <List component="nav">
            <ListItem>
              <ListItemAvatar>
                <Avatar className={"classes.orange"}>
                  <Person className={styles.person} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={user.name}
                secondary={complexes?.find(item => item.id === user.complexId)?.name}
              />
            </ListItem>
          </List>
          <Divider />
          <List component="nav">
            <ListItem button component="a" href={window.location.origin}>
              <ListItemIcon>
                <AccountBox />
              </ListItemIcon>
              <ListItemText primary="הזמנות שלי" />
            </ListItem>
            <ListItem button onClick={logout}>
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="יציאה" />
            </ListItem>
          </List>
        </div>
      )}
    </div>
  );
};

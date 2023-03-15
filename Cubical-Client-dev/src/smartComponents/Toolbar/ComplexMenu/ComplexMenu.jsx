import { Menu, MenuItem } from "@material-ui/core";

const ComplexMenu = ({ isOpen, onClose, data, setSelected, menuAnchor }) => {
  return (
    <Menu
      open={isOpen}
      onClose={onClose}
      anchorEl={menuAnchor}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
    >
      {data?.map((item, index) => {
        return (
          <MenuItem
            key={index}
            onClick={() => {
              setSelected(index);
              onClose();
            }}
          >
            {item.name}
          </MenuItem>
        );
      })}
    </Menu>
  );
};

export default ComplexMenu;

import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

const languages = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

function LanguageSwitcher(props) {
  const { mobile = false, onCloseMenu } = props;
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const currentLanguage =
    languages.find((language) => language.code === i18n.language) || languages[0];

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
    if (typeof onCloseMenu === "function") {
      onCloseMenu();
    }
  };

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("locale", code);
    handleClose();
  };

  if (mobile) {
    return languages.map((language) => (
      <MenuItem
        key={language.code}
        selected={currentLanguage.code === language.code}
        onClick={() => changeLanguage(language.code)}
      >
        <MDTypography variant="button" fontWeight="regular">
          {language.flag}&nbsp;{t(`language.${language.code}`)}
        </MDTypography>
      </MenuItem>
    ));
  }

  return (
    <>
      <MDButton
        variant="outlined"
        color="dark"
        size="small"
        onClick={handleOpen}
        sx={{ minWidth: "auto", borderRadius: "lg", mr: 1, px: 1.5 }}
      >
        {currentLanguage.flag}&nbsp;{currentLanguage.code.toUpperCase()}
      </MDButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            selected={currentLanguage.code === language.code}
            onClick={() => changeLanguage(language.code)}
          >
            <MDTypography variant="button" fontWeight="regular">
              {language.flag}&nbsp;{t(`language.${language.code}`)}
            </MDTypography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

LanguageSwitcher.propTypes = {
  mobile: PropTypes.bool,
  onCloseMenu: PropTypes.func,
};

export default LanguageSwitcher;

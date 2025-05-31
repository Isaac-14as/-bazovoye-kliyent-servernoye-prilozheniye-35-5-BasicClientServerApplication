import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { closeSnackbar } from "notistack";

export const showDefaultSnack = (
  enqueueSnackbar,
  text,
  variant,
  hideDuration = 5000
) => {
  enqueueSnackbar(text, {
    variant: variant,
    autoHideDuration: hideDuration,
    action: (key) => (
      <IconButton size="sm" onClick={() => closeSnackbar(key)}>
        <Close fontSize="small" />
      </IconButton>
    ),
  });
};

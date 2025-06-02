import { Box, Paper, Typography, Button } from "@mui/material";
import { getUser } from "../../helpers/helpers";
import { roles } from "../../helpers/roles";

export const Profile = ({}) => {
  // Функция для преобразования роли в читаемый текст

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 100px)",
        marginLeft: "240px", // Отступ для бокового меню
        bgcolor: "background.default",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" component="h1" textAlign="center" gutterBottom>
          Профиль
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Логин:</strong> {getUser().username}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>ФИО:</strong> {getUser().full_name}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Роль:</strong> {roles[getUser().role]}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

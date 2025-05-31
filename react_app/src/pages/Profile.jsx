import { Box, Paper, Typography, Button } from "@mui/material";
import { getUser } from "../helpers/helpers";

export const Profile = ({}) => {
  // Функция для преобразования роли в читаемый текст
  const getRoleName = (role) => {
    const roles = {
      admin: "Администратор",
      purchaser: "Покупатель",
      seller: "Продавец",
    };
    return roles[role] || role;
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 100px)",
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
            <strong>Роль:</strong> {getRoleName(getUser().role)}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

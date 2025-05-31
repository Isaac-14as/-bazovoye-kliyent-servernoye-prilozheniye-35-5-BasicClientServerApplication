import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark", // Устанавливаем только темную тему
    background: {
      default: "#2b2b2b", // Настроим цвет фона
      paper: "#1d1d1d", // Цвет фона для карточек и других элементов
    },
    primary: {
      main: "#1976d2", // Основной цвет (можно настроить на ваш вкус)
    },
    secondary: {
      main: "#ff4081", // Вторичный цвет (можно настроить)
    },
  },
  // Дополнительные настройки, если нужно
  typography: {
    fontFamily: "Roboto, Arial, sans-serif", // Пример шрифта
  },
});

export default theme;

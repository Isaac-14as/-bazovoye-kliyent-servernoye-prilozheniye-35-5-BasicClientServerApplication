FROM node:18-alpine

WORKDIR /app

# Копируем зависимости и устанавливаем их
COPY package.json package-lock.json ./
RUN npm install

# Копируем остальные файлы
COPY . .

# Указываем порт (у вас Vite слушает 3000, но обычно это 5173)
EXPOSE 3000

# Запускаем dev-сервер (BROWSER=none отключает попытку открыть браузер)
CMD ["npm", "run", "dev"]
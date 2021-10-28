const express = require('express');
let app = express();
let cookieParser = require('cookie-parser');
let fs = require('fs');

// Подгружаем конфиг
const config = require('./middlewares/loadConfig')();
global.api_config = config;

// подключаем логгер Start
const Logger = require('./middlewares/Logger');
const log = new Logger(config.logger, 'Start');

// Учим Express парсить application/json
app.use(express.json());

// Учим Express парсить application/x-www-form-urlencoded (и заодно body)
app.use(express.urlencoded({ extended: false }));

// Учим Express работать с Cookie
app.use(cookieParser());

// подключаем логгер к Express
app.use((req, res, next) => {
  log.access(req, res);
  next();
});

// Инициализация базы данных
if (api_config.db_settings.enabled) {
  require('./db/connection');
  const { checkConnection } = require('./db/utils');
  app.use(checkConnection);
} else {
  log.info('Не подключаемся к базе данных, потому что она отключена в конфиге');
}

// Подгружаем маршруты
require('./features')(app);

// делаем айпи необязательным значением конфига
let ip = config.ip !== undefined ? config.ip : '127.0.0.1';

app.listen(config.port, ip, () => {
  log.info(`Запущено на http://${ip}:${config.port}`);
});

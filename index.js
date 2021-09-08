let app = require('express')();
let fs = require('fs')

// Подгружаем конфиг 
// Если не удается подгрузить - отменяем запуск сервера
let config 
try {
  config = require('./config/config.json');
  global.api_config = config;
} catch (err) {
  console.error('Не удается загрузить конфигурационный файл!');
  return;
}

// Подгружаем маршруты
require('./api/routes')(app, config);

// Инициализация базы данных 
app.use(require('./db'))

// Подгружаем ssl сертификат и ключ
// В случае ошибки при 443 порте - отменяем запуск сервера
let isHTTPS = config.port == 443
try {
  let cert_opt = {
    key: fs.readFileSync(config.key_path),
    cert: fs.readFileSync(config.cert_path)
  };
} catch (err) {
  console.log('SSL сертификат и ключ не загружен. Работа по HTTPS невозможна');
  if (isHTTPS) {
    console.log('Ошибка при загрузке ssl сертификата и ключа!');
    console.log('Отмена запуска сервера на порту 443. Смените порт или укажите правильный путь к ssl сертификату и ключу');
    return;
  } else {
    console.log('SSL сертификат и ключ не загружены!');
  }
}

// проверка порта для запуска нужного протокола
if (isHTTPS) {
  let https = require('https').createServer(cert_opt, app);
  https.listen(config.port, function () {
    console.log('HTTPS: Начинаем прослушку порта ', config.port);
  });
} else {
  // Начинаем прослушку не на https порте
  app.listen(config.port, () => {
    console.log('HTTP: Начинаем прослушку порта ', config.port);
  }); 
}

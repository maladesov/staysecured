# Основы проектной деятельности (Создание Web- сайта Защити свои данные в сети)

### Установка зависимостей Node.JS
Для установки зависимостей используйте команду:
```
npm install
```

### Конфигурация
Перед тем, как запустить приложение, необходимо создать `config.json` в папке `config`
Содержимое конфига:
```json
{
  "port": 8000,
  "cert_path" : "path/to/ssl.pem",
  "key_path" : "path/to/ssl.key",
  "api_version": "v1",
  "db_settings": {
    "url": "mongodb+srv://<пользователь>:<пароль>@<сайт>/<база_данных>?retryWrites=true&w=majority"
  }
}
```

# REST API Documentation

### Запрос передаётся к серверу вида
```
http://api.domain.ru/v1/<название>
```
`http/https`, `название домена` и `версия api` может отличаться

### /test
```
GET http://api.domain.ru/v1/test
```
Возвращает `200` статус при нормальной работе. При ошибке ничего не возвращает или непосредственно код ошибки
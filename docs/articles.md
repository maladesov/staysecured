# Статьи

В данном документе описаны все технические моменты, которые необходимо знать для работы со статьями через API.

## Строение статьи

На данный момент статья хранится в базе данных в подобном формате:

```json 
	"_id": "уникальный ID статьи, сгенерированный MongoDB",
	"header": "Название статьи",
	"author_id": "Автор статьи (временно равно system по умолчанию)",
	"contents": [
	    {
	        "type": "тип_контента, подробнее описано ниже",
	        "value": "содержимое типа"
	    }
	],
	"tags": [
	    "тег статьи, может быть несколько"
	],
	"create_time": "дата создания статьи, хранится в текстовом представлении Date()",
	"last_update_time": "дата последнего обновления, хранится в текстовом представлении Date()"
```

## Доступные форматы контента

Как описано выше, в массиве `contents` может находиться несколько обьектов.
Внутри каждого объекта ОБЯЗАТЕЛЬНО должен быть ключ `type` - благодаря нему сайт понимает, как отображать контент
Второй обязательный ключ `value` - описывает этот контент (его содержимое)
На данный момент доступны следующие форматы: 

|Формат     |Тип            |Аргументы          |Описание                             |
|-----------|---------------|-------------------|-------------------------------------|
|`markdown` |Строка `String`|`value` - текст    |Текст с разметкой Markdown           |
|`image_url`|Строка `String`|`value` - ссылка   |Картинка                             |

Ячеек с контентом может быть неограниченное количество, все они обрабатываются последовательно.

## Теги 

У каждой статьи может быть неограниченное количество тегов. Теги предназначены для более удобной сортировки статей по их контенту.

# Работа с маршрутом "Статьи"

Здесь описаны методы работы со статьями через API. Все аргументы, передаваемые вами, **должны** находиться в `Body` запроса. Возвращаемые с API значения передаются как `application/json` и имеют свой код HTTP-состояния.

## Получение списка статей

Список статей может быть получен с помощью GET-запроса на сайт: 

```
GET (полный путь сайта, включая протокол и порт)/<версия_апи>/articles/
```

_прим.: на данный момент `<версия_апи>` равна `v1`_

### Принимаемые аргументы

Единственные принимаемые аргументы - **фильтры**. Вы можете получить статьи по определенным критериям, для этого необходимо указать в **Body** массив `filters` формата **JSON**. На данный момент принимаются следующие фильтры (все они должны находиться внутри массива `filters`: 

|Название фильтра|Тип аргумента  |Описание                             |
|----------------|---------------|-------------------------------------|
|`author_id`     |Строка `String`|Отбирает статьи определенного автора |
|`tags`          |Массив `Array` |Отбирает статьи по определенным тегам|


### Возвращаемое значение

Запрос возвращает **JSON**-массив всех статей, найденных согласно фильтру (если они есть). Если не будет найдено ни одной статьи, запрос вернет `[]` (пустой массив). Все возвращенные статьи будут в традиционном формате, который описан ранее в этом документе.

## Добавление статьи

Добавление статьи происходит с помощью POST-запроса на сайт: 
```
POST (полный путь сайта, включая протокол и порт)/<версия_апи>/articles/add
```

_прим.: на данный момент_ `<версия_апи>` _равна_ `v1`

### Принимаемые аргументы

|Аргумент  |Тип аргумента  |Обязательный|Описание                                  |
|----------|---------------|------------|------------------------------------------|
|`name`    |Строка `String`|**Да**      |Название статьи, видное всем пользователям|
|`author`  |Строка `String`|**Нет**     |Автор статьи                              |
|`contents`|Массив `Array` |**Нет**     |Контент статьи. Описывается согласно модели статей, о которой написано сверху|
|`tags`    |Массив `Array` |**Нет**     |Теги статьи. Описываются согласно модели статей, о которой написано сверху|

### Возвращаемые значения

При успешном добавлении возвращается статус-код `200 OK` и `JSON` массив:

```json
{"msg": "Статья добавлена!"}
```

При любой внутренней ошибке, связанной с обработкой запроса, возвращается статус-код `500 Internal Server Error` и `JSON` массив:

```json
{"msg": "<текст ошибки>"}
```
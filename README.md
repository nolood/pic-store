# PicStore

## API Endpoints

### 1. Загрузка PDF-файлов

- **URL**: `/pdf/upload`
- **Метод**: `POST`
- **Описание**: Загружает PDF-файл на сервер.
- **Параметры запроса**: Файл должен быть передан в форме данных с ключом `"pdf"`.
- **Ограничения**:
  - Размер файла не должен превышать 5 МБ.
  - Файл должен иметь MIME-тип `application/pdf`.
- **Ответ**:
  - Успех: `{ fileId: number; previewPath: string; path: string; }`
  - Ошибка: `{ "error": "Сообщение об ошибке" }`

### 2. Получение загруженных PDF-файлов

- **URL**: `/pdf/uploads/:id`
- **Метод**: `GET`
- **Описание**: Получает информацию о загруженном PDF-файле по его ID.
- **Параметры запроса**: `:id` — уникальный идентификатор PDF-файла.
- **Ответ**:
  - Успех: `{ fileId: number; path: string; previewPath: string }`
  - Ошибка: `{ "error": "Сообщение об ошибке" }`

### 3. Загрузка изображений

- **URL**: `/upload`
- **Метод**: `POST`
- **Описание**: Загружает изображение на сервер.
- **Параметры запроса**: Файл должен быть передан в форме данных с ключом `"image"`.
- **Ограничения**:
  - Размер файла не должен превышать 5 МБ.
  - MIME-тип файла должен быть разрешен (например, `image/jpeg`, `image/png`, и т.д.).
- **Ответ**:
  - Успех: `{ fileId: number; hashBlur: string }`
  - Ошибка: `{ "error": "Сообщение об ошибке" }`

### 4. Получение загруженных изображений

- **URL**: `/uploads/:id`
- **Метод**: `GET`
- **Описание**: Получает изображение по его ID. Опционально можно получить уменьшенную версию (миниатюру) изображения.
- **Параметры запроса**:
  - `:id` — уникальный идентификатор изображения.
  - `thumb` — получить получить объект с данными о изображении
  - `buffer` — получить thumbnails буфером
- **Ответ**:
  - Успех: thumb === true 
    ```
    {
      hashBlur: string;
      path: string;
      thumbPath: string;
    }
    ```
    thumb === false // (thumb === true && buffer === true)
    ```
    Buffer
    {
      Content-Type: "image/webp"
    }
    ```
  - Ошибка: `{ "error": "Сообщение об ошибке" }`

## Настройка сервера

- **Порт**: 5000
- **Статические файлы**: Сервис обслуживает статические файлы из папки `./uploads` по URL-пути `/static/*`.



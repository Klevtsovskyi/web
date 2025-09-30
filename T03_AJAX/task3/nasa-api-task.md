# Завдання: NASA API

## Завдання
Напишіть програму, яка:
1. Отримує з API постів на api NASA посилання на фото
2. Обробляє promise
3. Обробляє мережеві помилки
4. Показує фото на сторінці
5. Викликає API раз на хвилину по Гринвічу і оновлює фото (використайте setTimeout)

## API
```
https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY
```

## Вимоги
- Використовуйте `fetch()` та `async/await`
- Обробіть помилки мережі
- Оновлюйте фото кожну хвилину
- Покажіть назву та опис фото

## Структура
```
index.html
script.js
style.css
```
const dateRange = (start, end, step = 1) => {
    const dates = [];
    const current = new Date(start);
    const endDate = new Date(end);
    
    while (current <= endDate) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + step);
    }
    
    return dates;
};

// Використання
const dates = dateRange('2024-01-01', '2024-01-10', 2);
dates.forEach(date => console.log(date.toDateString()));

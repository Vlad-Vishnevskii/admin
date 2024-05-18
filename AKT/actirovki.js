document.addEventListener('DOMContentLoaded', function() {
    const manualWorkBtn = document.getElementById('manualWorkBtn');
    const autoWorkBtn = document.getElementById('autoWorkBtn');
    const manualWorkSection = document.getElementById('manualWorkSection');
    const getWeatherForecastBtn = document.getElementById("getWeatherForecastBtn");
    const workModeTitle = document.getElementById('workModeTitle');

    manualWorkBtn.addEventListener('click', () => {
        manualWorkSection.style.display = 'block';
        autoWorkSection.style.display = 'none';
        workModeTitle.textContent = 'Ручная работа';
    });
    
    

    if (autoWorkBtn && manualWorkSection) {
        autoWorkBtn.addEventListener('click', () => {
            manualWorkSection.style.display = 'none';
            autoWorkSection.style.display = 'block';
            workModeTitle.textContent = 'Автоматическая работа';
        });
    }

    if (getWeatherForecastBtn) {
        getWeatherForecastBtn.addEventListener("click", function() {
            fetch('/get-weather-forecast/')
            .then(response => response.json())
            .then(data => {
                console.log("Полученные данные:", data); // Логируем весь ответ сервера
                
                if (data.error) {
                    alert(data.error);
                } else {
                    // Обновляем общие данные о погоде на странице
                    document.getElementById("weatherForecast").innerHTML = `
                        Температура: ${data.data.temperature_text}<br>
                        Штормовое предупреждение: ${data.data.storm_warning_text}<br>
                        Описание погоды: ${data.data.weather_description_text}<br>
                        Осадки: ${data.data.precipitation_text}<br>
                        Продолжительность дня: ${data.data.day_length}<br>
                        Восход: ${data.data.sunrise}<br>
                        Закат: ${data.data.sunset}<br>
                        Прогноз: ${data.data.forecast}
                    `;
                    document.getElementById("comment").value = data.data.forecast_text;
                    if (data.data.image_path) {
                        document.querySelector(".img-rem").src = data.data.image_path;
                    }
    
                    if (Array.isArray(data.data.weather_data)) {
                        const weatherData = data.data.weather_data;
                        console.log("Данные о погоде:", weatherData); // Логируем данные о погоде
                        
                        // Перебор полей ввода для обновления их значений
                        weatherData.forEach((value, index) => {
                            const inputId = `temp${index + 1}`; // Строим ID для поля ввода
                            const inputElement = document.getElementById(inputId);
                            if (inputElement) {
                                inputElement.value = value; // Обновляем значение
                                console.log(`Вставка данных: ${value} в поле ${inputId}`); // Логируем вставку данных
                            }
                        });
                    } else {
                        console.error('Ожидаемые данные о погоде не найдены или не являются массивом');
                    }
                }
            })
            .catch(error => {
                console.error('Ошибка при получении данных погоды:', error);
                alert('Произошла ошибка при получении данных. Подробности в консоли.');
            });
        });
    }
    


    document.getElementById('regenerateTableBtn').addEventListener('click', function() {
        let dataToSend = {
            'Temp 1': parseFloat(document.getElementById('temp1').value) || null,
            'Temp 2': parseFloat(document.getElementById('temp2').value) || null,
            'Veter 1': parseFloat(document.getElementById('veter1').value) || null,
            'Veter 2': parseFloat(document.getElementById('veter2').value) || null,
            'Poriv 1': parseFloat(document.getElementById('poriv1').value) || null,
            'Poriv 2': parseFloat(document.getElementById('poriv2').value) || null,
            'Poriv do': parseFloat(document.getElementById('porivdo').value) || null,
        };
    
        fetch('/reprocess-with-new-data/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
        })
        .then(response => response.json())
        .then(data => {
            // Обработка полученных данных
        })
        .catch(error => console.error('Ошибка:', error));
    });
    
    document.getElementById("updateForecastBtn").addEventListener("click", function(){
        var forecastInput = document.getElementById("forecastInput").value;
        var scaleInput = document.getElementById("scaleInput").value;
    
        // Сбор данных из таблицы
        const tableRows = document.querySelectorAll('.table tbody tr');
        let tableData = {
            'Temp 1': parseFloat(document.getElementById('temp1').value) || null,
            'Temp 2': parseFloat(document.getElementById('temp2').value) || null,
            'Veter 1': parseFloat(document.getElementById('veter1').value) || null,
            'Veter 2': parseFloat(document.getElementById('veter2').value) || null,
            'Poriv 1': parseFloat(document.getElementById('poriv1').value) || null,
            'Poriv 2': parseFloat(document.getElementById('poriv2').value) || null,
            'Poriv do': parseFloat(document.getElementById('porivdo').value) || null,
        };
    
        fetch('/izmenit/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                forecast: forecastInput,
                scale: scaleInput,
                tableData: tableData,
            })
        })
        .then(response => response.json())
        .then(response => {
            document.getElementById("comment").value = response.forecast_text;
            document.querySelector("img.img-rem").src = response.image_path ? response.image_path : defaultImagePath;
        })
        .catch(error => console.error('Ошибка:', error));
    });



    console.log(`В addEventListener:`);
    var sendButton = document.querySelector('.btn-primary.mt-3.otpravke');
    if (sendButton) {
        var confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'), {
          keyboard: false
        });
    
        sendButton.addEventListener('click', function () {
            console.log(`В sendButton:`);
            confirmationModal.show();
        });
    
        // Обработка подтверждения отправки
        document.getElementById('confirmSend').addEventListener('click', function () {
          confirmationModal.hide();
          // Здесь код для обработки отправки формы
          alert('Прогноз отправлен!'); // Пример обратной связи
        });
    } else {
        console.log('Кнопка отправки не найдена');
    }
    
    document.getElementById('confirmSend').addEventListener('click', function() {
        var vkEnabled = document.getElementById('vkSwitch').checked;
        var telegramEnabled = document.getElementById('telegramSwitch').checked;
        var text = document.getElementById('comment').value;  // Текст из текстового поля
        var image_src = document.querySelector('img.img-rem').src;  // Ссылка на изображение
        console.log(image_src);
        fetch('/send-message/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'X-CSRFToken': csrftoken  // Убедитесь, что csrftoken правильно определён
            },
            body: JSON.stringify({ vk: vkEnabled, telegram: telegramEnabled, text: text, image_path: image_src })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
    

// Получение элементов DOM
const button = document.getElementById('autoWorkVKLVIKL');
const vkSwitch = document.getElementById('vkSwitchAUTO');
const telegramSwitch = document.getElementById('telegramSwitchAUTO');

// Инициализация текста кнопки при загрузке страницы
window.onload = function() {
    // Установим начальный текст кнопки
    button.querySelector('.text').textContent = 'Включить';
}

button.addEventListener('click', function () {
    const isOn = button.querySelector('.text').textContent === 'Выключить';
    button.querySelector('.text').textContent = isOn ? 'Включить' : 'Выключить';
    
    // Отправка состояния переключателей и темы
    sendSwitchStateUpdate();

    if (!isOn) {  // Если текущее состояние было "Включить", значит мы включаем систему
        // Отправка запроса на сервер для активации функции
        fetch('/trigger_fetch_weather/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => console.log(data.message))
        .catch(error => console.error('Ошибка:', error));
    } else {
        console.log('Система выключена, запрос не отправлен');
    }
});


// Функция для отправки состояний переключателей и темы
function sendSwitchStateUpdate() {
    const isOn = button.querySelector('.text').textContent.includes('Выключить');
    const data = {
        'dark_theme_enabled': isOn,
        'vk_switch_enabled': vkSwitch.checked,
        'telegram_switch_enabled': telegramSwitch.checked
    };

    $.post('/update_switch_state/', data, function(response) {
        console.log(response);
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


$(document).ready(function() {
    $(".btn-icon-split").hover(function() {
      $(this).find(".long-text").addClass("show-long-text");
    }, function() {
      $(this).find(".long-text").removeClass("show-long-text");
    });
  });



});




document.addEventListener('DOMContentLoaded', function() {
    
    // Загрузка текущего интервала запросов
    fetch('/get_interval/')
    .then(response => response.json())
    .then(data => {
        const progressSlider = document.getElementById('progressMinutes');
        const progressValue = document.getElementById('progressValue');
        progressSlider.value = data.interval;
        progressValue.innerText = data.interval;
    })
    .catch(error => console.error('Failed to load interval:', error));
    
    function updateProgress(value) {
        document.getElementById('progressValue').innerText = value;
    
        // Отправка нового значения интервала на сервер
        fetch('/save_interval/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()  // Убедитесь, что у вас есть функция для получения CSRF token
            },
            body: JSON.stringify({ interval: value })
        })
        .then(response => response.json())
        .then(data => console.log('Interval updated:', data))
        .catch(error => console.error('Failed to update interval:', error));
    }
    
    // Функция для получения CSRF токена из cookie
    function getCSRFToken() {
        let cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            let [key, value] = cookie.split('=');
            if (key.trim() === 'csrftoken') {
                return decodeURIComponent(value);
            }
        }
        return null;
    }



    // Инициализация кнопки с стрелкой
    var header = document.getElementById('toggleHeader');
    var collapseElement = document.getElementById('notificationSettingsCollapse');
    var collapseButton = header.querySelector('[data-bs-toggle="collapse"]');
    var icon = collapseButton.querySelector('i');

    header.addEventListener('click', function(event) {
        if (event.target !== collapseButton && event.target !== icon) {
            // Эмулируем клик по кнопке, если клик был не по кнопке и не по иконке
            collapseButton.click();
        }
    });

    // Обновление иконки при изменении состояния collapse
    var bsCollapse = new bootstrap.Collapse(collapseElement, {
        toggle: false
    });
    collapseElement.addEventListener('show.bs.collapse', function () {
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    });
    collapseElement.addEventListener('hide.bs.collapse', function () {
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    });
    
    



    const settingsElement = document.getElementById('notification-settings');
    const url = settingsElement.dataset.url;
    fetch(url)
        .then(response => response.text())
        .then(html => {
            settingsElement.innerHTML = html;
            // Инициализация DataTable здесь, чтобы убедиться, что DOM был обновлен
            $(document).ready(function() {
              var table = $('#notificationsTable').DataTable({
                  "processing": true,
                  "serverSide": true,
                  "ajax": {
                      "url": "/api/notifications/",
                      "type": "GET",
                      "data": function(d) {
                          d.only_relevant = $('#toggleRelevance').is(':checked');
                      }
                  },
                  "columns": [
                      { "data": "original_text" },
                      { "data": "final_text" },
                      { "data": "telegram_message_id" },
                      { "data": "notification_group" },
                      { "data": "relevance", "render": function(data, type, row) {
                          return data ? 'Да' : 'Нет';
                      }}
                  ],
                  "searching": false,
                  "language": {
                      "url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Russian.json"
                  }
              });
          
              // Перезагрузка таблицы при изменении состояния чекбокса
              $('#toggleRelevance').on('change', function() {
                  table.ajax.reload();
              });
          });
          
          
        });
    
        var collapseToggleButton = document.querySelector('[data-bs-toggle="collapse"]');
        collapseToggleButton.addEventListener('click', function() {
            var icon = this.querySelector('i');
            if (icon.classList.contains('fa-chevron-down')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });

    

  var isTaskRunning = false; // Изначальное состояние
  var toggleButton = document.getElementById('toggleButton');
  var stateBadge = document.querySelector('.badge'); // Элемент для отображения состояния
    // Получение текущего состояния задачи с сервера
    fetch('/get-task-status/')
    .then(response => response.json())
    .then(data => {
        var isTaskRunning = data.is_active; // Состояние из сервера
        toggleButton.checked = isTaskRunning;
        updateStateDisplay(isTaskRunning);

        // Обновляем текст и цвет в зависимости от состояния
        function updateStateDisplay(isTaskRunning) {
        if (isTaskRunning) {
            stateBadge.textContent = 'Система включена';
            stateBadge.classList.remove('bg-secondary');
            stateBadge.classList.add('bg-primary');
        } else {
            stateBadge.textContent = 'Система выключена';
            stateBadge.classList.remove('bg-primary');
            stateBadge.classList.add('bg-secondary');
        }
    }

    toggleButton.addEventListener('change', function() {
        var isTaskRunning = this.checked;
        updateStateDisplay(isTaskRunning);

      // Обновляем текст и цвет в зависимости от состояния
    //   if (isTaskRunning) {
    //       stateBadge.textContent = 'Включено';
    //       stateBadge.classList.remove('bg-secondary');
    //       stateBadge.classList.add('bg-success');
    //   } else {
    //       stateBadge.textContent = 'Выключено';
    //       stateBadge.classList.remove('bg-success');
    //       stateBadge.classList.add('bg-secondary');
    //   }

      // Подготовка данных для отправки
      var data = JSON.stringify({ toggle: isTaskRunning });

      // Отправка данных на первый эндпоинт
      fetch('/zapros-vkl-vikl/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: data
      })
      .then(response => response.json())
      .then(data => console.log('Response from zapros-vkl-vikl:', data.message))
      .catch(error => console.error('Error with zapros-vkl-vikl:', error));

      // Отправка данных на второй эндпоинт
      fetch('/toggle-task-control/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: data
      })
      .then(response => response.json())
      .then(data => console.log('Response from toggle-task-control:', data.message))
      .catch(error => console.error('Error with toggle-task-control:', error));
  });

  document.getElementById('izmenit_aktivnost').addEventListener('click', function() {
    var checkboxes = document.querySelectorAll('.form-check-input');
    var data = [];
    checkboxes.forEach(function(checkbox) {
        data.push({
            id: checkbox.id.replace('group', ''),
            is_active: checkbox.checked
        });
    });

    fetch('/change_activity/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'X-CSRFToken': getCookie('csrftoken') // Для CSRF защиты
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        alert('Статусы обновлены!');
    })
    .catch((error) => {
        console.error('Ошибка:', error);
    });


    

});

})});

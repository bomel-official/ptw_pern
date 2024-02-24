interface ITranslations {
    [str: string] : {
        RU: string,
        EU: string
    }
}

export const getSlotWord = (number: number) => {
    const stringNumber: string = number.toString()
    const latsFigure = stringNumber[stringNumber.length - 1]
    switch (latsFigure) {
        case '1':
            return 'слот'
        case '2':
            return 'слота'
        case '3':
            return 'слота'
        case '4':
            return 'слота'
        case '5':
            return 'слотов'
        case '6':
            return 'слотов'
        case '7':
            return 'слотов'
        case '8':
            return 'слотов'
        case '9':
            return 'слотов'
    }
    return 'слотов'
}

export const Translations: ITranslations = {
    "1": {
        "RU": "1",
        "EU": "1"
    },
    "2": {
        "RU": "2",
        "EU": "2"
    },
    "3": {
        "RU": "3",
        "EU": "3"
    },
    "4": {
        "RU": "4",
        "EU": "4"
    },
    "5": {
        "RU": "5",
        "EU": "5"
    },
    "6": {
        "RU": "6",
        "EU": "6"
    },
    "7": {
        "RU": "7",
        "EU": "7"
    },
    "8": {
        "RU": "8",
        "EU": "8"
    },
    "10": {
        "RU": "10",
        "EU": "10"
    },
    "18": {
        "RU": "18",
        "EU": "18"
    },
    "50": {
        "RU": "50",
        "EU": "50"
    },
    "128": {
        "RU": "128",
        "EU": "128"
    },
    "163": {
        "RU": "163",
        "EU": "163"
    },
    "4000": {
        "RU": "4000",
        "EU": "4000"
    },
    "5000": {
        "RU": "5000",
        "EU": "5000"
    },
    "6000": {
        "RU": "6000",
        "EU": "6000"
    },
    "Наверх": {
        "RU": "Наверх",
        "EU": "Top"
    },
    "Подробнее": {
        "RU": "Подробнее",
        "EU": "More"
    },
    "Lorem ipsum dolor sit amet consectetur.": {
        "RU": "Lorem ipsum dolor sit amet consectetur.",
        "EU": "Lorem ipsum dolor sit amet, consectetur."
    },
    "Play to win": {
        "RU": "Play to win",
        "EU": "Play to win"
    },
    "Вход и регистрация": {
        "RU": "Вход и регистрация",
        "EU": "Login and registration"
    },
    "RU": {
        "RU": "RU",
        "EU": "RU"
    },
    "Twitch": {
        "RU": "Twitch",
        "EU": "Twitch"
    },
    "Google": {
        "RU": "Google",
        "EU": "Google"
    },
    "Discord": {
        "RU": "Discord",
        "EU": "Discord"
    },
    "Авторизация с помощью:": {
        "RU": "Авторизация с помощью:",
        "EU": "Authorization with:"
    },
    "Уже есть аккаунт": {
        "RU": "Уже есть аккаунт",
        "EU": "Already have an account"
    },
    "Продолжить": {
        "RU": "Продолжить",
        "EU": "Continue"
    },
    "*Продолжая Вы соглашаетесь с": {
        "RU": "*Продолжая Вы соглашаетесь с",
        "EU": "*By continuing you agree to the"
    },
    "условиями использования": {
        "RU": "условиями использования",
        "EU": "terms of use"
    },
    "Повторите пароль": {
        "RU": "Повторите пароль",
        "EU": "Repeat password"
    },
    "Придумайте пароль": {
        "RU": "Придумайте пароль",
        "EU": "Create a password"
    },
    "Введите никнейм": {
        "RU": "Введите никнейм",
        "EU": "Enter Nickname"
    },
    "Введите никнейм или e-mail": {
        "RU": "Введите никнейм или e-mail",
        "EU": "Enter nickname or e-mail"
    },
    "Регистрация на платформе": {
        "RU": "Регистрация на платформе",
        "EU": "Registration on the platform"
    },
    "Зарегистрироваться": {
        "RU": "Зарегистрироваться",
        "EU": "Register"
    },
    "Забыли пароль?": {
        "RU": "Забыли пароль?",
        "EU": "Forgot your password?"
    },
    "Введите пароль": {
        "RU": "Введите пароль",
        "EU": "Enter password"
    },
    "Авторизация": {
        "RU": "Авторизация",
        "EU": "Authorization"
    },
    "Lorem ipsum dolor sit amet consectetur. Leo viverra donec purus in neque facilisi dictum nisl eget. Varius nec sagittis quis pellentesque. Sagittis laoreet sed sed dictumst laoreet nullam ut sit. \nIn elementum pellentesque placerat vestibulum consectetur tortor sed. Ullamcorper cras tortor potenti proin orci egestas placerat.": {
        "RU": "Lorem ipsum dolor sit amet consectetur. Leo viverra donec purus in neque facilisi dictum nisl eget. Varius nec sagittis quis pellentesque. Sagittis laoreet sed sed dictumst laoreet nullam ut sit. \nIn elementum pellentesque placerat vestibulum consectetur tortor sed. Ullamcorper cras tortor potenti proin orci egestas placerat.",
        "EU": "Lorem ipsum dolor sit amet, consectetur. The rhythm of the cartoon until it is clear is not easy for the fans. Varius did not shoot anyone with arrows. Sagittis laoreet sed sed dictumst laoreet no laoreet.\nIn the element of diesel investment, the manufacturer will be followed by the macro. Ullamcorper is investing in a powerful microwave oven tomorrow."
    },
    "Подзаголовок": {
        "RU": "Подзаголовок",
        "EU": "Subtitle"
    },
    "Заголовок": {
        "RU": "Заголовок",
        "EU": "header"
    },
    "Пункт правил": {
        "RU": "Пункт правил",
        "EU": "Rule clause"
    },
    "Навигация:": {
        "RU": "Навигация:",
        "EU": "Navigation:"
    },
    "ПРинять участие": {
        "RU": "ПРинять участие",
        "EU": "Participate"
    },
    "Регистрация до": {
        "RU": "Регистрация до",
        "EU": "Registration until"
    },
    "за участие": {
        "RU": "за участие",
        "EU": "to participate"
    },
    "Свободное участие": {
        "RU": "Свободное участие",
        "EU": "Free to participate"
    },
    "23.06.2023/30.06.2023": {
        "RU": "23.06.2023/30.06.2023",
        "EU": "23.06.2023/30.06.2023"
    },
    "участников": {
        "RU": "участников",
        "EU": "participants"
    },
    "Ranked custom + solo": {
        "RU": "Ranked custom + solo",
        "EU": "Ranked custom + solo"
    },
    "Название турнира": {
        "RU": "Название турнира",
        "EU": "Name of the tournament"
    },
    "Play 2 win": {
        "RU": "Play 2 win",
        "EU": "Play 2 win"
    },
    "Что-то пошло не так": {
        "RU": "Что-то пошло не так",
        "EU": "Something went wrong"
    },
    "Действие": {
        "RU": "Действие",
        "EU": "Action"
    },
    "150 очков": {
        "RU": "150 очков",
        "EU": "150 points"
    },
    "30 очков": {
        "RU": "30 очков",
        "EU": "30 points"
    },
    "Игрок 3": {
        "RU": "Игрок 3",
        "EU": "Player 3"
    },
    "Игрок 2": {
        "RU": "Игрок 2",
        "EU": "Player 2"
    },
    "Игрок 1": {
        "RU": "Игрок 1",
        "EU": "Player 1"
    },
    "Мы – носки 2": {
        "RU": "Мы – носки 2",
        "EU": "We are socks 2"
    },
    "Мы – булочки 2": {
        "RU": "Мы – булочки 2",
        "EU": "We are buns 2"
    },
    "Мы – растения 2": {
        "RU": "Мы – растения 2",
        "EU": "We are plants 2"
    },
    "Мы – носки": {
        "RU": "Мы – носки",
        "EU": "We are socks"
    },
    "Мы – булочки": {
        "RU": "Мы – булочки",
        "EU": "We are buns"
    },
    "Мы – растения": {
        "RU": "Мы – растения",
        "EU": "We are plants"
    },
    "Итого": {
        "RU": "Итого",
        "EU": "Total"
    },
    "Игра№": {
        "RU": "Игра",
        "EU": "Game"
    },
    "Игра 5": {
        "RU": "Игра 5",
        "EU": "Game 5"
    },
    "Игра 4": {
        "RU": "Игра 4",
        "EU": "Game 4"
    },
    "Игра 3": {
        "RU": "Игра 3",
        "EU": "Game 3"
    },
    "Игра 2": {
        "RU": "Игра 2",
        "EU": "Game 2"
    },
    "Игра 1": {
        "RU": "Игра 1",
        "EU": "Game 1"
    },
    "Никнейм игрока": {
        "RU": "Никнейм игрока",
        "EU": "Player nickname"
    },
    "№": {
        "RU": "№",
        "EU": "№"
    },
    "Результаты турнира": {
        "RU": "Результаты турнира",
        "EU": "Tournament results"
    },
    "1.63": {
        "RU": "1.63",
        "EU": "1.63"
    },
    "Топ K/D": {
        "RU": "Топ K/D",
        "EU": "Top K/D"
    },
    "Тег игрока": {
        "RU": "Тег игрока",
        "EU": "Player Tag"
    },
    "Убийств": {
        "RU": "Убийств",
        "EU": "kills"
    },
    "место": {
        "RU": "место",
        "EU": "place"
    },
    "Место": {
        "RU": "Место",
        "EU": "Place"
    },
    "Смертей": {
        "RU": "Смертей",
        "EU": "deaths"
    },
    "MVP турнира": {
        "RU": "MVP турнира",
        "EU": "Tournament MVP"
    },
    "Отличившиеся игроки": {
        "RU": "Отличившиеся игроки",
        "EU": "Distinguished Players"
    },
    "5 000 ₽": {
        "RU": "5 000 ₽",
        "EU": "5 000 ₽"
    },
    "3 место": {
        "RU": "3 место",
        "EU": "3 place"
    },
    "10 000 ₽": {
        "RU": "10 000 ₽",
        "EU": "10 000 ₽"
    },
    "2 место": {
        "RU": "2 место",
        "EU": "2 place"
    },
    "20 000 ₽": {
        "RU": "20 000 ₽",
        "EU": "20 000 ₽"
    },
    "35 000 ₽": {
        "RU": "35 000 ₽",
        "EU": "35 000 ₽"
    },
    "Призовой фонд": {
        "RU": "Призовой фонд",
        "EU": "Prize fund"
    },
    "Рейтинг": {
        "RU": "Рейтинг",
        "EU": "Rating"
    },
    "Турнир завершен": {
        "RU": "Турнир завершен",
        "EU": "Tournament completed"
    },
    "Зарегистрировать команду": {
        "RU": "Зарегистрировать команду",
        "EU": "Register a team"
    },
    "Участники турнира": {
        "RU": "Участники турнира",
        "EU": "Tournament participants"
    },
    "Тут появится рейтинг команд после первой игры.": {
        "RU": "Тут появится рейтинг команд после первой игры.",
        "EU": "Here the rating of teams will appear after the first game."
    },
    "Всего очков": {
        "RU": "Всего очков",
        "EU": "Total points"
    },
    "Среднее K/D": {
        "RU": "Среднее K/D",
        "EU": "Average K/D"
    },
    "Средний рейтинг": {
        "RU": "Средний рейтинг",
        "EU": "Average rating"
    },
    "Место в среднем": {
        "RU": "Место в среднем",
        "EU": "Place on average"
    },
    "слот": {
        "RU": "слот",
        "EU": "slots"
    },
    "слота": {
        "RU": "слота",
        "EU": "slots"
    },
    "слотов": {
        "RU": "слотов",
        "EU": "slots"
    },
    "Свободные слоты": {
        "RU": "Свободные слоты",
        "EU": "Free slots"
    },
    "Участники": {
        "RU": "Участники",
        "EU": "Members"
    },
    "Создать команду": {
        "RU": "Создать команду",
        "EU": "Create a team"
    },
    "Игрок 4": {
        "RU": "Игрок 4",
        "EU": "Player 4"
    },
    "Вы": {
        "RU": "Вы",
        "EU": "You"
    },
    "/ 3": {
        "RU": "/ 3",
        "EU": "/ 3"
    },
    "Выберите участников турнира": {
        "RU": "Выберите участников турнира",
        "EU": "Select Tournament Participants"
    },
    "Редактировать": {
        "RU": "Редактировать",
        "EU": "Edit"
    },
    "Состав команды: Игрок, игрок, игрок, игрок, игрок": {
        "RU": "Состав команды: Игрок, игрок, игрок, игрок, игрок",
        "EU": "Team line-up: Player, player, player, player, player"
    },
    "человек": {
        "RU": "человек",
        "EU": "people"
    },
    "Принять участие": {
        "RU": "Принять участие",
        "EU": "Participate"
    },
    "12:00 25.05.2023": {
        "RU": "12:00 25.05.2023",
        "EU": "12:00 25.05.2023"
    },
    "Этап №3": {
        "RU": "Этап №3",
        "EU": "Stage 3"
    },
    "Этап №2": {
        "RU": "Этап №2",
        "EU": "Stage #2"
    },
    "Этап №1": {
        "RU": "Этап №1",
        "EU": "Stage #1"
    },
    "Расписание игр": {
        "RU": "Расписание игр",
        "EU": "Game schedule"
    },
    "Lorem ipsum dolor sit amet consectetur. Auctor nec venenatis amet pretium aliquam nisl etiam morbi. Eget vitae elementum ullamcorper vulputate aliquam eu faucibus pulvinar. Gravida rhoncus scelerisque enim blandit euismod tristique urna ut.": {
        "RU": "Lorem ipsum dolor sit amet consectetur. Auctor nec venenatis amet pretium aliquam nisl etiam morbi. Eget vitae elementum ullamcorper vulputate aliquam eu faucibus pulvinar. Gravida rhoncus scelerisque enim blandit euismod tristique urna ut.",
        "EU": "Lorem ipsum dolor sit amet, consectetur. The author does not even have a poison, but some fans of the disease. It needs an element of life that is ullamcorper vulputate aliquam eu faucibus pulvinar. For the weighty rhonchos selecrisque flatters Euismod as a sad urn."
    },
    "Дополнительные сведения": {
        "RU": "Дополнительные сведения",
        "EU": "Additional information"
    },
    "Последний выживший": {
        "RU": "Последний выживший",
        "EU": "The last survivor"
    },
    "Формат": {
        "RU": "Формат",
        "EU": "Format"
    },
    "игроков": {
        "RU": "игроков",
        "EU": "players"
    },
    "Размер команды": {
        "RU": "Размер команды",
        "EU": "Team Size"
    },
    "Warzone": {
        "RU": "Warzone",
        "EU": "Warzone"
    },
    "Игра": {
        "RU": "Игра",
        "EU": "A game"
    },
    "Основная информация": {
        "RU": "Основная информация",
        "EU": "basic information"
    },
    "О турнире": {
        "RU": "О турнире",
        "EU": "About the tournament"
    },
    "Шаг 3. Сбор состава": {
        "RU": "Шаг 3. Сбор состава",
        "EU": "Step 3. Collecting the composition"
    },
    "Состав команды": {
        "RU": "Состав команды",
        "EU": "Command structure"
    },
    "Выберите игрока из списка друзей": {
        "RU": "Выберите игрока из списка друзей",
        "EU": "Select a player from your friends list"
    },
    "Шаг 2. Создание команды": {
        "RU": "Шаг 2. Создание команды",
        "EU": "Step 2. Create a team"
    },
    "Загрузить аватар": {
        "RU": "Загрузить аватар",
        "EU": "Upload avatar"
    },
    "Введите название": {
        "RU": "Введите название",
        "EU": "Enter the title"
    },
    "Название команды": {
        "RU": "Название команды",
        "EU": "Team name"
    },
    "Шаг 1. Создание команды": {
        "RU": "Шаг 1. Создание команды",
        "EU": "Step 1. Create a team"
    },
    "Добавить": {
        "RU": "Добавить",
        "EU": "Add"
    },
    "Вы (создатель)": {
        "RU": "Вы (создатель)",
        "EU": "you (creator)"
    },
    "Капитан команды": {
        "RU": "Капитан команды",
        "EU": "Team captain"
    },
    "Настройка команды": {
        "RU": "Настройка команды",
        "EU": "Team setup"
    },
    "Добавить в друзья": {
        "RU": "Добавить в друзья",
        "EU": "Add as Friend"
    },
    "Выйти из аккаунта": {
        "RU": "Выйти из аккаунта",
        "EU": "Sign out"
    },
    "Назад": {
        "RU": "Назад",
        "EU": "Back"
    },
    "Распустить команду": {
        "RU": "Распустить команду",
        "EU": "Disband the team"
    },
    "Если вы больше не играете вместе, то можно распустить команду": {
        "RU": "Если вы больше не играете вместе, то можно распустить команду",
        "EU": "If you no longer play together, you can disband the team"
    },
    "Добавить участника": {
        "RU": "Добавить участника",
        "EU": "Add member"
    },
    "/ 5": {
        "RU": "/ 5",
        "EU": "/ 5"
    },
    "Участники команды": {
        "RU": "Участники команды",
        "EU": "Team Members"
    },
    "Поиск тиммейтов": {
        "RU": "Поиск тиммейтов",
        "EU": "Search for teammates"
    },
    "Что бы участвовать в турнирах Вам необходимо как минимум 5 человек в команде.": {
        "RU": "Что бы участвовать в турнирах Вам необходимо как минимум 5 человек в команде.",
        "EU": "To participate in tournaments you need at least 5 people in the team."
    },
    "Управление": {
        "RU": "Управление",
        "EU": "Management"
    },
    "Настройка": {
        "RU": "Настройка",
        "EU": "Setup"
    },
    "Команды в которых вы состоите": {
        "RU": "Команды в которых вы состоите",
        "EU": "Teams you are a part of"
    },
    "Созданные вами команды": {
        "RU": "Созданные вами команды",
        "EU": "Teams you created"
    },
    "создать новую команду": {
        "RU": "создать новую команду",
        "EU": "create a new team"
    },
    "Редактировать команду": {
        "RU": "Редактировать команду",
        "EU": "Edit team"
    },
    "Шаг 1. Название и изображение": {
        "RU": "Шаг 1. Название и изображение",
        "EU": "Step 1. The title and avatar"
    },
    "Шаг 2. Состав": {
        "RU": "Шаг 2. Состав",
        "EU": "Step 2. Composition"
    },
    "На данной странице вы можете найти команды, в которых вы числитесь на данный момент": {
        "RU": "На данной странице вы можете найти команды, в которых вы числитесь на данный момент",
        "EU": "On this page you can find the teams you currently belong to"
    },
    "Ваши команды": {
        "RU": "Ваши команды",
        "EU": "Your teams"
    },
    "Команды": {
        "RU": "Команды",
        "EU": "Teams"
    },
    "Шаг 1. Айдентика команды": {
        "RU": "Шаг 1. Айдентика команды",
        "EU": "Step 1. Team identity"
    },
    "Смотреть больше": {
        "RU": "Смотреть больше",
        "EU": "See more"
    },
    "Показатель": {
        "RU": "Показатель",
        "EU": "Index"
    },
    "Среднее KD: 1.23": {
        "RU": "Среднее KD: 1.23",
        "EU": "Average KD: 1.23"
    },
    "Среднее место: 8": {
        "RU": "Среднее место: 8",
        "EU": "Average place: 8"
    },
    "Регион": {
        "RU": "Регион",
        "EU": "Region"
    },
    "Платформа для игры": {
        "RU": "Платформа для игры",
        "EU": "Play platform"
    },
    "Поиск игроков": {
        "RU": "Поиск игроков",
        "EU": "Search for players"
    },
    "На данной странице вы можете найти тиммейтов в команду.": {
        "RU": "На данной странице вы можете найти тиммейтов в команду.",
        "EU": "On this page you can find teammates."
    },
    "Отображать": {
        "RU": "Отображать",
        "EU": "Display"
    },
    "Игнорировать": {
        "RU": "Игнорировать",
        "EU": "Ignore"
    },
    "Принять заявку": {
        "RU": "Принять заявку",
        "EU": "Accept Application"
    },
    "Поиск по друзьям": {
        "RU": "Поиск по друзьям",
        "EU": "Search by friends"
    },
    "Ваши друзья": {
        "RU": "Ваши друзья",
        "EU": "Your friends"
    },
    "Принять": {
        "RU": "Принять",
        "EU": "Accept"
    },
    "Тут отображаются заявки к вам в друзья.": {
        "RU": "Тут отображаются заявки к вам в друзья.",
        "EU": "Friend requests are displayed here."
    },
    "Заявки в друзья": {
        "RU": "Заявки в друзья",
        "EU": "Friend requests"
    },
    "Просмотр": {
        "RU": "Просмотр",
        "EU": "View"
    },
    "Добавить соц. сеть": {
        "RU": "Добавить соц. сеть",
        "EU": "Add social net"
    },
    "Выберите соц. сеть": {
        "RU": "Выберите соц. сеть",
        "EU": "Choose a social net"
    },
    "Соц. сеть": {
        "RU": "Соц. сеть",
        "EU": "ProfileSocial net"
    },
    "Добавить социальную сеть": {
        "RU": "Добавить социальную сеть",
        "EU": "Add social network"
    },
    "Artem@des": {
        "RU": "Artem@des",
        "EU": "Artem@des"
    },
    "Социальные сети": {
        "RU": "Социальные сети",
        "EU": "ProfileSocial media"
    },
    "Сменить пароль": {
        "RU": "Сменить пароль",
        "EU": "Change password"
    },
    "Введите старый пароль": {
        "RU": "Введите старый пароль",
        "EU": "Enter old password"
    },
    "Новый пароль": {
        "RU": "Новый пароль",
        "EU": "New Password"
    },
    "Введите новый пароль": {
        "RU": "Введите новый пароль",
        "EU": "Enter a new password"
    },
    "Безопасность": {
        "RU": "Безопасность",
        "EU": "Safety"
    },
    "nickname@cyberleague.com": {
        "RU": "nickname@cyberleague.com",
        "EU": "nickname@cyberleague.com"
    },
    "Электронная почта": {
        "RU": "Электронная почта",
        "EU": "Email"
    },
    "Никнейм": {
        "RU": "Никнейм",
        "EU": "Nickname"
    },
    "Профиль": {
        "RU": "Профиль",
        "EU": "Profile"
    },
    "Прошел": {
        "RU": "Прошел",
        "EU": "Passed"
    },
    "23.06.2023 – 30.06.2023": {
        "RU": "23.06.2023 – 30.06.2023",
        "EU": "23.06.2023 – 30.06.2023"
    },
    "Последние турниры": {
        "RU": "Последние турниры",
        "EU": "Latest tournaments"
    },
    "0.01": {
        "RU": "0.01",
        "EU": "0.01"
    },
    "0.8": {
        "RU": "0.8",
        "EU": "0.8"
    },
    "1.0": {
        "RU": "1.0",
        "EU": "1.0"
    },
    "10 000": {
        "RU": "10 000",
        "EU": "10 000"
    },
    "1.5": {
        "RU": "1.5",
        "EU": "1.5"
    },
    "12 000": {
        "RU": "12 000",
        "EU": "12 000"
    },
    "2.0": {
        "RU": "2.0",
        "EU": "2.0"
    },
    "24 000": {
        "RU": "24 000",
        "EU": "24 000"
    },
    "KD": {
        "RU": "KD",
        "EU": "KD"
    },
    "4 место": {
        "RU": "4 место",
        "EU": "4 place"
    },
    "Среднее место": {
        "RU": "Среднее место",
        "EU": "middle place"
    },
    "1.25": {
        "RU": "1.25",
        "EU": "1.25"
    },
    "Турниров выиграно": {
        "RU": "Турниров выиграно",
        "EU": "Tournaments won"
    },
    "Турниров сыграно": {
        "RU": "Турниров сыграно",
        "EU": "Tournaments played"
    },
    "Соц.сети игрока": {
        "RU": "Соц.сети игрока",
        "EU": "ProfileSocial networks of the player"
    },
    "Результаты турниров": {
        "RU": "Результаты турниров",
        "EU": "Tournament results"
    },
    "Перейти к командам": {
        "RU": "Перейти к командам",
        "EU": "Go to teams"
    },
    "Команды игрока": {
        "RU": "Команды игрока",
        "EU": "Player commands"
    },
    "1.24": {
        "RU": "1.24",
        "EU": "1.24"
    },
    "Статистика игрока": {
        "RU": "Статистика игрока",
        "EU": "Player stats"
    },
    "Тут отображаются ваши соц сети, добавить их можно в": {
        "RU": "Тут отображаются ваши соц сети, добавить их можно в",
        "EU": "Your social networks are displayed here, you can add them in"
    },
    "настройках": {
        "RU": "настройках",
        "EU": "the settings"
    },
    "Ваши соц.сети": {
        "RU": "Ваши соц.сети",
        "EU": "Your social networks"
    },
    "Перейти к друзьям": {
        "RU": "Перейти к друзьям",
        "EU": "Go to friends"
    },
    "Статистика": {
        "RU": "Статистика",
        "EU": "Statistics"
    },
    "очков": {
        "RU": "очков",
        "EU": "points"
    },
    "23 800 очков": {
        "RU": "23 800 очков",
        "EU": "23,800 points"
    },
    "Всего очков:": {
        "RU": "Всего очков:",
        "EU": "Total points:"
    },
    "Среднее K/D:": {
        "RU": "Среднее K/D:",
        "EU": "Average K/D:"
    },
    "Персональный рейтинг": {
        "RU": "Персональный рейтинг",
        "EU": "Personal rating"
    },
    "Рейтинг игроков на платформе": {
        "RU": "Рейтинг игроков на платформе",
        "EU": "Rating of players on the platform"
    },
    "Рейтинг команд на платформе": {
        "RU": "Рейтинг команд на платформе",
        "EU": "Rating of teams on the platform"
    },
    "Командный рейтинг": {
        "RU": "Командный рейтинг",
        "EU": "Team rating"
    },
    "Показать все турниры": {
        "RU": "Показать все турниры",
        "EU": "Show all tournaments"
    },
    "Прием заявок": {
        "RU": "Прием заявок",
        "EU": "Acceptance of applications"
    },
    "На данной странице вы можете найти активные турниры.": {
        "RU": "На данной странице вы можете найти активные турниры.",
        "EU": "On this page you can find active tournaments."
    },
    "На данной странице вы можете найти завершенные турниры.": {
        "RU": "На данной странице вы можете найти завершенные турниры.",
        "EU": "On this page you can find finished tournaments."
    },
    "На данной странице вы можете найти активные хабы.": {
        "RU": "На данной странице вы можете найти активные хабы.",
        "EU": "On this page you can find active hubs."
    },
    "На данной странице вы можете найти завершенные хабы.": {
        "RU": "На данной странице вы можете найти завершенные хабы.",
        "EU": "On this page you can find finished hubs."
    },
    "Турниры по Warzone": {
        "RU": "Турниры по warzone",
        "EU": "Warzone tournaments"
    },
    "Турниры по CSGO": {
        "RU": "Турниры по CSGO",
        "EU": "CSGO tournaments"
    },
    "Хабы по Warzone": {
        "RU": "Хабы по Warzone",
        "EU": "Warzone hubs"
    },
    "Хабы по CSGO": {
        "RU": "Хабы по CSGO",
        "EU": "CSGO hubs"
    },
    "Турниры": {
        "RU": "Турниры",
        "EU": "Tournament"
    },
    "0%": {
        "RU": "0%",
        "EU": "0%"
    },
    "Загрузка:": {
        "RU": "Загрузка:",
        "EU": "Loading:"
    },
    "Вопрос и ответ": {
        "RU": "Вопрос и ответ",
        "EU": "Question and answer"
    },
    "Lorem ipsum dolor sit amet consectetur. Leo viverra donec purus in neque facilisi dictum nisl eget.": {
        "RU": "Lorem ipsum dolor sit amet consectetur. Leo viverra donec purus in neque facilisi dictum nisl eget.",
        "EU": "Lorem ipsum dolor sit amet, consectetur. The rhythm of the cartoon until it is clear is not easy for the fans."
    },
    "Обратная связь": {
        "RU": "Обратная связь",
        "EU": "Feedback"
    },
    "купить за": {
        "RU": "купить за",
        "EU": "buy for"
    },
    "Описание товара": {
        "RU": "Описание товара",
        "EU": "Product description"
    },
    "1100 COD points": {
        "RU": "1100 COD points",
        "EU": "1100 COD points"
    },
    "Сортировать по цене": {
        "RU": "Сортировать по цене",
        "EU": "Sort by price"
    },
    "Placeholder": {
        "RU": "Placeholder",
        "EU": "Placeholder"
    },
    "PS Plus": {
        "RU": "PS Plus",
        "EU": "PS Plus"
    },
    "COD CP": {
        "RU": "COD CP",
        "EU": "COD CP"
    },
    "Магазин": {
        "RU": "Магазин",
        "EU": "Shop"
    },
    "Показать все": {
        "RU": "Показать все",
        "EU": "show all"
    },
    "Прошедшие турниры": {
        "RU": "Прошедшие турниры",
        "EU": "Past tournaments"
    },
    "Еще 2 турнира": {
        "RU": "Еще 2 турнира",
        "EU": "2 more tournaments"
    },
    "Lorem ipsum dolor sit amet consectetur. Pellentesque felis lorem ornare volutpat accumsan eu gravida nec tincidunt.": {
        "RU": "Lorem ipsum dolor sit amet consectetur. Pellentesque felis lorem ornare volutpat accumsan eu gravida nec tincidunt.",
        "EU": "Lorem ipsum dolor sit amet, consectetur. Children of the world of felis ornare volutpat accumsan eu gravida nec tincidunt."
    },
    "Участвуй в наших турнирах": {
        "RU": "Участвуй в наших турнирах",
        "EU": "Participate in our tournaments"
    },
    "Присоединяйся!": {
        "RU": "Присоединяйся!",
        "EU": "Join now!"
    },
    "Наша платформа — это трамплин для старта в мире киберспорта. Даем возможность каждому зарабатывать на своем хобби.": {
        "RU": "Наша платформа — это трамплин для старта в мире киберспорта. Даем возможность каждому зарабатывать на своем хобби.",
        "EU": "Our platform is a springboard for starting in the world of eSports. We give everyone the opportunity to earn on their hobby."
    },
    "Организуем турниры \nи развиваем киберспорт": {
        "RU": "Организуем турниры \nи развиваем киберспорт",
        "EU": "We organize tournaments\nand develop eSports"
    },
    "Страница Турнира (правила)": {
        "RU": "Страница Турнира (правила)",
        "EU": "Tournament page (rules)"
    },
    "Страница Турнира (рейтинг)": {
        "RU": "Страница Турнира (рейтинг)",
        "EU": "Tournament page (ranking)"
    },
    "Страница Турнира (участники)": {
        "RU": "Страница Турнира (участники)",
        "EU": "Tournament page (participants)"
    },
    "Страница Турнира (Главная)": {
        "RU": "Страница Турнира (Главная)",
        "EU": "Tournament Page (Main)"
    },
    "Просмотр профиля": {
        "RU": "Просмотр профиля",
        "EU": "Profile view"
    },
    "Страница команд и создание команды": {
        "RU": "Страница команд и создание команды",
        "EU": "Team Page and Team Creation"
    },
    "Мета-сборки": {
        "RU": "Мета-сборки",
        "EU": "Meta builds"
    },
    "Общий рейтинг": {
        "RU": "Общий рейтинг",
        "EU": "Overall rating"
    },
    "Загрузчик": {
        "RU": "Загрузчик",
        "EU": "Loader"
    },
    "Страница турниров": {
        "RU": "Страница турниров",
        "EU": "Tournament Page"
    },
    "Главная страница": {
        "RU": "Главная страница",
        "EU": "Main page"
    },
    "Введите e-mail": {
        "RU": "Введите e-mail",
        "EU": "Enter e-mail"
    },
    "Восстановление пароля": {
        "RU": "Восстановление пароля",
        "EU": "Password recovery"
    },
    "Письмо с новым паролем отправлено на почту": {
        "RU": "Письмо с новым паролем отправлено на почту",
        "EU": "A letter with a new password has been sent to your mailbox"
    },
    "После входа его можно сменить на странице Профиля.": {
        "RU": "После входа его можно сменить на странице Профиля.",
        "EU": "Once logged in, it can be changed on the Profile page."
    },
    "на главную": {
        "RU": "на главную",
        "EU": "To main"
    },
    "Войти": {
        "RU": "Войти",
        "EU": "Login"
    },
    "EU": {
        "RU": "EU",
        "EU": "EU"
    },
    "Мета–сборки": {
        "RU": "Мета–сборки",
        "EU": "Meta Builds"
    },
    "Играть": {
        "RU": "Играть",
        "EU": "Play"
    },
    "Правила турнира": {
        "RU": "Правила турнира",
        "EU": "Tournament Rules"
    },
    "Матчи": {
        "RU": "Матчи",
        "EU": "Matches"
    },
    "Хабы": {
        "RU": "Хабы",
        "EU": "Hubs"
    },
    "Тип подписки": {
        "RU": "Тип подписки",
        "EU": "Type of subscriptions"
    },
    "Лучшее K/D": {
        "RU": "Лучшее K/D",
        "EU": "Best K/D"
    },
    "Лучший в убийствах": {
        "RU": "Лучший в убийствах",
        "EU": "Best at Kills"
    },
    "Победители": {
        "RU": "Победители",
        "EU": "Winners"
    },
    "Перейти на Twitch": {
        "RU": "Перейти на Twitch",
        "EU": "Go to Twitch"
    },
    "Игрок, игрок, игрок, игрок, игрок": {
        "RU": "Игрок, игрок, игрок, игрок, игрок",
        "EU": "Player, player, player, player, player"
    },
    "Смотреть участников": {
        "RU": "Смотреть участников",
        "EU": "See participants"
    },
    "игрока": {
        "RU": "игрока",
        "EU": "players"
    },
    "Играет с": {
        "RU": "Играет с",
        "EU": "Playing since"
    },
    "Друзья": {
        "RU": "Друзья",
        "EU": "Friends"
    },
    "Удалить из друзей": {
        "RU": "Удалить из друзей",
        "EU": "Remove from friends"
    },
    "Никнейм игрока (админимтратор)": {
        "RU": "Никнейм игрока (админимтратор)",
        "EU": "Player nickname (administrator)"
    },
    "Что бы участвовать в турнирах Вам необходимо как минимум 5 человек в команде, для поиска вы можете воспользоваться вкладкой Поиск тиммейтов или пригласить в команду своих друзей": {
        "RU": "Что бы участвовать в турнирах Вам необходимо как минимум 5 человек в команде, для поиска вы можете воспользоваться вкладкой Поиск тиммейтов или пригласить в команду своих друзей",
        "EU": "To participate in tournaments, you need at least 5 people in the team, to search, you can use the Teammates Search tab or invite your friends to the team"
    },
    "Команда “Название команды”": {
        "RU": "Команда “Название команды”",
        "EU": "Command “Team Name”"
    },
    "Покинуть команду": {
        "RU": "Покинуть команду",
        "EU": "Leave the team"
    },
    "Сохранить" :{
        "RU": "Сохранить",
        "EU": "Save"
    },
    "1.23": {
        "RU": "1.23",
        "EU": "1.23"
    },
    "8 место": {
        "RU": "8 место",
        "EU": "8 place"
    },
    "Действия": {
        "RU": "Действия",
        "EU": "Actions"
    },
    "Среднее KD": {
        "RU": "Среднее KD",
        "EU": "Average KD"
    },
    "Применить изменения": {
        "RU": "Применить изменения",
        "EU": "Apply Changes"
    },
    "Отображать иконку платформы": {
        "RU": "Отображать иконку платформы",
        "EU": "Display platform icon"
    },
    "Компьютер": {
        "RU": "Компьютер",
        "EU": "Computer"
    },
    "Выберите платформу для игры": {
        "RU": "Выберите платформу для игры",
        "EU": "Choose a platform to play"
    },
    "Среднее место в рейтинге": {
        "RU": "Среднее место в рейтинге",
        "EU": "Average place in the ranking"
    },
    "Среднее K/D на команду": {
        "RU": "Среднее K/D на команду",
        "EU": "Average K/D per team"
    },
    "Сыгранные турниры": {
        "RU": "Сыгранные турниры",
        "EU": "Tournaments played"
    },
    "Ваша платформа": {
        "RU": "Ваша платформа",
        "EU": "Your platform"
    },
    "1 страница": {
        "RU": "1 страница",
        "EU": "1 page"
    },
    "K/D": {
        "RU": "K/D",
        "EU": "K/D"
    },
    "опубликовать сборку": {
        "RU": "опубликовать сборку",
        "EU": "publish build"
    },
    "Добавить заметку": {
        "RU": "Добавить заметку",
        "EU": "Add note"
    },
    "Заметка": {
        "RU": "Заметка",
        "EU": "The note"
    },
    "Ссылка на видео с Youtube": {
        "RU": "Ссылка на видео с Youtube",
        "EU": "Link to video from Youtube"
    },
    "Дополнительные детали": {
        "RU": "Дополнительные детали",
        "EU": "Additional details"
    },
    "Тип обвеса": {
        "RU": "Тип обвеса",
        "EU": "body kit type"
    },
    "Обвесы": {
        "RU": "Обвесы",
        "EU": "Body kits"
    },
    "Выберите оружие": {
        "RU": "Выберите оружие",
        "EU": "Choose a weapon"
    },
    "Выберите тип оружия": {
        "RU": "Выберите тип оружия",
        "EU": "Select weapon type"
    },
    "Выберите режим": {
        "RU": "Выберите режим",
        "EU": "Select Mode"
    },
    "Общая информация": {
        "RU": "Общая информация",
        "EU": "General information"
    },
    "Конструктор сборок": {
        "RU": "Конструктор сборок",
        "EU": "Meta build constructor"
    },
    "Ваши сборки": {
        "RU": "Ваши сборки",
        "EU": "Your builds"
    },
    "Сборки сообщества": {
        "RU": "Сборки сообщества",
        "EU": "Community builds"
    },
    "Дистанция": {
        "RU": "Дистанция",
        "EU": "Distance"
    },
    "Тип оружия": {
        "RU": "Тип оружия",
        "EU": "Weapon type"
    },
    "Режим": {
        "RU": "Режим",
        "EU": "Mode"
    },
    "Ник автора": {
        "RU": "Ник автора",
        "EU": "Nickname of the author"
    },
    "Основное оружие сборки": {
        "RU": "Основное оружие сборки",
        "EU": "Primary build weapon"
    },
    "0.00": {
        "RU": "0.00",
        "EU": "0.00"
    },
    "Обвес": {
        "RU": "Обвес",
        "EU": "body kit"
    },
    "Дата создания": {
        "RU": "Дата создания",
        "EU": "date of creation"
    },
    "Фильтры": {
        "RU": "Фильтры",
        "EU": "Filters"
    },
    "Поиск по сборкам": {
        "RU": "Поиск по сборкам",
        "EU": "Search meta builds"
    },
    "Создать сборку": {
        "RU": "Создать сборку",
        "EU": "Create build"
    },
    "Выбирайте мета-сборки или составляйте свои и делитесь ими с игроками на нашей платформе.": {
        "RU": "Выбирайте мета-сборки или составляйте свои и делитесь ими с игроками на нашей платформе.",
        "EU": "Choose meta builds or create your own and share them with players on our platform."
    },
    "Завершенные турниры": {
        "RU": "Завершенные турниры",
        "EU": "Completed tournaments"
    },
    "Активные турниры": {
        "RU": "Активные турниры",
        "EU": "Active Tournaments"
    },
    "Завершенные хабы": {
        "RU": "Завершенные турниры",
        "EU": "Completed hubs"
    },
    "Активные хабы": {
        "RU": "Активные турниры",
        "EU": "Active hubs"
    },
    "Скоро начнется": {
        "RU": "Скоро начнется",
        "EU": "Coming soon"
    },
    "Закончился": {
        "RU": "Закончился",
        "EU": "Ended"
    },
    "Наша платформа — это трамплин для старта в мире киберспорта. \nДаем возможность каждому зарабатывать на своем хобби.": {
        "RU": "Наша платформа — это трамплин для старта в мире киберспорта. \nДаем возможность каждому зарабатывать на своем хобби.",
        "EU": "Our platform is a springboard for starting in the world of eSports.\nWe give everyone the opportunity to earn on their hobby."
    },
    "Создать новую команду": {
        "RU": "Создать новую команду",
        "EU": "Create new team"
    },
    "Шаг 1. Выбор команды": {
        "RU": "Шаг 1. Выбор команды",
        "EU": "Step 1. Select the team"
    },
    "Выберите команду": {
        "RU": "Выберите команду",
        "EU": "Select the team"
    },
    "Вам необходимо оплатить участие на турнир.": {
        "RU": "Вам необходимо оплатить участие на турнир.",
        "EU": "You need to pay for participation on this tournament"
    },
    "Оплатить": {
        "RU": "Оплатить",
        "EU": "Pay"
    },
    "Проверить оплату": {
        "RU": "Проверить оплату",
        "EU": "Check the payment"
    },
    "Обновить ссылку на оплату": {
        "RU": "Обновить ссылку на оплату",
        "EU": "Refresh payment url"
    },
    "Получить ссылку на оплату": {
        "RU": "Получить ссылку на оплату",
        "EU": "Get payment url"
    },
    "команд": {
        "RU": "команд",
        "EU": "teams"
    },
    "Шаг 4. Сбор состава": {
        "RU": "Шаг 4. Сбор состава",
        "EU": "Step 4. Select the players"
    },
    "Не оплачено": {
        "RU": "Не оплачено",
        "EU": "Not paid",
    },
    "Оплачено": {
        "RU": "Оплачено",
        "EU": "Paid",
    },
    "Удалить участника": {
        "RU": "Удалить участника",
        "EU": "Delete participant"
    },
    "Переопределить номер": {
        "RU": "Переопределить номер",
        "EU": "Redeclare room number"
    },
    "Изменить статус оплаты": {
        "RU": "Изменить статус оплаты",
        "EU": "Change payment status"
    },
    "Чтобы принять участие в турнире вам необходимо перести": {
        "RU": "Чтобы принять участие в турнире вам необходимо перести",
        "EU": "To participate in this tournament you need to transfer"
    },
    "на PayPal аккаунт": {
        "RU": "на PayPal аккаунт",
        "EU": "to PayPal account"
    },
    "После оплаты напишите любому PTW Administrator в нашем Discord, который онлайн.\nНаш Discord": {
        "RU": "После оплаты напишите любому PTW Administrator в нашем Discord, который онлайн.\nНаш Discord",
        "EU": "After transfer write to any PTW Administrator in our Discord, which is online\nOur Discord"
    },
    "Для оплаты перейдите по ссылке": {
        "RU": "Для оплаты перейдите по ссылке",
        "EU": "For payment, please follow this link"
    },
    "FAQ": {
        "RU": "FAQ",
        "EU": "FAQ"
    },
    "Соц.сети": {
        "RU": "Соц.сети",
        "EU": "Social networks"
    },
    "Участие в турнирах": {
        "RU": "Участие в турнирах",
        "EU": "Participation in tournaments"
    },
    "Удалить": {
        "RU": "Удалить",
        "EU": "Delete"
    },
    "Пользователи не найдены": {
        "RU": "Пользователи не найдены",
        "EU": "Users not found"
    },
    "Activision ID": {
        "RU": "Activision ID",
        "EU": "Activision ID"
    },
    "Playstation": {
        "RU": "Playstation",
        "EU": "Playstation"
    },
    "XBOX": {
        "RU": "XBOX",
        "EU": "XBOX"
    },
    "Выберите устройство": {
        "RU": "Выберите устройство",
        "EU": "Select a device"
    },
    "Геймпад": {
        "RU": "Геймпад",
        "EU": "Gamepad"
    },
    "Клавиатура и мышь": {
        "RU": "Клавиатура и мышь",
        "EU": "Keyboard and mouse"
    },
    "Оружие": {
        "RU": "Оружие",
        "EU": "Weapon"
    },
    "Название": {
        "RU": "Название",
        "EU": "Title"
    },
    "Турниров в ТОП 3": {
        "RU": "Турниров в ТОП 3",
        "EU": "Tournaments TOP 3"
    },
    "Среднее убийств": {
        "RU": "Среднее убийств",
        "EU": "Average kills"
    },
    "Оплатить PayPal": {
        "RU": "Оплатить PayPal",
        "EU": "Pay with PayPal"
    },
    "Оплатить картой": {
        "RU": "Оплатить картой",
        "EU": "Pay with card"
    },
    "Очистить": {
        "RU": "Очистить",
        "EU": "Clear"
    }
}
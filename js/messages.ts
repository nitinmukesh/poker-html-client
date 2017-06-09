/// <reference path="_references.ts" />
/* tslint:disable:quotemark no-trailing-comma max-line-length */

var messages: any = {
    loading: "Загрузка...",
    login: 'Вход',
    logout: 'Выход',
    playnow: 'Играть',
    common: {
        login: 'Войти',
        logout: 'Выход',
        ok: 'ОК',
        cancel: 'Отмена',
        back: 'Назад',
        close: 'Закрыть',
        any: 'Все',
        of: '/',
        or: 'или',
        hours: '',
        minutes: '',
        timeseparator: ':',
        unspecifiedError: 'Произошла неизвестная ошибка',
    },
    updater: {
        title: 'Обновление',
        line1: 'Доступно новое обновление',
        button: 'Обновить'
    },
    broadcast: {
        caption: 'Администрация',
    },
    news: {
        caption: 'Новости',
    },
    menu: {
        home: 'Главная',
        lobby: 'Лобби',
        tables: 'Столы',
        cashier: 'Счет',
        settings: 'Настройки',
        account: 'Аккаунт',
        chat: 'Чат',
        rating: 'Рейтинг',
        messages: 'Сообщения',
        information: 'Информация',
        quit: 'Выход',
    },
    currency: {
        caption: 'Валюта',
        realmoney: 'Тенге',
        gamemoney: 'Фишки',
        rewardpoints: 'Поинты',
        points: 'PR',
    },
    players: {
        caption: 'Игроки',
        players2: '1 на 1',
        players6: '6 макс.',
        players10: '10 полный',
    },
    bets: {
        caption: 'Ставки',
        level1: 'Малые (10/20 - 25/50)',
        level2: 'Средние (50/100 - 250/500)',
        level3: 'Высокие (1000/2000+)',
    },
    limits: {
        caption: 'Лимиты',
        limit1: 'Фикс. лимит',
        limit2: 'Пот лимит',
        limit3: 'Без лимит',
    },
    speed: {
        caption: 'Скорость',
        normal: 'Обычная',
        turbo: 'Турбо',
        turbo2x: 'Турбо 2x',
    },
    buyin: {
        caption: 'Бай-ин',
        freeroll: 'Фриролл',
        level1: 'Малый (100-300)',
        level2: 'Средний (500-2000)',
        level3: 'Большой (3000+)',
    },
    header: {
        onlinePlayers: '<span>#registered</span> игроков | <span>#online</span> онлайн<br />Первый покер-рум в стране',
        onlinePlayersShort: '<span>#registered</span> игроков | <span>#online</span> онлайн',
    },
    homePage: {
        rememberme: 'Запомнить меня',
        forgetPassword: 'Забыли пароль?',
        gamesButton: 'Игры',
        userRequired: 'Необходимо указать логин',
        passwordRequired: 'Необходимо указать пароль',
        online: 'Игроков онлайн:',
    },
    lobby: {
        cashGames: 'Столы',
        tournaments: 'Турниры',
        sitAndGo: 'Сит-энд-Го',
        filter: 'Сортировать',
        time: 'Время ',
        filterheader: {
            bets: 'Ставки',
            limits: 'Лимит',
            speed: 'Скорость',
            buyin: 'Байин',
            maxplayers: 'Макс. игроков',
        }
    },
    tablesList: {
        headerCaption: 'Столы (#count)',
        players: 'Игроки',
        bets: 'Ставки',
        noTablesSelected: 'Откройте хотя бы один стол',
    },
    tournamentsList: {
        headerCaption: '#count Турнир(ов)',
        sngCaption: '#count Сит-энд-го',
        players: 'Игроков:',
        buyin: 'Бай-ин:',
        status: 'Статус:',
        filter: 'Сортировать',
    },
    tournamentLobby: {
        caption: 'Турнир #number',
        register: 'Зарегистироваться',
        unregister: 'Отменить регистрацию',
        viewGame: 'Играть / Наблюдать',
        description: 'Описание',
        continueGame: 'Играть / Наблюдать',
        sitAndGo: 'Сит-энд-Го',
        buyin: 'Бай-ин:',
        entryFee: 'Вступительный взнос:',
        limit1: 'Холдем с фиксированным лимитом',
        limit2: 'Пот лимитный Холдем',
        limit3: 'Без лимитный Холдем',
        youCouldSit: 'Места можно будет занять:',
        whenPlayersRegistered: 'когда зарегистрируется следующее количество игроков:',
        registeredPlayers: 'Зарегистрировано игроков: ',
        status0: 'Ожидает',
        status1: 'Регистрация',
        status2: 'Рег. отменена',
        status3: 'Рассадка',
        status4: 'Ожидание',
        status5: 'Идет',
        status6: 'Завершен',
        status7: 'Отменен',
        status8: 'Позд.рег.',
        maxPlayersStart: '(максимум ',
        maxPlayersEnd: ' участников(а))',
        maxPlayers: 'Макс. кол-во участников:',
        minPlayers: 'Мин. кол-во участников:',
        status: 'Информация',
        prizes: 'Призы',
        bets: 'Призы и ставки',
        players: 'Игроки',
        tables: 'Список столов',
        bet: {
            level: 'Уровень',
            smallBlind: 'Малый блайнд',
            bigBlind: 'Большой блайд',
            blinds: 'Блайнды',
            ante: 'Анте',
        },
        prize: {
            place: 'Место',
            amount: 'Выигрыш',
        },
        tplayers: {
            login: 'Имя',
            place: 'Место',
            stack: 'Фишки',
        },
        ttables: {
            name: 'Выберите стол',
            login: 'Логин',
        },
        participants: 'Участники:',
        tournamentStart: 'Турнир начнется:',
        tournamentStarted: 'Турнир начался:',
        tournamentStartedNoOpen: 'Турнир начался:',
        tournamentEnded: 'Турнир окончился:',
        tournamentRegistrationStarted: 'Начало регистрация:',
        tournamentRegistrationEnded: 'Окончание регистрации:',
        totalPrizePool: 'Общий призовой фонд:',
        guaranteedPrizePool: 'Гарантированный приз. фонд',
        prizePlaces: 'Призовых мест:',
        betStructureWithAnte: 'Блайнды #sb/#bb анте #ante',
        betStructureWithoutAnte: 'Блайнды #sb/#bb',
        participantsInformation: '#joined, сейчас за #tablesCount столами #playersCount игроков(а)',
        stackInformation: '(самый большой #max, средний: #avg, наименьший #min)',
        initialAmount: 'Начальный стек:',
        blindUpdate: 'Повышение блаиндов:',
        blindUpdateEach: 'Каждые ',
        blindUpdateMin: ' мин.',
        no: 'нет',
        rebuy: 'Ребай:',
        rebuyOptions: ' мин. без ограничений',
        addon: 'Аддон:',
        addonOptions: ' мин. После ребаев',
        pause: 'Перерыв:',
        pauseOptions: 'мин. в час.',
        lateRegistration: 'Поздняя регистрация:',
        registrationSuccess: 'Регистрация в турнире',
        tournamentRegistrationSuccess: 'Вы успешно зарегистрированы в турнире',
        registrationCancelled: 'Отмена регистрации',
        tournamentRegistrationCancelled: 'Ваша регистрация в турнире отменена',
        tournamentRegistrationPromptCaption: 'Регистрация в турнире',
        tournamentRegistrationPrompt: '<div style="text-align: center">#name#</div><div style="text-align: left">Для регистрации в турнире с вашего счета будут списано:</div>',
        tournamentRegistrationAmount: '<span style="text-align: center">Бай-ин: <span style="float: right">#amount</span></span>',
        tournamentRegistrationPromptBalance: '<span style="text-align: left">Баланс: <span style="float: right">#amount</span></span>',
        tournamentRegistrationCancelPromptCaption: 'Отмена регистрации',
        tournamentRegistrationCancelPrompt: 'Вы действительно хотите отменить свою регистрацию в турнире #name?',
        registrationError: 'Ошибка при регистрации',
        registrationCancelError: 'Ошибка при отмене регистрации',
        insufficientFunds: 'Недостаточно фишек',
        registrationCompleteSuccess: 'Вы успешно зарегистрировались в турнире.',
        registrationCancelledCompleteSuccess: 'Ваша регистрация в турнире отменена.',
        showTableError: 'Ошибка открытия турнирного стола.',
        tournamentStatus: 'Статус',
    },
    settings: {
        profileTitle: 'Профиль',
        caption: "Настройки",
        selectCardsVariant: "Выберите способ отображения карт.",
        radioUp: "В верхнем углу",
        radioDown: "В нижнем углу",
    },
    auth: {
        logon: 'Вход',
        forgetPassword: 'Забыли пароль',
        registration: 'Регистрация',
        guestPlay: 'Гостевая игра',
        enterToken: 'Ввести код',
        registrationsuccess: 'Регистрация прошла успешно! Для активации учетной записи пройдите по ссылке, которая указана в электронном письме. Письмо было отправлено на электронную почту, указанную вами при регистрации.',
        changePassword: 'Изменить пароль',
        unspecifiedError: 'Сбой подключения',
        selectPicture: 'Выбрать изображение',
        uploadPicture: 'Галерея',
        rememberMe: 'Запомнить меня',

        username: 'Логин',
        password: 'Пароль',
        newPassword: 'Новый пароль',
        confirmPassword: 'Повторите пароль',
        firstName: 'Имя',
        lastName: 'Фамилия',
        oldPassword: 'Старый пароль',
        email: 'Email',
        minimumAge: 'Мне есть 21 год',
        agree: 'Я согласен с',
        eulaTerms: 'Пользовательским соглашением',
        forgetPasswordSuccess: 'На вашу почту было отправлено сообщение с инструкциями по восстановлению пароля',
        securityToken: 'Код смены пароля',
        passwordRecovery: 'Восстановление пароля',
        passwordRecoveredSuccess: 'Пароль успешно изменен',
        passwordChangedSuccess: 'Вы успешно изменили пароль',
        youAreLoggedIn: 'Вы вошли как',
    },
    cashier: {
        pageCaption: 'Счет',
        backButtonLabel: 'Лобби',
        username: 'Имя пользователя:',
        available: 'Доступно:',
        ingame: 'В игре:',
        total: 'Всего:',
        withdrawal: 'Мой профиль',
        showHistory: 'История счета',
        deposit: 'Купить фишки',
    },
    withdrawal: {
        pageCaption: 'Снятие денег',
        username: 'Логин:',
        total: 'Итого:',
        withdrawal: 'Снять',
        backButtonLabel: 'Счет',
        amount: 'На счету:',
        withdrawalAmount: 'Сумма:',
        withdrawalMethod: 'Плат. система:',
        accountNumber: 'Счет в платежной системе:',
    },
    table: {
        sitHere: 'Сесть тут',
        sitHere1: 'Сесть',
        sitHere2: 'тут',
        standupPromptCaption: 'Покинуть стол',
        standupPrompt: 'Вы действительно хотете покинуть стол?',
        standupTournamentPrompt: 'Вы действительно хотете покинуть стол? Блайнды будут сниматься автоматически во время всей игры',
        rebuyPromptCaption: 'Ребай',
        rebuyPrompt: 'Стоимость ребая: #price#',
        doubleRebuyPromptCaption: 'Двойной ребай',
        doubleRebuyPrompt: 'Стоимость двойного ребая: #price#',
        addonPromptCaption: 'Аддон',
        addonPrompt: 'Стоимость аддона: #price#',
        tournamentGameFinishedCaption: 'Турнир',
        tournamentGameFinishedAddon: 'У Вас закончились фишки, хотите купить аддон, чтобы продолжить игру?',
        tournamentGameFinishedRebuy: 'У Вас закончились фишки, хотите купить ребай, что бы продолжить игру?',
        tournamentGameFinishedRebuyCaption: 'Ребай: #time# сек',
        tournamentGameFinishedAddonCaption: 'Аддон: #time# сек',
        addonAllowed: 'Начался период аддонов. Теперь вы можете купить аддон.',
        addonAllowedNotPlaying: 'Начался период аддонов.',
        waitingForOtherPlayersRebuy: 'Ожидание покупки ребая игроком. Осталось: #time# сек',
        waitingForOtherPlayersAddon: 'Ожидание покупки аддона игроком. Осталось: #time# сек',
        addon: 'Аддон',
        rebuy: 'Ребай',
        doubleRebuy: 'Двойной ребай',
        comeback: 'Вернуться',
        fold: 'Фолд',
        check: 'Чек',
        call: 'Колл #amount',
        bet: 'Бет #amount',
        raise: 'Рейз #amount',
        allin: 'Олл-ин #amount',
        lobby: 'Лобби',
        menu: 'Меню',
        leave: 'Выйти',
        skipDeals: 'Отсесть',
        autofold: 'Авто-фолд',
        waitbb: 'Ожидать ББ',
        halfpot: '3ББ<br/>#amount',
        pot: 'Пот<br/>#amount',
        addtable: 'Добавить',
        sitout: 'Отошел',
        gameContinue: 'Пауза в турнире. Игра за столом продолжится #startTime#',
        totalpot: 'Банк: #amount',
        changeplace: 'Изменить место',
        doyouwantchangeplace: 'Вы действительно хотите сесть на это место?',
        lastHand: 'Пред. №: #id#',
        currentHand: 'Раздача №: #id#',
        bets: 'Ставки: #sb#/#bb#',
        betsWithAnte: 'Ставки: #sb#/#bb#, Анте: #ante#',
        conectionSlow: 'Медленное соединение',
        frozen: 'Игра за столом остановлена администрацией',
        tableClosed: 'Игра за столом завершена',
        turn: 'Ход',
        connectionError: 'Сбой подключения за столом \'#tableName#\'',
        observing: 'Режим наблюдения',
        askAdministratorToAddMoney: 'Вам необходимо пополнить ваш счет. Обратитесь к администратору',
        actiontext: {
            fold: 'Фолд',
            raise: 'Рейз',
            bet: 'Бет',
            check: 'Чек',
            call: 'Колл',
            allin: 'Олл-ин',
        },
        combination: {
            c1: 'Старшая; ##c1',
            c2: 'Пара (##c1); ##c2',
            c3: 'Две пары (##c1, ##c2); ##c3',
            c4: 'Тройка (##c1); ##c2',
            c5: 'Стрит (##c1)',
            c6: 'Флеш (##c1 ##c2 ##c3 ##c4 ##c5)',
            c7: 'Фулл-хаус (##c1, ##c2)',
            c8: 'Каре (##c1); ##c2',
            c9: 'Стрит-флеш (##c1)',
            c10: 'Флеш-рояль',
        },
    },
    tournament: {
        caption: 'Турнир',
        betLevelChanged1: 'В турнире \'#tournament#\' блайнды повышены: #sb#/#bb#',
        betLevelChanged2: 'В турнире \'#tournament#\' блайнды/анте повышены. #sb#/#bb#/#ante#',
        playerGameCompleted: 'Игра в турнире \'#tournament#\' завершена. Вы заняли #place#-е место',
        playerGameCompletedAndWin: 'Игра в турнире \'#tournament#\' завершена. Вы заняли #place#-е место и выиграли #win#',
        tableChanged: 'Вас пересадили за другой стол в турнире \'#tournament#\'',
        tournamentStarted: 'Турнир \'#tournament#\' начался',
        tournamentStartedNoOpen: 'Турнир \'#tournament#\' начался. Войдите в турнирное лобби, откройте ваш турнир, нажмите кнопку \'Играть / Наблюдать\'',
        tournamentCancelled: 'Турнир \'#tournament#\' отменен',
        tournamentCompleted: 'Турнир \'#tournament#\' завершен',
        tournaments: 'Турниры',
        areYouInFollowingTournaments: 'Вы играете в следующих турнирах.',
    },
    handhistory: {
        caption: 'История раздачи',
        shortMode: 'Кратко',
        detailedMode: 'Подробнее',

        nocardsopened: 'Карты не были открыты на столе',

        gamesstarted: '******* ИГРА №#gameId# *******',
        fold: 'Игрок #player# скинул карты',
        bet: 'Игрок #player# сделал бет и поставил #amount#',
        raise: 'Игрок #player# поднял до #amount#',
        check: 'Игрок #player# сделал чек',
        call: 'Игрок #player# сделал колл и заровнял до #amount#',
        allin: 'Игрок #player# пошел олл-ин #amount#',
        returnMoney: 'Игроку #player# вернулось #amount#',
        blind: 'Игроку #player# поставил блайнд #amount#',
        deadblind: 'Игроку #player# поставил штрафной блайнд #amount#',
        ante: 'Игроку #player# поставил анте #amount#',

        flop: '******* ФЛОП *******',
        turn: '******* ТЁРН *******',
        river: '******* РИВЕР *******',
        flopOpenCards: '#card1#, #card2#, #card3#',
        turnOpenCards: '#card4#',
        riverOpenCards: '#card5#',
        dealFinished: '******* ТОРГИ ОКОНЧЕНЫ *******',
        playerHoleOpened: 'Игрок #player# получил карты #card1#, #card2#',
        playerCardsOpened: 'Игрок #player# открыл карты #card1#, #card2#',

        potscollection: '******* СБОР СТАВОК *******',
        potcreated: 'Банк #pot# создан. #amount# в банке.',
        potupdated: 'Банк #pot# обновлен. #amount# в банке.',

        playerWin: 'Игрок #player# выиграл #amount#',
        rake: 'Собран рейк #amount#',
        gameFinished: '******* ИГРА №#gameId# ОКОНЧЕНА *******',
        potInfo: '****** ПОТ #pot# ******',

        suitClubs: 'трефы',
        suitDiamonds: 'бубны',
        suitHearts: 'червы',
        suitSpades: 'пики',

        cardsWasFolded: 'и скинул карты',
        hasFollowingCombination: 'с комбинацией #combination#',
        dontShowCards: 'и не показал карты',
    },
    accountStatus: {
        caption: 'Информация о счете',
        tableInfo: 'Стол: #name#',
        betInfo: 'Ставки: #sb#/#bb#',
        addMoney: 'Добавить фишки',
    },
    info: {
        pageListCaption: 'Информация',
        licenseAgreementCaption: 'Соглашение',
        licenseAgreement: 'Пользовательское соглашение',
        mobileSystemSupportCaption: 'Мобильные системы',
        mobileSystemSupport: 'Поддержка мобильных систем',
        accountBlockCaption: 'Блокировка',
        accountBlock: 'Блокировка учетной записи',
        privacyPolicyCaption: 'Конфиденциальность',
        privacyPolicy: 'Конфиденциальность',
        supportCaption: 'Поддержка игроков',
        support: 'Поддержка игроков',
        contactUsCaption: 'Связаться',
        contactUs: 'Связаться',
        howToPlayCaption: 'Как играть',
        howToPlay: 'Как играть',
        chatRulesCaption: 'Правила чата',
        chatRules: 'Правила чата',
        terminologyCaption: 'Обозначения',
        terminology: 'Условные обозначения',
        faqCaption: 'Вопросы',
        faq: 'Часто задаваемые вопросы',
    },
    contactUs: {
        contactUsTitle: 'Связаться',
        requestSent: 'Ваш запрос отправлен',
        fullName: 'Имя',
        email: 'Контактный email',
        subject: 'Тема сообщения',
        body: 'Подробное описание',
        send: 'Отправить',
    },
    tableMenu: {
        caption: 'Меню',
        addMoney: 'Добавить фишки',
        handHistory: 'История рук',
        accountBalance: 'Информация о счете',
        tournamentInformation: 'Информация о турнире',
        rebuy: 'Ребай',
        doublerebuy: 'Двойной ребай',
        addon: 'Аддон',
        soundEnabled: 'Звук',
        autoSwitchTables: 'Автоматическое переключение столов',
        autoHideCards: 'Автоматически скрывать карты',
        showInRating: 'Показывать в рейтинге',
        addonError: 'При совершении аддона произошла ошибка',
        rebuyError: 'При совершении ребая произошла ошибка',
        doublerebuyError: 'При совершении двойного ребая произошла ошибка',
        rebuySuccess: 'Ребай сделан успешно',
        doublerebuySuccess: 'Двойной ребай слелан успешно',
        addonSuccess: 'Аддон сделан успешно',
    },
    operationsHistory: {
        pageCaption: 'История счета',
        backButtonLabel: 'Счет',
        apply: 'Фильтр',
        filter: 'Фильтр',
        from: 'c',
        to: 'по',
        status: 'Статус',
        amount: 'Сумма',
        type: 'Операция',
        date: 'Дата',
        op0: 'Ожидает',
        op1: 'Депозит',
        op2: 'Снятие',
        op3: 'Выигрыш',
        op4: 'Проигрыш',
        op5: '--',
        op6: '--',
        op7: 'Пополнение - ',
        op8: 'Списание - ',
        op9: '--',
        op10: '--',
        op11: 'Авт. доб. фишек',
        op12: 'Выигрыш в турнире',
        op13: 'Рег. в турнире',
        op14: 'Отм. рег. в турнире',
        op15: 'Пополнение стека',
        op16: 'Покинул стол',
        op17: 'Ребай',
        op18: 'Аддон',
        op19: 'Перевод',
        op20: 'Получение фишек',
    },
    more: {
        accountInfo: 'Аккаунт и баланс',
        rating: 'Рейтинг',
        chat: 'Чат',
        information: 'Информация',
        contactUs: 'Связаться с нами',
        exit: 'Выйти',
        login: 'Вход',
        messages: 'Сообщения',
        playerId: 'ID игрока',
        playerAccount: 'Счет игрока',
        points: 'Поинты',
        registration: 'Регистрация',
    },
    rating: {
        caption: 'Рейтинг',
    },
    chat: {
        caption: 'Чат',
        tableCaption: 'Чат',
        send: 'Отправить',
        sendingMessage: 'Отправка сообщений',
        sendingMessageGenericError: 'Ошибка отправки сообщений',
    },
    account: {
        caption: 'Учетная запись',
        personalData: 'Персональные данные',
        username: 'Имя пользователя',
        firstName: 'Имя',
        lastName: 'Фамилия',
        email: 'E-mail',
        total: 'Состояние счета',
        changePassword: 'Сменить пароль',
        points: 'Очки (PR)',
        lastmonth: 'Месяц',
        lastyear: 'Год',
        status: 'Статус',
        tournamentStatus: 'Турнирные достижения',
        statusName: {
            status0: 'Нет',
            status1: 'Бронза',
            status2: 'Серебро',
            status3: 'Золото',
            status4: 'Платина',
        }
    },
    joinTable: {
        caption: 'Взять стек',
        tableName: 'Стол:',
        bets: 'Ставки:',
        accountTotal: 'Всего на вашем счету:',
        minBuyin: 'Мин. взнос:',
        maxBuyin: 'Макс. взнос:',
        buyInAmount: 'Вносимая сумма:',
        putMoreMoney: 'Нельзя внести меньше чем минимум',
        putLessMoney: 'Нельзя внести больше чем максимум',
        joinError: 'Сбой подключения',
        writeTicketCode: 'Введите номер чека',
    },
    addMoney: {
        caption: 'Пополнить стек',
        tableName: 'Стол:',
        bets: 'Ставки:',
        accountTotal: 'Сумма на счету:',
        minBuyin: 'Мин. бай-ин:',
        maxBuyin: 'Макс. бай-ин:',
        buyInAmount: 'Сумма:',
        putMoreMoney: 'Нельзя внести больше чем минимум',
        putLessMoney: 'Нельзя внести больше чем максимум',
        success: 'Фишки успено добавлены на счет игрока',
        joinError: 'Ошибка пополнения',
        insufficientFunds: 'Недостаточно фишек на счету',
        couldnotAddMoreThenMax: 'Нельзя иметь больше фишек чем максимум',
    },
    selectAvatar: {
        caption: 'Выберите аватарку',
    },
    connection: {
        retry: 'Повторить',
        slow: 'Соединение было прервано. Идет попытка восстановления.',
        reconnectfailed: 'Не удается подключиться к серверу.',
        noconnection: 'Соединение отсутствует.',
        connectionpresent: 'Соединение с сервером установлено.',
        caption1: 'Соединение.',
        caption2: 'Соединение..',
        caption3: 'Соединение...',
        caption0: 'Соединение',
        reconnect: 'Подключиться',
        duplicateconnectiondetected: 'Произошел сбой подключения. Вам необходимо перегрузится, во избежании разрыва связи.',
        reestablishConnection: 'Переподключиться',
    },
    maxtables: {
        caption: 'Столы',
        maxtablesreached: 'Вами открыто максимальное количество столов. Для того, чтобы открыть новый стол, закройте один из открытых столов.',
    },
    tabbar: {
        home: 'Главная',
        lobby: 'Лобби',
        tables: 'Столы',
        cashier: 'Аккаунт',
        more: 'Еще',
    },
    errors: {
        AuthorizationError: 'Ошибка авторизации',
        NotSufficiendFunds: 'Недостаточно фишек',
        OperationNotValidAtThisTime: 'Операция недоступна в данное время',
        OperationNotAllowed: 'Операция недоступна',
        IpAddressIsBlockForGame: 'IP адрес уже зарегистрирован',
        PlayerAlreadyFinishTournamentGame: 'Игрок уже закончил турнир',
        AccountBlocked: 'Игрок заблокирован',
        UserNotFound: 'Пользователь не найден',
        OldPasswordDoesNotMatch: 'Старый пароль не совпадает',
        AccountActivationFailed: 'Ошибка активации учетной записи',
        TokenNotFound: 'Неверный токен',
        IpAddressAlreadyUsed: 'IP адрес уже играет',
        RegistrationInTournamentCompleted: 'Регистрация в турнире завершена',
        TournamentNotExists: 'Турнир не существует',
        AmountTooLow: 'Введите большую сумму',
        PlayerAlreadySit: 'Игрок уже сидит за столом',
        TableNotFound: 'Стол не найден',
        SeatAlreadyTaken: 'Место уже занято',
        InvalidSeatNumber: 'Место не существует',
        PlayerDoesNotSit: 'Игрок не может сесть',
        AccountChatBlocked: 'Чат заблокирован',
        LoginAlreadyUsed: 'Логин уже существует',
        EmailAlreadyUsed: 'Email уже используется',
        NoGameOnTable: 'За столом нет игры',
        PlayerNotInGame: 'Игрок не участвует в игре',
        InternalFaliure: 'Внутренняя ошибка при выполнении операции',
        MessageNotFound: 'Сообщение не найдено',
        SendMailFailure: 'Ошибка отправки email',
        MaxTournamentPlayersReached: 'В турнире уже зарегистрированно максимальное количество игроков',
        PlayerAlreadyRegisteredInTournament: 'Игрок уже зарегистрирован в турнире',
        RegistrationInTournamentNotStarted: 'Регистрация в турнире еще не началась',
        InvalidAmount: "Неверно указанная сумма",
        RequiredParameterIsMissing: "Обязательный параметр не указан",
        InvalidTicket: "Неправильный номер билета",
        TicketAlreadyUsed: "Билет уже использован",
    }
};

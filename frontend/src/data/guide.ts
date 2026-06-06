import { GuidePhaseData } from '../types'

export const GUIDE_PHASES: GuidePhaseData[] = [
  // ═══════════════════════════════════════════════════════════
  // PHASE 1 — ПОДГОТОВКА
  // ═══════════════════════════════════════════════════════════
  {
    id: 1,
    name: 'Подготовка',
    icon: '📁',
    steps: [
      {
        id: 'prepare-files',
        icon: '🗂',
        title: 'Подготовьте файлы сайта',
        subtitle: 'Убедитесь, что папка готова к загрузке',
        blocks: [
          { type: 'para', text: 'В корне вашей папки должен находиться файл index.html — это главная страница. Остальное зависит от типа сайта:' },
          { type: 'h3', text: 'Обычный HTML / CSS / JS — готово!' },
          { type: 'para', text: 'Берите папку как есть. Убедитесь что index.html в самом корне, а не во вложенной папке.' },
          { type: 'h3', text: 'React / Vue / Next.js — нужна сборка' },
          { type: 'para', text: 'Откройте терминал в папке проекта и выполните:' },
          { type: 'code', text: 'npm run build' },
          { type: 'para', text: 'Загружать нужно именно папку dist/ или build/ (она появится после сборки), а не весь исходный код.' },
          { type: 'h3', text: 'WordPress / CMS' },
          { type: 'para', text: 'Для WordPress лучше использовать автоустановщик прямо на хостинге (есть у всех крупных провайдеров) или плагин All-in-One WP Migration для переноса.' },
          { type: 'tip', text: 'Проверьте сайт локально: откройте index.html в браузере двойным кликом. Должен открыться без ошибок.' },
        ],
        links: [
          { label: 'Vite — production build', url: 'https://vitejs.dev/guide/build.html', note: 'React / Vue / Svelte' },
          { label: 'Next.js deployment', url: 'https://nextjs.org/docs/app/building-your-application/deploying', note: 'Next.js' },
          { label: 'All-in-One WP Migration', url: 'https://wordpress.org/plugins/all-in-one-wp-migration/', note: 'WordPress' },
        ],
        checkItems: [
          { id: 'has-folder', text: 'Папка с файлами сайта готова' },
          { id: 'has-index', text: 'Файл index.html находится в корне папки' },
          { id: 'built', text: 'Если фреймворк (React / Vue) — выполнен npm run build' },
        ],
      },
      {
        id: 'choose-hosting',
        icon: '🖥',
        title: 'Выберите способ размещения',
        subtitle: 'От этого зависят дальнейшие шаги',
        isHostingChoice: true,
        blocks: [
          { type: 'para', text: 'Есть три основных варианта. Выберите подходящий — шаги адаптируются под ваш выбор.' },
        ],
        checkItems: [
          { id: 'hosting-chosen', text: 'Способ размещения выбран' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // PHASE 2 — РЕГИСТРАЦИЯ
  // ═══════════════════════════════════════════════════════════
  {
    id: 2,
    name: 'Хостинг',
    icon: '🔧',
    steps: [
      {
        id: 'setup-hosting',
        icon: '⚙️',
        title: 'Регистрация и настройка хостинга',
        subtitle: 'Получаем место для вашего сайта',
        blocks: [
          // ─── SHARED ───────────────────────────────────────
          { type: 'h3', text: 'Shared Hosting — Hostinger', forHosting: ['shared'] },
          { type: 'para', text: 'Hostinger — один из лучших вариантов по соотношению цены и качества. Есть русский язык.', forHosting: ['shared'] },
          { type: 'list', forHosting: ['shared'], items: [
            'Идём на hostinger.ru',
            'Нажимаем «Управляемый хостинг» → выбираем тариф Premium (несколько сайтов + email) или Business',
            'Регистрируемся / входим → оплачиваем (обычно есть скидка 75–85% на первый год)',
            'После оплаты получаем доступ к hPanel — панели управления хостингом',
          ]},
          { type: 'info', text: 'Цены: от $2.49/мес (при оплате за 4 года) или ~$11/мес (ежемесячно). Для начала подойдёт тариф Premium.', forHosting: ['shared'] },
          // ─── VPS ──────────────────────────────────────────
          { type: 'h3', text: 'VPS — выбираем провайдера', forHosting: ['vps'] },
          { type: 'para', text: 'VPS (Virtual Private Server) — ваш личный виртуальный сервер. Больше свободы, но требует базовых знаний Linux.', forHosting: ['vps'] },
          { type: 'list', forHosting: ['vps'], items: [
            'Hostinger VPS — удобная панель, от $4.99/мес, хороший вариант для старта',
            'DigitalOcean (droplets) — от $6/мес, популярен у разработчиков',
            'Hetzner Cloud — очень дёшево, отличные серверы, от €3.29/мес',
            'Timeweb Cloud — русскоязычный, от 300 руб/мес',
          ]},
          { type: 'para', text: 'При создании VPS выбирайте Ubuntu 22.04 LTS. Вы получите IP-адрес, логин root и пароль.', forHosting: ['vps'] },
          { type: 'para', text: 'Подключитесь по SSH и установите Nginx:', forHosting: ['vps'] },
          { type: 'code', text: 'ssh root@ВАШ_IP_АДРЕС\napt update && apt install nginx -y\nsystemctl enable nginx && systemctl start nginx', forHosting: ['vps'] },
          { type: 'tip', text: 'Для подключения по SSH на Windows используйте встроенный терминал (Win+X → Terminal) или PuTTY.', forHosting: ['vps'] },
          // ─── CLOUD ────────────────────────────────────────
          { type: 'h3', text: 'Vercel / Netlify — бесплатно!', forHosting: ['cloud'] },
          { type: 'para', text: 'Идеальный вариант для статических сайтов и React/Next.js приложений. Бесплатно для личных проектов.', forHosting: ['cloud'] },
          { type: 'list', forHosting: ['cloud'], items: [
            'Vercel: идём на vercel.com → Sign Up через GitHub (рекомендуется)',
            'Netlify: идём на netlify.com → Sign up → Continue with GitHub',
            'После регистрации нажимаем "New Project" / "Add new site"',
            'Если ваш код на GitHub — подключаем репозиторий. Каждый git push = автодеплой',
            'Если нет репозитория — Netlify позволяет просто перетащить папку dist/',
          ]},
          { type: 'info', text: 'Vercel и Netlify дают бесплатный SSL, глобальный CDN, и автоматический деплой при каждом git push. Идеально для начала!', forHosting: ['cloud'] },
        ],
        links: [
          { label: 'Hostinger', url: 'https://www.hostinger.ru', note: 'Shared Hosting' },
          { label: 'Hetzner Cloud', url: 'https://www.hetzner.com/cloud', note: 'VPS' },
          { label: 'DigitalOcean', url: 'https://www.digitalocean.com', note: 'VPS' },
          { label: 'Vercel', url: 'https://vercel.com', note: 'Cloud (бесплатно)' },
          { label: 'Netlify', url: 'https://www.netlify.com', note: 'Cloud (бесплатно)' },
        ],
        checkItems: [
          { id: 'account-created', text: 'Аккаунт создан на хостинге' },
          { id: 'plan-paid', text: 'Тариф выбран и оплачен', forHosting: ['shared'] },
          { id: 'hpanel-access', text: 'Есть доступ к панели управления (hPanel)', forHosting: ['shared'] },
          { id: 'vps-created', text: 'VPS создан, получен IP-адрес', forHosting: ['vps'] },
          { id: 'ssh-connected', text: 'Подключились по SSH к серверу', forHosting: ['vps'] },
          { id: 'nginx-installed', text: 'Установлен и запущен Nginx', forHosting: ['vps'] },
          { id: 'project-connected', text: 'Проект подключён к Vercel / Netlify', forHosting: ['cloud'] },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // PHASE 3 — ДОМЕН
  // ═══════════════════════════════════════════════════════════
  {
    id: 3,
    name: 'Домен',
    icon: '🌐',
    steps: [
      {
        id: 'register-domain',
        icon: '🔖',
        title: 'Зарегистрируйте домен',
        subtitle: 'Адрес вашего сайта в интернете',
        blocks: [
          { type: 'para', text: 'Домен — это адрес сайта: example.com, myshop.ru, portfolio.dev. Без домена сайт доступен только по IP-адресу (некрасиво и неудобно).' },
          { type: 'h3', text: 'Выбор зоны (расширения)' },
          { type: 'list', items: [
            '.com — самый распространённый, $8–12/год',
            '.ru / .рф — для российской аудитории, 150–400 руб/год',
            '.io / .dev / .app — популярны у разработчиков, $25–50/год',
            '.online / .site / .store — дёшевые альтернативы, от $3/год',
          ]},
          { type: 'h3', text: 'Где покупать' },
          { type: 'list', items: [
            'Hostinger — удобно если хостинг там же: DNS настроится автоматически. От $8.99/год.',
            'Namecheap — дешёвые .com домены, хороший интерфейс. От $6.99/год.',
            'Cloudflare Registrar — по себестоимости без наценки (нужна карта). От $8.03/год.',
            'RU-CENTER / Reg.ru — лучший выбор для .ru, .рф. От 150 руб/год.',
          ]},
          { type: 'tip', text: 'Берите домен там же, где хостинг — DNS настроится автоматически, не нужно разбираться с NS-записями.' },
          { type: 'warn', text: 'Не используйте домены от перекупщиков. Покупайте только у аккредитованных регистраторов (Hostinger, Namecheap, Reg.ru).' },
        ],
        links: [
          { label: 'Namecheap', url: 'https://www.namecheap.com', note: 'Дёшевые .com' },
          { label: 'Cloudflare Registrar', url: 'https://www.cloudflare.com/products/registrar/', note: 'По себестоимости' },
          { label: 'Reg.ru', url: 'https://www.reg.ru', note: '.ru / .рф домены' },
          { label: 'Hostinger Domains', url: 'https://www.hostinger.ru/регистрация-доменного-имени', note: 'С хостингом вместе' },
        ],
        checkItems: [
          { id: 'domain-chosen', text: 'Придумали название домена' },
          { id: 'domain-bought', text: 'Домен зарегистрирован' },
          { id: 'domain-login', text: 'Сохранили логин и пароль от аккаунта регистратора' },
        ],
      },
      {
        id: 'connect-domain',
        icon: '🔗',
        title: 'Привяжите домен к хостингу',
        subtitle: 'Указываем, где находится ваш сайт',
        blocks: [
          { type: 'para', text: 'Нужно "сказать" домену — какой сервер обслуживает ваш сайт. Это делается через DNS-записи. После изменений DNS обновляется 30 минут — 48 часов.' },
          { type: 'h3', text: 'Вариант 1: домен и хостинг в одном месте — ничего делать!' },
          { type: 'para', text: 'Если вы купили домен и хостинг у одного провайдера (например оба на Hostinger) — DNS настроится автоматически. Просто добавьте домен в hPanel → Домены → Добавить домен.' },
          { type: 'h3', text: 'Вариант 2: смените NS-записи (NameServer)' },
          { type: 'para', text: 'Зайдите в аккаунт регистратора домена (Namecheap, Reg.ru и т.д.) → DNS Management → замените NS-записи на NS вашего хостинга:' },
          { type: 'code', text: '# Hostinger:\nns1.dns-parking.com\nns2.dns-parking.com\n\n# Beget:\nns1.beget.com\nns2.beget.com\n\n# Timeweb:\nns1.timeweb.ru\nns2.timeweb.ru' },
          { type: 'h3', text: 'Вариант 3: A-запись (для VPS)' },
          { type: 'para', text: 'В DNS-настройках домена добавьте:' },
          { type: 'list', items: [
            'Тип: A',
            'Имя / Host: @ (это означает корневой домен)',
            'Значение / Value: IP-адрес вашего сервера',
            'TTL: 3600 (или Auto)',
          ]},
          { type: 'warn', text: 'Ждите! DNS обновляется от 30 минут до 48 часов. Это нормально, торопить нельзя.' },
          { type: 'tip', text: 'Проверить обновление DNS можно на сайте dnschecker.org — введите ваш домен и проверьте A-запись.' },
        ],
        links: [
          { label: 'DNSChecker.org', url: 'https://dnschecker.org', note: 'Проверить DNS' },
          { label: 'WhatIsMyIP DNS Lookup', url: 'https://www.whatismydns.net', note: 'Мировое распространение' },
        ],
        checkItems: [
          { id: 'dns-configured', text: 'DNS-записи настроены (NS или A-запись)' },
          { id: 'dns-propagated', text: 'Подождали обновления DNS (30мин–48ч)' },
          { id: 'domain-in-hosting', text: 'Домен добавлен в панель хостинга' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // PHASE 4 — ЗАГРУЗКА ФАЙЛОВ
  // ═══════════════════════════════════════════════════════════
  {
    id: 4,
    name: 'Загрузка',
    icon: '⬆️',
    steps: [
      {
        id: 'cicd-setup',
        icon: '🤖',
        title: 'Автодеплой (необязательно)',
        subtitle: 'GitHub Actions — деплой при каждом git push',
        blocks: [
          { type: 'para', text: 'Если ваш код на GitHub, можно настроить автоматический деплой: делаете git push — сайт обновляется сам. Это CI/CD (Continuous Deployment).' },
          // ─── CLOUD ─────────────────────────────────────────
          { type: 'h3', text: 'Vercel / Netlify — уже готово!', forHosting: ['cloud'] },
          { type: 'info', text: 'Если вы подключили репозиторий к Vercel или Netlify — автодеплой уже настроен. Каждый git push в main = новый деплой. Ничего настраивать не нужно.', forHosting: ['cloud'] },
          // ─── SHARED ────────────────────────────────────────
          { type: 'h3', text: 'Shared Hosting — деплой через FTP', forHosting: ['shared'] },
          { type: 'para', text: 'Создайте файл .github/workflows/deploy.yml в репозитории:', forHosting: ['shared'] },
          { type: 'code', forHosting: ['shared'], text: `name: Deploy to Hostinger
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm install && npm run build
      - name: Upload via FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: \${{ secrets.FTP_HOST }}
          username: \${{ secrets.FTP_USER }}
          password: \${{ secrets.FTP_PASS }}
          local-dir: ./dist/
          server-dir: /public_html/` },
          { type: 'tip', text: 'Добавьте FTP_HOST, FTP_USER, FTP_PASS в GitHub → Settings → Secrets and variables → Actions.', forHosting: ['shared'] },
          // ─── VPS ───────────────────────────────────────────
          { type: 'h3', text: 'VPS — деплой через SSH', forHosting: ['vps'] },
          { type: 'para', text: 'Создайте файл .github/workflows/deploy.yml:', forHosting: ['vps'] },
          { type: 'code', forHosting: ['vps'], text: `name: Deploy to VPS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm install && npm run build
      - name: Copy files to VPS
        uses: appleboy/scp-action@v0.1.7
        with:
          host: \${{ secrets.VPS_HOST }}
          username: root
          key: \${{ secrets.VPS_SSH_KEY }}
          source: "dist/*"
          target: /var/www/html` },
          { type: 'tip', text: 'Добавьте VPS_HOST и VPS_SSH_KEY в GitHub Secrets. SSH-ключ: ssh-keygen -t ed25519, публичный ключ → /root/.ssh/authorized_keys на сервере.', forHosting: ['vps'] },
        ],
        links: [
          { label: 'GitHub Actions Docs', url: 'https://docs.github.com/actions', note: 'Документация' },
          { label: 'FTP Deploy Action', url: 'https://github.com/SamKirkland/FTP-Deploy-Action', note: 'для Shared' },
          { label: 'SCP Action', url: 'https://github.com/appleboy/scp-action', note: 'для VPS' },
        ],
        checkItems: [
          { id: 'cicd-optional', text: 'CI/CD настроен (или пропускаем — загружаем вручную)' },
        ],
      },
      {
        id: 'nginx-config',
        icon: '⚙️',
        title: 'Конфиг Nginx для VPS',
        subtitle: 'Правильная настройка веб-сервера',
        blocks: [
          { type: 'h3', text: 'Базовый конфиг для статического сайта', forHosting: ['vps'] },
          { type: 'code', forHosting: ['vps'], text: `# /etc/nginx/sites-available/mysite.conf
server {
    listen 80;
    server_name example.com www.example.com;
    root /var/www/html;
    index index.html;

    # SPA — все маршруты на index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кэширование статики
    location ~* \\.(js|css|png|jpg|svg|ico|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip сжатие
    gzip on;
    gzip_types text/plain text/css application/json
               application/javascript text/xml;
}` },
          { type: 'code', forHosting: ['vps'], text: `# Активировать конфиг:
ln -s /etc/nginx/sites-available/mysite.conf /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx` },
          { type: 'tip', text: 'После установки SSL через certbot конфиг обновится автоматически — certbot сам добавит блок server для 443.', forHosting: ['vps'] },
          { type: 'para', text: 'Это общий раздел — используйте кнопку "Копировать" выше. Если ваш хостинг не VPS — этот шаг пропустите.', forHosting: ['shared', 'cloud'] },
        ],
        checkItems: [
          { id: 'nginx-configured', text: 'Nginx настроен и перезапущен', forHosting: ['vps'] },
          { id: 'nginx-skip', text: 'Этот шаг не нужен (не VPS)', forHosting: ['shared', 'cloud'] },
        ],
      },
      {
        id: 'upload-files',
        icon: '📤',
        title: 'Загрузите файлы на сервер',
        subtitle: 'Помещаем сайт в публичную папку',
        blocks: [
          // ─── SHARED ───────────────────────────────────────
          { type: 'h3', text: 'Hostinger — File Manager', forHosting: ['shared'] },
          { type: 'list', forHosting: ['shared'], items: [
            'Открываем hPanel → раздел "Файлы" → File Manager',
            'Входим в папку public_html — это корень вашего сайта',
            'Удаляем стандартные файлы: index.php, phpinfo.php (если есть)',
            'Нажимаем "Upload" → выбираем все файлы и папки вашего сайта',
            'Или: загружаем ZIP-архив → правый клик → Extract (распаковать)',
          ]},
          { type: 'warn', text: 'index.html должен лежать прямо в public_html, а не в public_html/мойсайт/index.html! Иначе сайт не откроется.', forHosting: ['shared'] },
          { type: 'para', text: 'Альтернатива — FTP-клиент FileZilla (более удобен для больших файлов):', forHosting: ['shared'] },
          { type: 'code', text: '# Данные для FileZilla:\n# Host: ваш домен или IP из hPanel\n# Port: 21\n# Protocol: FTP\n# Логин и пароль из раздела FTP в hPanel', forHosting: ['shared'] },
          // ─── VPS ──────────────────────────────────────────
          { type: 'h3', text: 'VPS — SFTP через FileZilla', forHosting: ['vps'] },
          { type: 'list', forHosting: ['vps'], items: [
            'Скачайте FileZilla с filezilla-project.org (бесплатно)',
            'File → Site Manager → New Site',
            'Protocol: SFTP, Host: ВАШ_IP, Port: 22',
            'Logon Type: Normal, User: root, Password: ВАШ_ПАРОЛЬ',
            'Нажимаем Connect → перетаскиваем файлы в /var/www/html/',
          ]},
          { type: 'code', text: '# Или через SCP из терминала:\nscp -r ./dist/* root@ВАШ_IP:/var/www/html/', forHosting: ['vps'] },
          { type: 'para', text: 'Убедитесь что Nginx настроен правильно:', forHosting: ['vps'] },
          { type: 'code', text: '# Проверить конфиг Nginx:\ncat /etc/nginx/sites-available/default\n# Должна быть строка: root /var/www/html;\nnginx -t && systemctl reload nginx', forHosting: ['vps'] },
          // ─── CLOUD ────────────────────────────────────────
          { type: 'h3', text: 'Vercel / Netlify — деплой', forHosting: ['cloud'] },
          { type: 'list', forHosting: ['cloud'], items: [
            'Vercel (с GitHub): git add . && git commit -m "deploy" && git push → автодеплой!',
            'Netlify Drop: перетащите папку dist/ на сайт drop.netlify.com в браузере',
            'Netlify CLI: npm install -g netlify-cli && netlify deploy --prod --dir dist',
          ]},
          { type: 'tip', text: 'Vercel/Netlify после деплоя сразу дают временный URL типа myproject.vercel.app — можно проверить сайт до подключения домена.', forHosting: ['cloud'] },
        ],
        links: [
          { label: 'FileZilla', url: 'https://filezilla-project.org', note: 'FTP / SFTP клиент' },
          { label: 'Netlify Drop', url: 'https://app.netlify.com/drop', note: 'Drag & drop деплой' },
        ],
        checkItems: [
          { id: 'files-uploaded-shared', text: 'Файлы загружены в public_html', forHosting: ['shared'] },
          { id: 'index-in-root-shared', text: 'index.html находится прямо в public_html (не в подпапке)', forHosting: ['shared'] },
          { id: 'files-uploaded-vps', text: 'Файлы загружены в /var/www/html/', forHosting: ['vps'] },
          { id: 'nginx-reloaded', text: 'Nginx перезагружен (nginx -t && systemctl reload nginx)', forHosting: ['vps'] },
          { id: 'cloud-deployed', text: 'Деплой успешно завершён (виден в дашборде)', forHosting: ['cloud'] },
          { id: 'site-opens', text: 'Сайт открывается по домену или временному URL' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // PHASE 5 — SSL
  // ═══════════════════════════════════════════════════════════
  {
    id: 5,
    name: 'SSL',
    icon: '🔒',
    steps: [
      {
        id: 'setup-ssl',
        icon: '🔐',
        title: 'Установите SSL-сертификат',
        subtitle: 'HTTPS — обязателен для современного сайта',
        blocks: [
          { type: 'para', text: 'SSL-сертификат нужен для HTTPS — зашифрованного соединения. Без него браузер показывает "Небезопасно" и пользователи уходят. Влияет на SEO.' },
          // ─── SHARED ───────────────────────────────────────
          { type: 'h3', text: 'Hostinger — один клик', forHosting: ['shared'] },
          { type: 'list', forHosting: ['shared'], items: [
            'hPanel → раздел SSL → нажимаем "Установить" под Let\'s Encrypt',
            'Выбираем домен → Установить',
            'Ждём 1–5 минут — сертификат установлен!',
            'Включаем "Force HTTPS": hPanel → SSL → Force HTTPS',
          ]},
          { type: 'tip', text: 'Let\'s Encrypt полностью бесплатен и автоматически обновляется каждые 90 дней.', forHosting: ['shared'] },
          // ─── VPS ──────────────────────────────────────────
          { type: 'h3', text: 'VPS — Certbot + Let\'s Encrypt', forHosting: ['vps'] },
          { type: 'para', text: 'Убедитесь что домен уже указывает на IP вашего VPS, затем:' , forHosting: ['vps'] },
          { type: 'code', text: 'apt install certbot python3-certbot-nginx -y\ncertbot --nginx -d ВАШ_ДОМЕН.com -d www.ВАШ_ДОМЕН.com', forHosting: ['vps'] },
          { type: 'para', text: 'Certbot автоматически настроит HTTPS и редирект. Для автопродления:' , forHosting: ['vps'] },
          { type: 'code', text: 'certbot renew --dry-run  # проверка автопродления\n# Автопродление настраивается через cron автоматически', forHosting: ['vps'] },
          // ─── CLOUD ────────────────────────────────────────
          { type: 'h3', text: 'Vercel / Netlify — автоматически!', forHosting: ['cloud'] },
          { type: 'info', text: 'На Vercel и Netlify SSL устанавливается автоматически при подключении домена. Ничего делать не нужно.', forHosting: ['cloud'] },
          { type: 'tip', text: 'После установки SSL и Force HTTPS — включите HSTS в настройках сервера для максимальной безопасности.' },
        ],
        checkItems: [
          { id: 'ssl-installed', text: 'SSL-сертификат установлен' },
          { id: 'https-forced', text: 'Включён редирект HTTP → HTTPS (Force HTTPS)' },
          { id: 'site-opens-https', text: 'Сайт открывается по https:// без предупреждений' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // PHASE 6 — ПРОВЕРКИ
  // ═══════════════════════════════════════════════════════════
  {
    id: 6,
    name: 'Проверка',
    icon: '✅',
    steps: [
      {
        id: 'auto-checks',
        icon: '🔍',
        title: 'Автоматическая проверка сайта',
        subtitle: 'Проверяем DNS, SSL, скорость и безопасность',
        blocks: [
          { type: 'para', text: 'Введите домен — сервис автоматически проверит все ключевые параметры и покажет что нужно исправить.' },
        ],
        checkItems: [],
      },
    ],
  },
]

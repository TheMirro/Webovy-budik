// Třída reprezentující jednotlivé budíky
class Alarm {
    constructor(id, name, time, enabled = true) {
        this.id = id; // Unikátní identifikátor budíku
        this.name = name; // Název budíku
        this.time = time; // Nastavený čas budíku (HH:MM formát)
        this.enabled = enabled; // Stav budíku (zapnuto/vypnuto)
    }
}

// Třída zodpovědná za generování HTML pro budíky
class AlarmRenderer {
    static toHTML(alarm, index) {
        return `
            <li>
                <div class="alarm-switch">
                    <label class="switch">
                        <input type="checkbox" ${alarm.enabled ? 'checked' : ''} onchange="app.toggleAlarm(${index})">
                        <span class="slider ${alarm.enabled ? 'enabled' : 'disabled'}"></span>
                    </label>
                </div>
                <span>${alarm.name} (${alarm.time})</span>
                <div class="alarm-actions">
                    <button onclick="app.deleteAlarm(${index})">Smazat</button>
                </div>
            </li>
        `;
    }
}

// Pomocná třída pro práci s DOM (objektovým modelem dokumentu)
class UIHelper {
    // Nastaví text konkrétnímu HTML elementu podle ID
    static setElementText(id, text) {
        document.getElementById(id).textContent = text;
    }

    // Přepíná zobrazení HTML elementu (viditelný/skrytý)
    static toggleDisplay(id, shouldDisplay) {
        document.getElementById(id).style.display = shouldDisplay ? 'block' : 'none';
    }
}

// Hlavní třída aplikace, správa budíků a interakce s uživatelem.
class AlarmApp {
    constructor() {
        this.currentUser = null; // Jméno aktuálně přihlášeného uživatele
        this.alarms = {}; // Pole instancí Alarm (reprezentující všechny budíky)
        this.storage = localStorage; // Uložiště (výchozí je localStorage)
        this.init(); // Inicializace aplikace
    }

    // Inicializace aplikace (nastavení event listenerů a spuštění kontrol budíků)
    init() {
        document.getElementById('login-btn').addEventListener('click', () => this.login());
        document.getElementById('guest-btn').addEventListener('click', () => this.guest());
        document.getElementById('add-alarm-btn').addEventListener('click', () => this.addAlarm());
        setInterval(() => this.checkAlarms(), 60000); // Kontrola budíků každou minutu
    }

    // Přihlášení uživatele
    login() {
        const username = document.getElementById('username').value.trim();
        if (!username) return alert('Zadejte platné uživatelské jméno.');

        this.currentUser = username;
        this.storage = localStorage; // Nastavení uložiště na localStorage
        this.storage.setItem('username', username);

        // Přepnutí na hlavní obrazovku
        UIHelper.toggleDisplay('login-screen', false);
        UIHelper.toggleDisplay('main-screen', true);
        UIHelper.setElementText('welcome-user', username);

        this.loadAlarms();
    }

    // Režim hosta (používá sessionStorage)
    guest() {
        this.currentUser = 'Host';
        this.storage = sessionStorage; // Nastavení uložiště na sessionStorage
        this.storage.clear(); // Vymazaní dat z localStorage při obnovení stránky

        // Přepnutí na hlavní obrazovku
        UIHelper.toggleDisplay('login-screen', false);
        UIHelper.toggleDisplay('main-screen', true);
        UIHelper.setElementText('welcome-user', 'Host');

        this.loadAlarms();
    }

    // Načtení budíků z uložiště
    loadAlarms() {
        const savedAlarms = JSON.parse(this.storage.getItem('alarms')) || []; // Načtení uložených budíků
        this.alarms = savedAlarms.map(a => new Alarm(a.id, a.name, a.time, a.enabled)); // Obnovení instanci Alarm
        this.renderAlarms(); // Aktualizace zobrazení budíků
    }

    // Uložení budíků do uložiště
    saveAlarms() {
        this.storage.setItem('alarms', JSON.stringify(this.alarms));
    }

    // Přepnutí stavu budíku (zapnuto/vypnuto)
    toggleAlarm(index) {
        this.alarms[index].enabled = !this.alarms[index].enabled; // Přepnutí stavu
        this.saveAlarms(); // Uložení budíku
        this.renderAlarms(); // Aktualizace zobrazení budíků
    }

    // Vykreslení budíků do HTML
    renderAlarms() {
        const alarmList = document.getElementById('alarm-list');
        alarmList.innerHTML = ''; // Vyčištění seznamu budíků
        this.alarms.forEach((alarm, index) => {
            alarmList.innerHTML += AlarmRenderer.toHTML(alarm, index); // Přidání HTML budíku
        });
    }

    // Přidání nového budíku
    addAlarm() {
        const time = document.getElementById('alarm-time').value; // Načtení čas
        const name = document.getElementById('alarm-name').value.trim() || `Budík${this.alarms.length + 1}`; // Výchozí název budíku

        if (!time) return alert('Zadejte čas budíku.'); // Validace času

        const newAlarm = new Alarm(Date.now(), name, time); // Vytvoří nový budík
        this.alarms.push(newAlarm); // Přidání budíku do pole
        this.saveAlarms(); // Uložení budíku
        this.renderAlarms(); // Aktualizace zobrazení budíků
        // Vymazání vstupního pole
        document.getElementById('alarm-time').value = '';
        document.getElementById('alarm-name').value = '';
    }

    // Smazání budíku podle indexu
    deleteAlarm(index) {
        this.alarms.splice(index, 1); // Odstranění budíku
        this.saveAlarms(); // Uložení budíku
        this.renderAlarms(); // Aktualizace zobrazení budíků
    }

    // Pravidelná kontrola budíků a spuštění notifikací
    checkAlarms() {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`; // Aktuální čas ve formátu HH:MM

        this.alarms.forEach(alarm => {
            if (alarm.enabled && alarm.time === currentTime) {
                this.notifyAlarm(alarm); // Spuštění notifikaci budíku
            }
        });
    }

    // Spustí zvuk a zobrazí modal s informací o budíku
    notifyAlarm(alarm) {
        const alarmSound = document.getElementById('alarm-sound'); // Načtení zvuku pro budík
        alarmSound.loop = true;
        alarmSound.volume = 0.05; // Nastavení hlasitosti (které dost možná nefunguje :D)
        alarmSound.play(); // Spuštění zvuku

        // Zobrazení modalu s informacemi o budíku
        const modal = document.getElementById('alarm-modal');
        const alarmMessage = document.getElementById('alarm-message');
        alarmMessage.textContent = `Budík (${alarm.name}) nastavený na ${alarm.time} se spustil!`;
        const closeModal = document.getElementById('close-modal');

        modal.style.display = 'block';

        // Zavření modalu a zastavení zvuku
        closeModal.onclick = function() {
            modal.style.display = 'none';
            alarmSound.pause();
            alarmSound.currentTime = 0;
        };
    }
}

// Vytvoření instance aplikace při načtení stránky
const app = new AlarmApp();

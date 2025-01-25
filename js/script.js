class Alarm {
    constructor(id, name, time, enabled = true) {
        this.id = id;
        this.name = name;
        this.time = time;
        this.enabled = enabled;
    }

    toHTML(index) {
        return `
            <li>
                <span>${this.name} (${this.time})</span>
                <div class="alarm-actions">
                    <button onclick="app.deleteAlarm(${index})">Smazat</button>
                </div>
            </li>
        `;
    }
}

class AlarmApp {
    constructor() {
        this.currentUser = null;
        this.alarms = [];
        this.storage = localStorage;
        this.init();
    }

    init() {
        document.getElementById('login-btn').addEventListener('click', () => this.login());
        document.getElementById('guest-btn').addEventListener('click', () => this.guest());
        document.getElementById('add-alarm-btn').addEventListener('click', () => this.addAlarm());
        setInterval(() => this.checkAlarms(), 60000);
    }

    login() {
        const username = document.getElementById('username').value.trim();
        if (!username) return alert('Zadejte platné uživatelské jméno.');

        this.currentUser = username;
        this.storage = localStorage;
        this.storage.setItem('username', username);

        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-screen').style.display = 'block';
        document.getElementById('welcome-user').textContent = username;
        this.loadAlarms();
    }

    guest() {
        this.currentUser = 'Host';
        this.storage = sessionStorage;

        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-screen').style.display = 'block';
        document.getElementById('welcome-user').textContent = 'Host';
    }

    loadAlarms() {
        const savedAlarms = JSON.parse(this.storage.getItem('alarms')) || [];
        this.alarms = savedAlarms.map(a => new Alarm(a.id, a.name, a.time, a.enabled));
        this.renderAlarms();
    }

    saveAlarms() {
        this.storage.setItem('alarms', JSON.stringify(this.alarms));
    }

    renderAlarms() {
        const alarmList = document.getElementById('alarm-list');
        alarmList.innerHTML = '';
        this.alarms.forEach((alarm, index) => {
            alarmList.innerHTML += alarm.toHTML(index);
        });
    }

    addAlarm() {
        const time = document.getElementById('alarm-time').value;
        const name = document.getElementById('alarm-name').value.trim() || `Budík${this.alarms.length + 1}`;

        if (!time) return alert('Zadejte čas budíku.');

        const newAlarm = new Alarm(Date.now(), name, time);
        this.alarms.push(newAlarm);
        this.saveAlarms();
        this.renderAlarms();

        document.getElementById('alarm-time').value = '';
        document.getElementById('alarm-name').value = '';
    }

    deleteAlarm(index) {
        this.alarms.splice(index, 1);
        this.saveAlarms();
        this.renderAlarms();
    }

    checkAlarms() {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
        this.alarms.forEach(alarm => {
            if (alarm.enabled && alarm.time === currentTime) {
                const alarmSound = document.getElementById('alarm-sound');
                alarmSound.loop = true;
                alarmSound.volume = 0.1;
                alarmSound.play();
    
                const modal = document.getElementById('alarm-modal');
                const alarmName = document.getElementById('alarm-name');
                const closeModal = document.getElementById('close-modal');
    
                alarmName.textContent = alarm.name;
                modal.style.display = 'block';
    
                closeModal.onclick = function() {
                    modal.style.display = 'none';
                    alarmSound.pause();
                    alarmSound.currentTime = 0;
                };
            }
        });
    }    
}

const app = new AlarmApp();
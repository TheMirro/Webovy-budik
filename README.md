# Webový Budík

## Úvod
Jedná se o webovou aplikaci sloužící k vytváření časových upozornění (budíků). Registrovaný i neregistrovaný uživatel může pomocí této stránky tvořit, spravovat a dostávat audio upozornění od svých budíků z prostředí prohlížeče. Nastavené budíky se pro uživatele ukládají, pokud je registrován.

## Specifikace uživatelských rolí a oprávnění
### Registrovaný uživatel
- Přihlášení za užití přihlašovacího jména.
- Budíky se ukládají do localStorage a zůstávají uložené i po zavření prohlížeče.
- Uživatel může přidávat, mazat, zapínat/vypínat budíky.
### Neregistrovaný uživatel (Host)
- Možnost užití aplikace bez přihlášení.
- Data se ukládají do sessionStorage a ztrácejí se po zavření prohlížeče.
- Uživatel může přidávat, mazat, zapínat/vypínat budíky.

## Uživatelské grafické rozhraní a funkčnosti
- **Login Screen:**
    - Zadání uživatelského jména nebo pokračování jako host.
    - Po úspěšném přihlášení přechod na hlavní obrazovku.

- **Main Screen:**
    - Informuje, který uživatel je přihlášen (uživatelské jméno nebo „Host“).
    - Formulář pro přidání budíku (čas, název - volitelný).
    - Seznam budíků (s možností vypnutí/zapnutí a smazání budíku).

- **Modal Dialog:**
    - Informace o právě spuštěném budíku.
    - Tlačítko pro zavření modalu.

## Popis tříd
### Třída Alarm
Datová reprezentace jednoho budíku.
**Atributy:**
- **id:** Unikátní identifikátor budíku
- **name:** Název budíku.
- **time:** Nastavený čas budíku (HH:MM formát).
- **enabled:** Stav budíku (zapnuto/vypnuto).

### Třída AlarmRenderer
Třída zodpovědná za generování HTML pro budíky
**Metody:**
- **toHTML(alarm, index):** Generuje HTML reprezentaci jednotlivého budíku.

### Třída UIHelper
Pomocná třída pro práci s DOM (objektovým modelem dokumentu).
**Metody:**
- **setElementText(id, text):** Nastaví text konkrétnímu HTML elementu podle ID.
- **toggleDisplay(id, shouldDisplay):** Přepíná zobrazení HTML elementu (viditelný/skrytý)
### Třída AlarmApp
Hlavní třída aplikace, správa budíků a interakce s uživatelem.
**Atributy:**
- **currentUser:** Jméno aktuálně přihlášeného uživatele.
- **alarms:** Pole instancí Alarm (reprezentující všechny budíky).
- **storage:** Typ úložiště (localStorage pro registrované uživatele, sessionStorage pro hosty).
**Metody:**
- **init():** Inicializace aplikace.
- **login():** Přihlášení uživatele, přepnutí na hlavní obrazovku.
- **Guest():** Režim hosta, přepnutí na hlavní obrazovku.
- **loadAlarms():** Načtení budíků z uložiště.
- **saveAlarms():** Uložení budíků na uložiště.
- **toggleAlarm():** Přepnutí stavu budíku (zapnuto/vypnuto).
- **renderAlarms():** Vykreslení budíků do HTML.
- **addAlarm():** Přidá nový budík do pole alarms a aktualizuje UI.
- **deleteAlarm(index):** Smaže budík z pole alarms (podle indexu) a aktualizuje UI
- **checkAlarms():** Pravidelně kontroluje, zda je čas spustit budík.
- **notifyAlarm(alarm):** Spustí zvuk a zobrazí modal s informací o budíku.
## Použité technologie
- **HTML:** Struktura UI (login, seznam budíků, modal).
- **CSS:** Stylizace rozhraní, efekty kliknutí.
- **JavaScript:** Manipulace s DOM (objektovým modelem dokumentu), zpracování událostí, správa dat (localStorage, sessionStorage).
- **Audio:** Zvukové upozornění.
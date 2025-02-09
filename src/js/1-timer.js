import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const refs = {
    input: document.querySelector('#datetime-picker'),
    startBtn: document.querySelector('[data-start]'),
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]')
};

let userSelectedDate = null;
let timerInterval = null;

// Disable start button initially
refs.startBtn.disabled = true;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    dateFormat: "Y-m-d H:i",
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0];
        
        if (userSelectedDate < new Date()) {
            iziToast.error({
                title: 'Error',
                message: 'Please choose a date in the future',
                position: 'topRight',
                timeout: 3000
            });
            refs.startBtn.disabled = true;
        } else {
            refs.startBtn.disabled = false;
        }
    },
};

// Ініціалізуємо flatpickr
const calendar = flatpickr("#datetime-picker", options);

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

function updateTimerInterface({ days, hours, minutes, seconds }) {
    refs.days.textContent = addLeadingZero(days);
    refs.hours.textContent = addLeadingZero(hours);
    refs.minutes.textContent = addLeadingZero(minutes);
    refs.seconds.textContent = addLeadingZero(seconds);
}

function startTimer() {
    if (!userSelectedDate) {
        console.error('No date selected!');
        return;
    }

    refs.startBtn.disabled = true;
    refs.input.disabled = true;

    timerInterval = setInterval(() => {
        const now = new Date();
        const diff = userSelectedDate - now;

        if (diff <= 0) {
            clearInterval(timerInterval);
            refs.input.disabled = false;
            updateTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
        }

        const timeLeft = convertMs(diff);
        updateTimerInterface(timeLeft);
    }, 1000);
}

refs.startBtn.addEventListener('click', startTimer);

document.addEventListener('DOMContentLoaded', function () {
    const translateForm = document.getElementById('translateForm');
    const sourceText = document.getElementById('sourceText');
    const targetText = document.getElementById('targetText');
    const translateButton = document.getElementById('translate');
    const clearSourceButton = document.getElementById('clearSource');
    const copyButton = document.getElementById('copyButton');
    const languageSelect = document.getElementById('langTarget');
    const speakTextButton = document.getElementById('speakText');

    translateForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        try {
            translateButton.disabled = true;
            translateButton.innerHTML = '<i class="fas fa-language mr-2"></i> درحال ترجمه...';

            if (sourceText.value.trim() === '') {
                showToast('لطفا متنی را برای ترجمه وارد نمایید.', 'alert-warning');
                return;
            }

            const formData = new FormData();
            formData.append('sourceText', sourceText.value);
            formData.append('targetLanguage', languageSelect.value);
            const response = await fetch('/src/translate.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `sourceText=${encodeURIComponent(sourceText.value)}&targetLanguage=${languageSelect.value}`,
            });

            if (!response.ok) {
                throw new Error('خطا در ارتباط با سرور');
            }

            const data = await response.json();
            if (data.status === 'success') {
                targetText.value = data.result;
                showToast('ترجمه با موفقیت انجام شد.', 'alert-success');
            } else if (data.status === 'error') {
                showToast('خطا محدودیت API');
                console.error('API Error:', data.result);
            }

        } catch (error) {
            console.error('خطا:', error);
            showToast('خطایی رخ داده است... لطفا با پشتیبانی تماس بگیرید.', 'alert-error');
        } finally {
            translateButton.disabled = false;
            translateButton.innerHTML = '<i class="fas fa-language mr-2"></i> ترجمه';
        }
    });

    clearSourceButton.addEventListener('click', function () {
        sourceText.value = '';
    });

    copyButton.addEventListener('click', copyTranslation);

    speakTextButton.addEventListener('click', speakText(sourceText.value));

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/assets/js/sw.js')
            .then(() => console.log('Service Worker ثبت شد.'))
            .catch((err) => console.error('خطا در ثبت Service Worker:', err));
    }
});

function copyTranslation() {
    const targetText = document.getElementById('targetText');

    if (targetText.value.trim() === '') {
        showToast('متنی برای کپی کردن وجود ندارد!', 'alert-warning');
        return;
    }

    navigator.clipboard.writeText(targetText.value)
        .then(() => {
            showToast('متن ترجمه شده با موفقیت کپی شد.', 'alert-success');
        })
        .catch((err) => {
            console.error('خطا در کپی متن:', err);
            showToast('کپی متن شکست خورد!', 'alert-error');
        });
}

function showToast(message, type = 'alert-success') {
    const toastContainer = document.getElementById('copyToast');
    toastContainer.innerHTML = `
        <div class="alert ${type}">
            <span>${message}</span>
        </div>
    `;

    setTimeout(() => {
        toastContainer.innerHTML = '';
    }, 2000);
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    } else {
        showToast('Text-to-speech پشتیبانی نمی‌شود.', 'alert-warning');
    }
}


const languages = [
    { value: 'English', code: 'en', name: 'English | انگلیسی (🇬🇧)' },
    { value: 'Spanish', code: 'es', name: 'Spanish | اسپانیایی (🇪🇸)' },
    { value: 'French', code: 'fr', name: 'French | فرانسوی (🇫🇷)' },
    { value: 'German', code: 'de', name: 'German | آلمانی (🇩🇪)' },
    { value: 'Italian', code: 'it', name: 'Italian | ایتالیایی (🇮🇹)' },
    { value: 'Portuguese', code: 'pt', name: 'Portuguese | پرتغالی (🇵🇹)' },
    { value: 'Portuguese', code: 'pt-BR', name: 'Portuguese-Brazilian | پرتغالی برزیلی (🇧🇷)' },
    { value: 'Russian', code: 'ru', name: 'Russian | روسی (🇷🇺)' },
    { value: 'Chinese', code: 'zh', name: 'Chinese | چینی (🇨🇳)' },
    { value: 'Japanese', code: 'ja', name: 'Japanese | ژاپنی (🇯🇵)' },
    { value: 'Korean', code: 'ko', name: 'Korean | کره‌ای (🇰🇷)' },
    { value: 'Arabic', code: 'ar', name: 'Arabic | عربی (🇸🇦)' },
    { value: 'Turkish', code: 'tr', name: 'Turkish | ترکی (🇹🇷)' },
    { value: 'Persian', code: 'fa', name: 'Persian | فارسی (🇮🇷)' },
    { value: 'Hindi', code: 'hi', name: 'Hindi | هندی (🇮🇳)' },
    { value: 'Urdu', code: 'ur', name: 'Urdu | اردو (🇵🇰)' },
    { value: 'Dutch', code: 'nl', name: 'Dutch | هلندی (🇳🇱)' },
    { value: 'Greek', code: 'el', name: 'Greek | یونانی (🇬🇷)' },
    { value: 'Hebrew', code: 'he', name: 'Hebrew | عبری (🇮🇱)' },
    { value: 'Swedish', code: 'sv', name: 'Swedish | سوئدی (🇸🇪)' },
    { value: 'Danish', code: 'da', name: 'Danish | دانمارکی (🇩🇰)' },
    { value: 'Norwegian', code: 'no', name: 'Norwegian | نروژی (🇳🇴)' },
    { value: 'Finnish', code: 'fi', name: 'Finnish | فنلاندی (🇫🇮)' },
    { value: 'Polish', code: 'pl', name: 'Polish | لهستانی (🇵🇱)' },
    { value: 'Czech', code: 'cs', name: 'Czech | چکی (🇨🇿)' },
    { value: 'Hungarian', code: 'hu', name: 'Hungarian | مجاری (🇭🇺)' },
    { value: 'Romanian', code: 'ro', name: 'Romanian | رومانیایی (🇷🇴)' },
    { value: 'Thai', code: 'th', name: 'Thai | تایلندی (🇹🇭)' },
    { value: 'Indonesian', code: 'id', name: 'Indonesian | اندونزیایی (🇮🇩)' },
    { value: 'Malay', code: 'ms', name: 'Malay | مالایی (🇲🇾)' },
    { value: 'Vietnamese', code: 'vi', name: 'Vietnamese | ویتنامی (🇻🇳)' },
    { value: 'Filipino', code: 'tl', name: 'Filipino | فیلیپینی (🇵🇭)' },
    { value: 'Bengali', code: 'bn', name: 'Bengali | بنگالی (🇧🇩)' },
    { value: 'Ukrainian', code: 'uk', name: 'Ukrainian | اوکراینی (🇺🇦)' },
    { value: 'Slovak', code: 'sk', name: 'Slovak | اسلواکی (🇸🇰)' },
    { value: 'Serbian', code: 'sr', name: 'Serbian | صربی (🇷🇸)' },
    { value: 'Croatian', code: 'hr', name: 'Croatian | کرواتی (🇭🇷)' },
    { value: 'Bulgarian', code: 'bg', name: 'Bulgarian | بلغاری (🇧🇬)' },
    { value: 'Georgian', code: 'ka', name: 'Georgian | گرجی (🇬🇪)' },
    { value: 'Kazakh', code: 'kk', name: 'Kazakh | قزاقی (🇰🇿)' },
    { value: 'Azerbaijani', code: 'az', name: 'Azerbaijani | آذربایجانی (🇦🇿)' },
    { value: 'Armenian', code: 'hy', name: 'Armenian | ارمنی (🇦🇲)' },
    { value: 'Basque', code: 'eu', name: 'Basque | باسکی (🇪🇸)' },
    { value: 'Irish', code: 'ga', name: 'Irish | ایرلندی (🇮🇪)' },
    { value: 'Welsh', code: 'cy', name: 'Welsh | ولزی (🏴)' },
    { value: 'Scottish', code: 'gd', name: 'Scottish Gaelic | گالی اسکاتلندی (🏴)' },
    { value: 'Latvian', code: 'lv', name: 'Latvian | لتونیایی (🇱🇻)' },
    { value: 'Lithuanian', code: 'lt', name: 'Lithuanian | لیتوانیایی (🇱🇹)' },
    { value: 'Estonian', code: 'et', name: 'Estonian | استونیایی (🇪🇪)' },
    { value: 'Maltese', code: 'mt', name: 'Maltese | مالتی (🇲🇹)' },
    { value: 'Icelandic', code: 'is', name: 'Icelandic | ایسلندی (🇮🇸)' },
    { value: 'Swahili', code: 'sw', name: 'Swahili | سواحیلی (🇰🇪)' },
    { value: 'Afrikaans', code: 'af', name: 'Afrikaans | آفریکانس (🇿🇦)' },
    { value: 'Haitian', code: 'ht', name: 'Haitian Creole | کریول هائیتی (🇭🇹)' },
    { value: 'Esperanto', code: 'eo', name: 'Esperanto | اسپرانتو (🌍)' }
];


// languages option render
const languageSelect = document.getElementById('langTarget');

// اضافه کردن option‌ها به select
languages.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang.value + ' ' + lang.value; // مقدار value
    option.textContent = lang.name; // متن نمایشی
    languageSelect.appendChild(option);
});

languageSelect.addEventListener('change', function () {
    const selectedLanguage = this.value; // زبان انتخاب شده
    localStorage.setItem('selectedLanguage', selectedLanguage); // ذخیره در localStorage
});

document.addEventListener('DOMContentLoaded', function () {
    const savedLanguage = localStorage.getItem('selectedLanguage'); // بازیابی زبان ذخیره شده

    if (savedLanguage) {
        languageSelect.value = savedLanguage; // تنظیم زبان انتخاب شده
    }
});
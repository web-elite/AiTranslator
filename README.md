# Ai Translator - BiscoTranslate

Ai Translator (BiscoTranslate) is a progressive web application (PWA) that allows users to translate text into any language using AI-powered agents. The application is designed to be fast, reliable, and accessible across multiple devices.

## Features

- **AI-Powered Translation**: Translate text into any language with the help of AI agents.
- **PWA Support**: Installable on devices for a native app-like experience.
- **Customizable Theme**: Includes a modern theme with customizable colors.
- **Offline Support**: Provides an offline fallback page for better reliability.
- **Cross-Platform**: Compatible with Windows and other platforms.

## Project Structure

```
.env
.env.example
.gitignore
composer.json
composer.lock
index.html
manifest.json
offline.html
assets/
    css/
    fonts/
    img/
    js/
src/
    cache.php
    index.php
    translate.php
    Logging/
    Services/
vendor/
    autoload.php
    ...
```

### Key Files

- **`manifest.json`**: Defines the PWA configuration, including icons, theme color, and shortcuts.
- **`index.html`**: The main entry point for the web application.
- **`src/translate.php`**: Handles the translation logic.
- **`assets/`**: Contains static assets like CSS, images, and JavaScript files.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repository.git
   cd your-repository
   ```

2. Install dependencies using Composer:
   ```bash
   composer install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` and update the necessary values.

4. Serve the application locally:
   ```bash
   php -S localhost:8000 -t src/
   ```

5. Access the application in your browser at `http://localhost:8000`.

## Usage

1. Open the application in your browser.
2. Enter the text you want to translate.
3. Select the target language and click "Translate."

## PWA Features

- **Installable**: Add the app to your home screen or desktop.
- **Offline Support**: Displays `offline.html` when the network is unavailable.
- **Shortcuts**: Quickly start translating using the "Start Translate" shortcut.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push them to your fork.
4. Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions or support, please contact [webelitee@gmail.com](mailto:webelitee@gmail.com).
```


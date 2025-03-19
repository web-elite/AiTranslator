<?php

require_once dirname(__DIR__) . '/vendor/autoload.php';

use Dotenv\Dotenv;
use Src\Logging\Log;
use Src\Services\TranslationService;

try {
    $dotenv = Dotenv::createImmutable(dirname(__DIR__));
    $dotenv->load();

    $logger = new Log('translate');
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        header('HTTP/1.0 403 Forbidden');
        die("Sorry, we couldn't process your request.");
    }

    $sourceText = trim($_POST['sourceText'] ?? '');
    $targetLanguage = trim($_POST['targetLanguage'] ?? 'فارسی');
    $serviceType = trim($_POST['serviceType'] ?? 'gemini');

    $sourceText = htmlspecialchars($sourceText, ENT_QUOTES, 'UTF-8');

    if (empty($sourceText)) {
        echo json_encode([
            'result' => 'لطفا متنی را برای ترجمه ارسال کنید.',
            'status' => 'error',
        ]);
        exit;
    }

    $translationService = new TranslationService($logger);
    $translatedText = $translationService->translate($sourceText, $targetLanguage, $serviceType);

    if ($translatedText) {
        echo json_encode([
            'result' => $translatedText,
            'status' => 'success',
        ]);
    } else {
        echo json_encode([
            'result' => 'ترجمه انجام نشد. لطفا دوباره تلاش کنید.',
            'status' => 'error',
        ]);
    }
} catch (Exception $e) {
    $logger->error('Error: ' . $e->getMessage());
    echo json_encode([
        'result' => 'خطایی رخ داده است. لطفا بعدا تلاش کنید.',
        'status' => 'error',
    ]);
}
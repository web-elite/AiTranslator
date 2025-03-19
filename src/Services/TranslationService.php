<?php

namespace Src\Services;

use Src\Logging\Log;
use Src\Services\GeminiService;
use Src\Services\DeepSeekService;

class TranslationService
{
    private $logger;
    private $geminiService;
    private $deepSeekService;

    public function __construct(Log $logger)
    {
        $this->logger = $logger;
        $this->geminiService = new GeminiService($logger);
        $this->deepSeekService = new DeepSeekService($logger);
    }

    public function translate(string $sourceText, string $targetLanguage, string $serviceType): ?string
    {
        $this->logger->info("Starting translation with service: $serviceType");

        return match ($serviceType) {
            'gemini' => $this->geminiService->translate($sourceText, $targetLanguage),
            'deepseek' => $this->deepSeekService->translate($sourceText, $targetLanguage),
            default => throw new \InvalidArgumentException("Invalid service type: $serviceType"),
        };
    }
}
<?php
namespace Src\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Src\Logging\Log;
use Src\Logging\Logger;

class GeminiService
{
    private $logger;
    private $client;
    private $apiKeys;

    public function __construct(Log $logger)
    {
        $this->logger  = $logger;
        $this->client  = new Client();
        $this->apiKeys = explode(',', $_ENV['GEMINI_API_KEY']);
    }

    public function translate(string $sourceText, string $targetLanguage): ?string
    {
        if (empty($this->apiKeys) or is_null($this->apiKeys) or count($this->apiKeys) === 1 or ! is_array($this->apiKeys)) {
            $this->logger->error('Gemini API keys not found.');
            return null;
        }
        $maxRetries = count($this->apiKeys);

        for ($i = 0; $i < $maxRetries; $i++) {
            try {
                $apiKey = $this->apiKeys[$i];
                $url    = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$apiKey";

                $data = [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => "Translate the following text into $targetLanguage in a natural and fluent way. Only provide the translated text without any explanations, extra words, or formatting. Here is the text: $sourceText"],
                            ],
                        ],
                    ],
                ];

                $response = $this->client->post($url, [
                    'headers' => [
                        'Content-Type' => 'application/json',
                    ],
                    'json'    => $data,
                ]);

                $body    = $response->getBody();
                $content = json_decode($body, true);

                if (isset($content['candidates'][0]['content']['parts'][0]['text'])) {
                    return $content['candidates'][0]['content']['parts'][0]['text'];
                } else {
                    $this->logger->error('Invalid Gemini API response: ' . json_encode($content));
                }
            } catch (RequestException $e) {
                $this->logger->warning("Gemini API request failed: " . $e->getMessage());
            }
        }

        $this->logger->error('All Gemini API keys exhausted.');
        return null;
    }
}

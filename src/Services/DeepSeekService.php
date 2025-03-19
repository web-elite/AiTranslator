<?php

namespace Src\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Src\Logging\Log;
use Src\Logging\Logger;

class DeepSeekService
{
    private $logger;
    private $client;
    private $apiKeys;

    public function __construct(Log $logger)
    {
        $this->logger = $logger;
        $this->client = new Client();
        $this->apiKeys = explode(',', $_ENV['DEEPSEEK_API_KEY']);
    }

    public function translate(string $sourceText, string $targetLanguage): ?string
    {
        $maxRetries = count($this->apiKeys);

        for ($i = 0; $i < $maxRetries; $i++) {
            try {
                $apiKey = $this->apiKeys[$i];
                $url = "https://api.deepseek.com/chat/completions";

                $data = [
                    'model' => 'deepseek-chat',
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'You are a helpful assistant that translates text.',
                        ],
                        [
                            'role' => 'user',
                            'content' => "Translate the following text into $targetLanguage in a natural and fluent way. Only provide the translated text without any explanations, extra words, or formatting. Here is the text: $sourceText",
                        ],
                    ],
                    'stream' => false,
                ];

                $response = $this->client->post($url, [
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'Authorization' => "Bearer $apiKey",
                    ],
                    'json' => $data,
                ]);

                $body = $response->getBody();
                $content = json_decode($body, true);

                if (isset($content['choices'][0]['message']['content'])) {
                    return $content['choices'][0]['message']['content'];
                } else {
                    $this->logger->error('Invalid DeepSeek API response: ' . json_encode($content));
                }
            } catch (RequestException $e) {
                $this->logger->warning("DeepSeek API request failed: " . $e->getMessage());
            }
        }

        $this->logger->error('All DeepSeek API keys exhausted.');
        return null;
    }
}
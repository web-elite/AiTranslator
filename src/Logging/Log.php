<?php
namespace Src\Logging;

use Monolog\Formatter\LineFormatter;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;

class Log
{
    private $logger;

    public function __construct(string $name)
    {
        $this->logger = new Logger($name);
        $logDir       = __DIR__ . '/../../logs/';
        if (! is_dir($logDir)) {
            mkdir($logDir, 0777, true); // The third parameter `true` allows the creation of nested directories
        }
        $logFileName   = $logDir . $name . '-' . date('Y-m-d') . '.log';
        $streamHandler = new StreamHandler($logFileName);
        $formatter     = new LineFormatter("[%datetime%] %level_name%: %message%\n", 'H:i:s');
        $streamHandler->setFormatter($formatter);
        $this->logger->pushHandler($streamHandler);
    }

    public function info(string $message): void
    {
        $this->logger->info($message);
    }

    public function error(string $message): void
    {
        $this->logger->error($message);
    }

    public function warning(string $message): void
    {
        $this->logger->warning($message);
    }
}

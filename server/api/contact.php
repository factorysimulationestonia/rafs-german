<?php

declare(strict_types=1);

const MAX_REQUEST_BYTES = 16_384;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5_000;

function respond(int $status, array $payload): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function envValue(string $name, string $fallback = ''): string
{
    $value = getenv($name);
    return $value === false || $value === '' ? $fallback : $value;
}

function normalizeSingleLine(mixed $value): string
{
    if (!is_string($value)) {
        return '';
    }

    return trim((string) preg_replace('/[\r\n]+/', ' ', $value));
}

function normalizeMessage(mixed $value): string
{
    if (!is_string($value)) {
        return '';
    }

    $normalized = preg_replace("/\r\n?/", "\n", $value);
    return trim((string) $normalized);
}

function textLength(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
}

function validateOrigin(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') {
        return;
    }

    $allowedOrigins = array_filter(array_map(
        'trim',
        explode(',', envValue(
            'CONTACT_ALLOWED_ORIGINS',
            'https://factorysimulation.eu,https://www.factorysimulation.eu,http://localhost:5173,http://127.0.0.1:5173'
        ))
    ));

    if (!in_array($origin, $allowedOrigins, true)) {
        respond(403, ['ok' => false, 'code' => 'origin_not_allowed']);
    }

    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}

function enforceRateLimit(string $clientIp): void
{
    if (envValue('CONTACT_RATE_LIMIT', '1') === '0') {
        return;
    }

    $now = time();
    $path = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'factory-simulation-contact-rate-limit.json';
    $handle = fopen($path, 'c+');

    if ($handle === false || !flock($handle, LOCK_EX)) {
        respond(503, ['ok' => false, 'code' => 'rate_limit_unavailable']);
    }

    $contents = stream_get_contents($handle);
    $state = is_string($contents) && $contents !== '' ? json_decode($contents, true) : [];
    if (!is_array($state)) {
        $state = [];
    }

    $lastGlobal = isset($state['lastGlobal']) ? (int) $state['lastGlobal'] : 0;
    $ipAttempts = isset($state['ips'][$clientIp]) && is_array($state['ips'][$clientIp])
        ? array_values(array_filter($state['ips'][$clientIp], static fn ($timestamp): bool => (int) $timestamp > $now - 3600))
        : [];

    if ($lastGlobal > $now - 5 || (!empty($ipAttempts) && (int) end($ipAttempts) > $now - 30) || count($ipAttempts) >= 5) {
        flock($handle, LOCK_UN);
        fclose($handle);
        header('Retry-After: 30');
        respond(429, ['ok' => false, 'code' => 'rate_limited']);
    }

    $state['lastGlobal'] = $now;
    $state['ips'] = isset($state['ips']) && is_array($state['ips']) ? $state['ips'] : [];
    $state['ips'][$clientIp] = [...$ipAttempts, $now];

    foreach ($state['ips'] as $ip => $attempts) {
        $recentAttempts = array_values(array_filter(
            is_array($attempts) ? $attempts : [],
            static fn ($timestamp): bool => (int) $timestamp > $now - 3600
        ));

        if ($recentAttempts === []) {
            unset($state['ips'][$ip]);
        } else {
            $state['ips'][$ip] = $recentAttempts;
        }
    }

    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($state));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
}

function smtpRead($socket, array $expectedCodes): string
{
    $response = '';

    do {
        $line = fgets($socket, 1_024);
        if ($line === false) {
            throw new RuntimeException('SMTP connection closed unexpectedly.');
        }

        $response .= $line;
    } while (strlen($line) >= 4 && $line[3] === '-');

    $status = (int) substr($response, 0, 3);
    if (!in_array($status, $expectedCodes, true)) {
        throw new RuntimeException('SMTP rejected the request with status ' . $status . '.');
    }

    return $response;
}

function smtpCommand($socket, string $command, array $expectedCodes): string
{
    if (fwrite($socket, $command . "\r\n") === false) {
        throw new RuntimeException('Could not write to SMTP connection.');
    }

    return smtpRead($socket, $expectedCodes);
}

function encodeHeader(string $value): string
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function sendContactEmail(string $name, string $email, string $message, string $language, string $source): void
{
    $environment = envValue('CONTACT_ENV', 'production');
    $smtpHost = envValue('CONTACT_SMTP_HOST', $environment === 'development' ? '127.0.0.1' : 'localhost');
    $smtpPort = (int) envValue('CONTACT_SMTP_PORT', $environment === 'development' ? '1025' : '25');
    $fromAddress = envValue('CONTACT_FROM_ADDRESS', 'website@factorysimulation.eu');
    $recipient = envValue('CONTACT_TO_ADDRESS', 'info@factorysimulation.eu');
    $siteHost = envValue('CONTACT_SITE_HOST', 'factorysimulation.eu');
    $copy = [
        'et' => [
            'subjectPrefix' => 'Uus projektipäring veebilehelt',
            'heading' => 'Uus projektipäring',
            'name' => 'Nimi',
            'language' => 'Keel',
            'source' => 'Vormi allikas',
            'submitted' => 'Saadetud',
            'description' => 'Projekti kirjeldus:',
        ],
        'en' => [
            'subjectPrefix' => 'New project inquiry from the website',
            'heading' => 'New project inquiry',
            'name' => 'Name',
            'language' => 'Language',
            'source' => 'Form source',
            'submitted' => 'Submitted',
            'description' => 'Project description:',
        ],
        'de' => [
            'subjectPrefix' => 'Neue Projektanfrage von der Website',
            'heading' => 'Neue Projektanfrage',
            'name' => 'Name',
            'language' => 'Sprache',
            'source' => 'Formularquelle',
            'submitted' => 'Gesendet',
            'description' => 'Projektbeschreibung:',
        ],
    ];
    $subjectPrefix = $copy[$language]['subjectPrefix'];
    $subject = $subjectPrefix . ': ' . $name . ', ' . $email;
    $submittedAt = gmdate('Y-m-d H:i:s') . ' UTC';
    $sourceLabels = [
        'et' => [
            'main' => 'Põhilehe kontaktivorm',
            'wheelme' => 'Wheel.me lehe kontaktivorm',
            'search' => 'Otsingulehe kontaktivorm',
        ],
        'en' => [
            'main' => 'Main page contact form',
            'wheelme' => 'Wheel.me page contact form',
            'search' => 'Search page contact form',
        ],
        'de' => [
            'main' => 'Kontaktformular der Hauptseite',
            'wheelme' => 'Kontaktformular der Wheel.me-Seite',
            'search' => 'Kontaktformular der Suchseite',
        ],
    ];

    $body = implode("\n", [
        $copy[$language]['heading'],
        '',
        $copy[$language]['name'] . ': ' . $name,
        'E-mail: ' . $email,
        $copy[$language]['language'] . ': ' . strtoupper($language),
        $copy[$language]['source'] . ': ' . $sourceLabels[$language][$source],
        $copy[$language]['submitted'] . ': ' . $submittedAt,
        '',
        $copy[$language]['description'],
        $message,
    ]);

    $headers = [
        'Date: ' . date(DATE_RFC2822),
        'From: ' . encodeHeader('Factory Simulation Website') . ' <' . $fromAddress . '>',
        'Reply-To: ' . encodeHeader($name) . ' <' . $email . '>',
        'To: <' . $recipient . '>',
        'Subject: ' . encodeHeader($subject),
        'Message-ID: <' . bin2hex(random_bytes(16)) . '@' . $siteHost . '>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ];

    $data = implode("\r\n", $headers) . "\r\n\r\n" . str_replace("\n", "\r\n", $body);
    $data = preg_replace('/(?m)^\./', '..', $data);

    $socket = @fsockopen($smtpHost, $smtpPort, $errorCode, $errorMessage, 10);
    if ($socket === false) {
        throw new RuntimeException('Could not connect to SMTP relay.');
    }

    stream_set_timeout($socket, 10);

    try {
        smtpRead($socket, [220]);
        smtpCommand($socket, 'EHLO ' . $siteHost, [250]);
        smtpCommand($socket, 'MAIL FROM:<' . $fromAddress . '>', [250]);
        smtpCommand($socket, 'RCPT TO:<' . $recipient . '>', [250, 251]);
        smtpCommand($socket, 'DATA', [354]);
        smtpCommand($socket, $data . "\r\n.", [250]);
        smtpCommand($socket, 'QUIT', [221]);
    } finally {
        fclose($socket);
    }
}

validateOrigin();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 600');
    http_response_code(204);
    exit;
}

if ($method === 'GET') {
    respond(200, ['ok' => true, 'service' => 'contact']);
}

if ($method !== 'POST') {
    header('Allow: GET, POST, OPTIONS');
    respond(405, ['ok' => false, 'code' => 'method_not_allowed']);
}

$contentLength = isset($_SERVER['CONTENT_LENGTH']) ? (int) $_SERVER['CONTENT_LENGTH'] : 0;
if ($contentLength > MAX_REQUEST_BYTES) {
    respond(413, ['ok' => false, 'code' => 'request_too_large']);
}

$contentType = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
if (!str_starts_with($contentType, 'application/json')) {
    respond(415, ['ok' => false, 'code' => 'unsupported_media_type']);
}

$rawBody = file_get_contents('php://input', false, null, 0, MAX_REQUEST_BYTES + 1);
if (!is_string($rawBody) || strlen($rawBody) > MAX_REQUEST_BYTES) {
    respond(413, ['ok' => false, 'code' => 'request_too_large']);
}

$payload = json_decode($rawBody, true);
if (!is_array($payload)) {
    respond(400, ['ok' => false, 'code' => 'invalid_json']);
}

$name = normalizeSingleLine($payload['name'] ?? '');
$email = normalizeSingleLine($payload['email'] ?? '');
$message = normalizeMessage($payload['description'] ?? '');
$language = normalizeSingleLine($payload['language'] ?? 'et');
$honeypot = normalizeSingleLine($payload['company'] ?? '');
$source = normalizeSingleLine($payload['source'] ?? 'main');

if ($honeypot !== '') {
    respond(200, ['ok' => true]);
}

if (
    $name === ''
    || textLength($name) > MAX_NAME_LENGTH
    || $email === ''
    || textLength($email) > MAX_EMAIL_LENGTH
    || filter_var($email, FILTER_VALIDATE_EMAIL) === false
    || textLength($message) < 5
    || textLength($message) > MAX_MESSAGE_LENGTH
    || !in_array($language, ['et', 'en', 'de'], true)
    || !in_array($source, ['main', 'wheelme', 'search'], true)
) {
    respond(422, ['ok' => false, 'code' => 'validation_failed']);
}

enforceRateLimit((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));

try {
    sendContactEmail($name, $email, $message, $language, $source);
    respond(200, ['ok' => true]);
} catch (Throwable $error) {
    error_log('Contact form delivery failed: ' . $error->getMessage());
    respond(502, ['ok' => false, 'code' => 'delivery_failed']);
}

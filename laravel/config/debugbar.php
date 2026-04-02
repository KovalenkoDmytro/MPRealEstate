<?php
return [
    'enabled' => env('DEBUGBAR_ENABLED', false),
    'storage' => [
        'enabled' => env('DEBUGBAR_STORAGE_ENABLED', false),
        'path' => storage_path('debugbar'),
    ],
    'collectors' => [
        'phpinfo' => true,
        'messages' => true,
        'time' => true,
        'memory' => true,
        'exceptions' => true,
        'views' => true,
        'route' => true,
        'log' => true,
        'db' => true,
        'models' => true,
        'events' => true,
    ],
    'inject' => true, // ✅ Ensures Debugbar is injected in Blade views
];

<?php
return [

    'paginate' => [
        'project' => 5,
        'task' =>3
    ],
    
    'user' => [
        'list' => [
            'limit' => 10,
        ],
    ],
    'task' => [
        'list' => [
            'limit' => 5,
        ],
    ],
    'group' => [
        'backend' => 'backend',
        'frontend' => 'frontend',
        'management' => 'management',
    ],
    'role' => [
        'admin' => 'admin',
        'leader' => 'leader',
        'user' => 'user',
    ]
];

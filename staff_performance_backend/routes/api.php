<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/



Route::group([
    'prefix' => 'auth',
    'as' => 'api.auth.',
], function () {
    Route::post('login', 'AuthController@login')->name('login');

    Route::group([
        'middleware' => ['jwt']
    ],function(){
        Route::post('/logout', 'AuthController@logout')->name('logout');
        Route::post('/refresh', 'AuthController@refresh')->name('refresh');
        Route::get('/user', 'AuthController@getUser')->name('get_user');
        Route::get('/tasks', 'UserController@getAuthUserTasks')->name('auth_tasks');
        Route::get('/efforts', 'UserController@getAuthUserEffortData')->name('auth_efforts');
    });
});

Route::group([
    'prefix' => 'admin',
    'as' => 'api.admin.',
], function () {

    //summary
    Route::get('/summary', 'SummaryController@summary')->name('summary');

    Route::group([
        'prefix' => 'user',
        'as' => 'user.',
        'middleware' => ['jwt', 'role:admin,leader']
    ], function () {
        Route::group([
            'middleware' => ['jwt', 'role:admin']
        ], function () {
            Route::get('/', 'UserController@index')->name('index');
            Route::get('/{id}/show', 'UserController@show')->name('show');
            Route::post('/store', 'UserController@store')->name('store');
            Route::put('/{id}/update', 'UserController@update')->name('update');
            Route::delete('/{id}/destroy', 'UserController@destroy')->name('destroy');
            Route::get('/group-role', 'UserController@getGroupRole')->name('group_role');
            Route::post('/{id}/reset-password', 'UserController@resetPassword')->name('reset_password');
            Route::get('/{id}/tasks', 'UserController@getUserTasks')->name('tasks');
            Route::get('/{id}/effort', 'UserController@getEffortData')->name('effort');
        });
        Route::post('/all', 'UserController@getAll')->name('getAll')->middleware('role:admin,leader');
    });

    Route::group([
        'prefix' => 'project',
        'as' => 'project.',
        'middleware' => ['jwt', 'role:admin,leader']
    ], function () {
        Route::get('/', 'ProjectController@index')->name('index');
        Route::get('/{id}', 'ProjectController@show')->name('show');
        Route::post('/store', 'ProjectController@store')->name('store');
        Route::get('/{id}/edit', 'ProjectController@edit')->name('edit');
        Route::put('/{id}/update', 'ProjectController@update')->name('update');
        Route::delete('/{id}/destroy', 'ProjectController@destroy')->name('destroy');
        Route::post('/{id}/get-user-of-project','ProjectController@getUserByProject')->name('get-user-of-project');
    });

    Route::group([
        'prefix' => 'task',
        'as' => 'task.',
        'middleware' => ['jwt', 'role:admin,leader']
    ], function () {
        Route::get('/{idProject}/list', 'TaskController@index')->name('index');
        Route::post('/store', 'TaskController@store')->name('store');
        Route::get('/{id}/edit', 'TaskController@edit')->name('edit');
        Route::put('/{id}/update', 'TaskController@update')->name('update');
        Route::delete('/{id}/destroy', 'TaskController@destroy')->name('destroy');
    });

    Route::group([
        'prefix' => 'report',
        'as' => 'report.',
        'middleware' => ['jwt', 'role:admin,leader']
    ], function () {
        Route::get('/projects', 'SummaryController@projectsEffort');
        Route::get('/group', 'SummaryController@groupEffort');
    });
});

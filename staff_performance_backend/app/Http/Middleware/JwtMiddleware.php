<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class JwtMiddleware extends BaseMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // dd($request->all());
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (Exception $e) {
            if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException){
                $code     = 401;
                $message    = 'This token is invalid. Please Login';
                return response()->json(compact('code','message'),401);
            }else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException){
                // If the token is expired, then it will be refreshed and added to the headers
                // try
                // {
                //     $refreshed = JWTAuth::refresh(JWTAuth::getToken());
                //     $user = JWTAuth::setToken($refreshed)->toUser();
                //     $request->headers->set('Authorization','Bearer '.$refreshed);
                // }catch (JWTException $e){
                //     return response()->json([
                //         'status'   => 103,
                //         'message' => 'Token cannot be refreshed, please Login again'
                //     ]);
                // }
                $code     = 190;
                $message    = 'This token has been expired';
                return response()->json(compact('code','message'),401);
            }else{
                $code = 404;
                $message = 'Authorization Token not found';
                return response()->json(compact('code','message'), 404);
            }
        }
        return $next($request);
    }
}

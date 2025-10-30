<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request){
        $request -> validate([
            'email' => ['required','email'],
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response([
                'message' => 'Invalid credentials.',
            ], 401);
        }

        $user = Auth::user();
        if(!$user ->is_admin == 1){
            Auth::logout();

            return response([
                'message' => 'you don\'t have permission to authenticate as admin',
            ],status:403);
        }

       $token = $user -> createToken('auth_token') -> plainTextToken;
       
       return response([
        'user' => new UserResource($user),
        'token' => $token
       ]);
    }
    
    public function logout(){
        $user = Auth::user();
        $user -> currentAccessToken()->delete();
        return response(content:'', status:204);
    }
    
     public function getUser(Request $request){
        return new UserResource($request -> user()); 
    }
}

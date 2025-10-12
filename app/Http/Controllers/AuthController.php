<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request){
        $request -> validate([
            'email' => ['required','email'],
            'password' => 'required',
        ]);

        $user = Auth::user();
        if(!$user -> is_admin){
        Auth::logout();

        return response([
            'message' => 'you don\'t have permission to authenticate as admin',
        ],status:403);
       }

       $token = $user -> createToken('auth_token') -> plainTextToken;
       
       return response([
        'user' => $user,
        'token' => $token
       ]);
    }
    
    public function logout(){
        $user = Auth::user();
        $user -> currentAccessToken()->delete();
        return response(content:'', status:204);
    }
}

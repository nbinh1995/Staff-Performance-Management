<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|max:32',
            'dob' => 'required|date',
            'phone' => ['required', 'regex:/(84|0[3|5|7|8|9])+([0-9]{8})\b/',],
            'avatar' => 'nullable|mimes:jpeg,jpg,png|max:2048',
            'salary' => 'numeric|min:0',
            'pay_per_hour' => 'numeric|min:0',
            'group_id' => 'required|exists:groups,id',
            'role_id' => 'required|exists:roles,id',
        ];
    }

    public function attributes()
    {
        return [
            'group_id' => 'group',
            'role_id' => 'role',
        ];
    }
}

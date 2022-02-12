<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
            'full_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,'.$this->route('id'),
            'password' => 'nullable|string|min:6|max:32',
            'dob' => 'nullable|date',
            'phone' => ['nullable', 'regex:/(84|0[3|5|7|8|9])+([0-9]{8})\b/',],
            'avatar' => 'nullable|mimes:jpeg,jpg,png|max:2048',
            'salary' => 'nullable|numeric|min:0',
            'pay_per_hour' => 'nullable|numeric|min:0',
            'group_id' => 'nullable|exists:groups,id',
            'role_id' => 'nullable|exists:roles,id',
        ];
    }
}

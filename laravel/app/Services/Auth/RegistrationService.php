<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class RegistrationService
{
    /**
     * Handles the business logic of registering a new user.
     *
     * @param  array  $validatedData  The data validated by the Form Request.
     * @return User The newly created user instance.
     */
    public function registerUser(array $validatedData): User
    {
        $existingUser = User::query()
            ->where('email', $validatedData['email'])
            ->first();

        if ($existingUser && ! $existingUser->hasVerifiedEmail()) {
            $existingUser->sendEmailVerificationNotification();

            return $existingUser;
        }

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'role' => $validatedData['role'],
            'phone_number' => $validatedData['phone_number'] ?? '',
        ]);

        // Assign the role using your roles package (e.g., Spatie)
        Role::findOrCreate($validatedData['role']);
        $user->assignRole($validatedData['role']);

        // Add lawyer_number for a lawyer
        if ($user->hasRole('lawyer')) {
            $user->lawyer_number = generateUniqueLawyerNumber();
            $user->save();
        }

        return $user;
    }
}

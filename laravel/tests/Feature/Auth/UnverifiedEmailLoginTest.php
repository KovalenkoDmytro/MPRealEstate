<?php

declare(strict_types=1);

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailNotification;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Artisan;

describe('Unverified email login flow', function (): void {
    beforeEach(function (): void {
        Artisan::call('db:seed', ['--class' => RoleSeeder::class]);

        $this->withoutMiddleware(ValidateCsrfToken::class);
    });

    it('redirects an existing unverified user to the resend verification screen', function (): void {
        $user = User::factory()->create([
            'name' => 'Dmytro Kovalenko',
            'phone_number' => '4035550199',
            'email' => 'dmytro_kovalenko@hotmail.com',
            'password' => 'password',
            'role' => 'buyer',
            'email_verified_at' => null,
        ]);
        $user->assignRole('buyer');

        $response = $this->post(route('login'), [
            'email' => 'dmytro_kovalenko@hotmail.com',
            'password' => 'password',
        ]);

        $response->assertRedirect(
            route('verification.notice', [
                'resendVerificationEmail' => 'dmytro_kovalenko@hotmail.com',
            ])
        );

        $this->assertGuest();
    });

    it('reuses an existing unverified account during registration and resends verification email', function (): void {
        $existingUser = User::factory()->create([
            'name' => 'Dmytro Kovalenko',
            'phone_number' => '4035550299',
            'email' => 'dmytro_kovalenko@hotmail.com',
            'role' => 'buyer',
            'email_verified_at' => null,
        ]);
        $existingUser->assignRole('buyer');

        Notification::fake();

        $response = $this->postJson(route('register'), [
            'name' => 'Dmytro Kovalenko',
            'phone_number' => '4035550299',
            'email' => 'dmytro_kovalenko@hotmail.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => 'buyer',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('status', 'success');

        expect(User::query()->where('email', 'dmytro_kovalenko@hotmail.com')->count())
            ->toBe(1);

        Notification::assertSentTo($existingUser, VerifyEmailNotification::class);
    });
});

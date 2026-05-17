<?php

declare(strict_types=1);

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;

describe('User registration flow', function (): void {
    beforeEach(function (): void {
        Artisan::call('db:seed', ['--class' => RoleSeeder::class]);

        $this->withoutMiddleware(ValidateCsrfToken::class);
    });

    it('registers a new user and returns success when email sends correctly', function (): void {
        Mail::fake();

        $payload = [
            'name' => 'Dmytro Kovalenko',
            'phone_number' => '4035550199',
            'email' => 'new_user@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => 'buyer',
        ];

        $response = $this->postJson(route('register'), $payload);

        $response
            ->assertOk()
            ->assertJsonPath('status', 'success');

        expect(User::query()->where('email', 'new_user@example.com')->exists())
            ->toBeTrue();
    });

    it('creates the user and returns success even when the verification email fails to send', function (): void {
        // Simulate SMTP / email transport failure by making the Registered listener throw.
        Event::listen(Registered::class, function (): void {
            throw new RuntimeException('SMTP connection refused');
        });

        $payload = [
            'name' => 'Dmytro Kovalenko',
            'phone_number' => '4035550199',
            'email' => 'smtp_failure@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => 'buyer',
        ];

        $response = $this->postJson(route('register'), $payload);

        // Regression: before the fix, this would have returned an error response
        // because the SMTP exception propagated through the controller's single try/catch.
        $response
            ->assertOk()
            ->assertJsonPath('status', 'success');

        // Regression: the user must still be persisted despite the email failure.
        expect(User::query()->where('email', 'smtp_failure@example.com')->exists())
            ->toBeTrue();
    });

    it('resends verification email when registering with an existing unverified email', function (): void {
        Mail::fake();

        $existingUser = User::factory()->create([
            'name' => 'Dmytro Kovalenko',
            'phone_number' => '4035550299',
            'email' => 'existing_unverified@example.com',
            'role' => 'buyer',
            'email_verified_at' => null,
        ]);
        $existingUser->assignRole('buyer');

        $payload = [
            'name' => 'Dmytro Kovalenko',
            'phone_number' => '4035550299',
            'email' => 'existing_unverified@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => 'buyer',
        ];

        $response = $this->postJson(route('register'), $payload);

        $response
            ->assertOk()
            ->assertJsonPath('status', 'success');

        expect(User::query()->where('email', 'existing_unverified@example.com')->count())
            ->toBe(1);
    });

    it('returns validation errors for invalid registration data', function (): void {
        $response = $this->postJson(route('register'), []);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'name',
                'phone_number',
                'email',
                'password',
                'role',
            ]);
    });
});

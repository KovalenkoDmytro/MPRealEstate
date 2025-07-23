<?php

namespace App\Models;

use App\Models\User;
use Spatie\Permission\Traits\HasRoles;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string $role
 * @property string|null $lawyer_number
 * @property int $is_buyer_lawyer
 * @property int $is_seller_lawyer
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Deal> $deals
 * @property-read int|null $deals_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\RealEstateListing> $favoriteListings
 * @property-read int|null $favorite_listings_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\RealEstateListing> $listings
 * @property-read int|null $listings_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Permission> $permissions
 * @property-read int|null $permissions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Role> $roles
 * @property-read int|null $roles_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seller newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seller newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seller permission($permissions, $without = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seller query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seller role($roles, $guard = null, $without = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seller whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seller whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seller whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seller whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seller whereIsBuyerLawyer($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seller whereIsSellerLawyer($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seller whereLawyerNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seller whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seller wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seller whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seller whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seller whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seller withoutPermission($permissions)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seller withoutRole($roles, $guard = null)
 * @mixin \Eloquent
 */
class Seller extends User
{
    use HasRoles;

    protected $table = 'users'; // ✅ Uses the same table as User

    public static function onlySellers(): \App\Models\User {
        return User::whereHas('roles', function ($q) {
            $q->where('name', 'seller');
        });
    }

    public function listings(): Seller|\Illuminate\Database\Eloquent\Relations\HasMany {
        return $this->hasMany(RealEstateListing::class, 'seller_id');
    }

}




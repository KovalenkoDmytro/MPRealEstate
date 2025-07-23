<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Spatie\Permission\Traits\HasRoles;

/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Deal> $deals
 * @property-read int|null $deals_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\RealEstateListing> $favoriteListings
 * @property-read int|null $favorite_listings_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Permission> $permissions
 * @property-read int|null $permissions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Role> $roles
 * @property-read int|null $roles_count
 * @method static Builder<static>|Buyer newModelQuery()
 * @method static Builder<static>|Buyer newQuery()
 * @method static Builder<static>|Buyer permission($permissions, $without = false)
 * @method static Builder<static>|Buyer query()
 * @method static Builder<static>|Buyer role($roles, $guard = null, $without = false)
 * @method static Builder<static>|Buyer withoutPermission($permissions)
 * @method static Builder<static>|Buyer withoutRole($roles, $guard = null)
 * @mixin \Eloquent
 */
class Buyer extends User
{
    use HasRoles;
}

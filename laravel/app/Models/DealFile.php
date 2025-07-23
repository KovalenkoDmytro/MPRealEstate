<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $deal_id
 * @property string $file_name
 * @property string $file_path
 * @property string $author_email
 * @property string $author_name
 * @property string|null $file_type
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Deal $deal
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DealFile newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DealFile newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DealFile query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DealFile whereAuthorEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DealFile whereAuthorName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DealFile whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DealFile whereDealId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DealFile whereFileName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DealFile whereFilePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DealFile whereFileType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DealFile whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DealFile whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class DealFile extends Model
{
    use HasFactory;

    protected $fillable = ['deal_id', 'file_name', 'file_path', 'file_type', 'author_name', 'author_email'];

    public function deal(): \Illuminate\Database\Eloquent\Relations\BelongsTo {
        return $this->belongsTo(Deal::class);
    }
}

<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Column extends Model {
    protected $fillable = ['title','order'];
    public function cards() {
        return $this->hasMany(Card::class)->orderBy('order');
    }
}

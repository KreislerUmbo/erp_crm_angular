<?php

namespace App\Models\Proforma;

use App\Models\Configuration\ProductCategorie;
use App\Models\Product\Product;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProformaDetail extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable=[
        "proforma_id",
        "product_id",
        "product_categorie_id",
        "cantidad",
        "precio_unit",
        "descuento",
        "subtotal",
        "total",
    ];

    public function setCreatedAtAttribute($value)
    {
       date_default_timezone_set("America/Lima");
       $this->attributes["created_at"] = Carbon::now();
    }
 
    public function setUpdatedsAtAttribut($value)
    {
       date_default_timezone_set("America/Lima");
       $this->attributes["updated_at"] = Carbon::now();
    }

    public function proforma(){
        return $this->belongsTo(Proforma::class,"proforma_id");
    }

    public function product(){
        return $this->belongsTo(Product::class,"product_id");
    }

    public function product_categorie(){
        return $this->belongsTo(ProductCategorie::class,"product_categorie_id");
    }

}

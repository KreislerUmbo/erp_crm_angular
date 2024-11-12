<?php

namespace App\Models\Product;

use App\Models\Configuration\ProductCategorie;
use App\Models\Configuration\Provider;
use App\Models\Configuration\Unit;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Product extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "title",
        "product_categorie_id",
        "imagen",
        "sku",
        "barcode",
        "price_general",
        "description",
        "specifications",
        "is_gratuito",
        "min_descuento",
        "max_descuento",
        "umbral",
        "umbral_unit_id",
        "provider_id",
        "disponibilidad",
        "state",
        "tiempo_de_abastecimiento",
        "is_descount",
        "tax_selected",
        "importe_iva",
        "peso",
        "ancho",
        "alto",
        "largo",
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

    public function umbral_unit()
    {
        return $this->belongsTo(Unit::class, "umbral_unit_id");
    }

    public function product_categorie()
    {
        return $this->belongsTo(ProductCategorie::class, "product_categorie_id");
    }
    public function provider()
    {
        return $this->belongsTo(Provider::class, "provider_id");
    }
    public function wallets()
    {
        return $this->hasMany(ProductWallet::class);
    }
    public function warehouse()
    {
        return $this->hasMany(ProductWarehouse::class);
    }

    public function scopeFilterAdvance(
        $query,
        $search,
        $product_categorie_id,
        $disponibilidad,
        $tax_selected,
        $sucursale_precio_multiple,
        $almacen_warehouse,
        $segmentclient_precio_multiple
    ) {

        if ($search) {
            $query->where(DB::raw("CONCAT(products.title,' ',IFNULL(products.sku,''))"), "like", "%" . $search . "%");
        }
        if ($product_categorie_id) {
            $query->where("product_categorie_id", $product_categorie_id);
        }
        if ($disponibilidad) {
            $query->where("disponibilidad", $disponibilidad);
        }
        if ($tax_selected) {
            $query->where("tax_selected", $tax_selected);
        }
        if ($sucursale_precio_multiple) {
            $query->whereHas("wallets", function ($subconsulta) use ($sucursale_precio_multiple) {
                $subconsulta->where("sucursal_id", $sucursale_precio_multiple);
            });
        }

        if ($segmentclient_precio_multiple) {
            $query->whereHas("wallets", function ($subconsulta) use ($segmentclient_precio_multiple) {
                $subconsulta->where("client_segment_id", $segmentclient_precio_multiple);
            });
        }
        if ($almacen_warehouse) {
            $query->whereHas("warehouse", function ($subconsulta) use ($almacen_warehouse) {
                $subconsulta->where("warehouse_id", $almacen_warehouse);
            });
        }

        return $query;
    }
}

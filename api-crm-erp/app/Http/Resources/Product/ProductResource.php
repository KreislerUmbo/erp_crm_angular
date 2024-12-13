<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
       $units=collect([]);
       foreach ($this->resource->wallets->groupBy("unit_id") as  $unit_only) {
        $units->push($unit_only[0]->unit); //unit es nombre de la relacion que est en modelo productWallet
       }
       
        return [
            "id" => $this->resource->id,
            "title" => $this->resource->title,
            "product_categorie_id" => $this->resource->product_categorie_id,
            "product_categorie" => [
                "id" => $this->resource->product_categorie->id,
                "name" => $this->resource->product_categorie->name,
            ],
            "imagen" => env("APP_URL") . "storage/" . $this->resource->imagen,
            "sku" => $this->resource->sku,
            "barcode" => $this->resource->barcode,
            "price_general" => $this->resource->price_general,
            "description" => $this->resource->description,
            "specifications" => $this->resource->specifications,
            "is_gratuito" => $this->resource->is_gratuito,
            "min_descuento" => $this->resource->min_descuento,
            "max_descuento" => $this->resource->max_descuento,
            "umbral" => $this->resource->umbral,
            "umbral_unit_id" => $this->resource->umbral_unit_id,
            "umbral_unit" => $this->resource->umbral_unit ? [
                "id" => $this->resource->umbral_unit->id,
                "name" => $this->resource->umbral_unit->name,
            ] : null,
            "disponibilidad" => $this->resource->disponibilidad,
            "state" => $this->resource->state,

            "tiempo_de_abastecimiento" => $this->resource->tiempo_de_abastecimiento,
            "is_descount" => $this->resource->is_descount,
            "tax_selected" => $this->resource->tax_selected,
            "importe_iva" => $this->resource->importe_iva,
            "peso" => $this->resource->peso,
            "ancho" => $this->resource->ancho,
            "alto" => $this->resource->alto,
            "largo" => $this->resource->largo,

            //relaciones 
            "wallets" => $this->resource->wallets->map(function ($wallet) {
                return [
                    "id" => $wallet->id,
                    "unit" => $wallet->unit,
                    "sucursale" => $wallet->sucursale,
                    "client_segment" => $wallet->client_segment,
                    "precio" => $wallet->price,
                    "sucursale_precio_multiple" => $wallet->sucursale ? $wallet->sucursale->id : null,
                    "segmentclient_precio_multiple" => $wallet->client_segment ? $wallet->client_segment->id : null,
                ];
            }),
            "warehouses" => $this->resource->warehouse->map(function ($warehouse) {
                return [
                    "id" => $warehouse->id,
                    "unit" => $warehouse->unit,
                    "warehouse" => $warehouse->warehouse,//"warehouse" viene del front angualar y warehouse deber ser los mismo que nombre de la relaacion en el model ProducWarehouse
                    "quantity" => $warehouse->stock, //"quantity" viene del front angualar y stock ddeber ser los mismo que model ProducWarehouse
                ];
            }),
            
            "units"=>$units,
        ];
    }
}

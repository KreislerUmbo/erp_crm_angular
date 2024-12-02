<?php

namespace App\Http\Resources\Client;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->resource->id,
            "name" => $this->resource->name,
            "surname" => $this->resource->surname,
            "full_name" => $this->resource->full_name,
            "client_segment_id" => $this->resource->client_segment_id,
            "client_segment" => $this->resource->client_segment ? [
                "id" => $this->resource->client_segment->id,
                "name" => $this->resource->client_segment->name,
            ] : NULL,
            "phone" => $this->resource->phone,
            "email" => $this->resource->email,
            "type" => $this->resource->type,
            "origen" => $this->resource->origen,
            "type_document_id" => $this->resource->type_document_id,
            "tipo_document_ident" => $this->resource->tipo_document_ident ? [
                "id" => $this->resource->tipo_document_ident->id,
                "name" => $this->resource->tipo_document_ident->name,
            ] : NULL,
            "nro_document" => $this->resource->nro_document,
            "birthdate" => $this->resource->birthdate ? Carbon::parse($this->resource->birthdate)->format("Y-m-d") : NULL,
            "sexo" => $this->resource->sexo,
            "sucursale_id" => $this->resource->sucursale_id,
            "sucursale" => $this->resource->sucursale ? [
                "id" => $this->resource->sucursale->id,
                "name" => $this->resource->sucursale->name,
            ] : NULL,
            "asesor_id" => $this->resource->asesor_id,
            "asesor" => $this->resource->asesor ? [
                "id" => $this->resource->asesor->id,
                "full_name" => $this->resource->asesor->name . ' ' . $this->resource->asesor->surname,
            ] : NULL,
            "is_parcial" => $this->resource->is_parcial,
            "address" => $this->resource->address,
            "ubigeo_distrito" => $this->resource->ubigeo_distrito,
            "ubigeo_provincia" => $this->resource->ubigeo_provincia,
            "ubigeo_region" => $this->resource->ubigeo_region,
            "distrito" => $this->resource->distrito,
            "provincia" => $this->resource->provincia,
            "region" => $this->resource->region,
            "state" => $this->resource->state,
            "created_at" => $this->resource->created_at->format("y-m-d h:i:s A"),
        ];
    }
}

<?php

namespace App\Imports;

use Illuminate\Support\Str;
use App\Models\Client\Client;
use App\Models\Configuration\ClientSegment;
use App\Models\Configuration\Sucursale;
use App\Models\Configuration\TipoDocumentIdent;
use App\Models\User;
use Illuminate\Support\Facades\File;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class ClientsImport implements ToModel, WithHeadingRow, WithValidation
{
    use Importable, SkipsErrors;




    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */




    public function model(array $row)
    {
        $name = $row["nombre"];
        $surname = $row["apellido"];
        $full_name = $row["nombre"] || $row["apellido"] ? $row["nombre"] . ' ' . $row["apellido"] : $row["razon_social"];
        $phone = $row["telefono"];
        $email = $row["correo"];

        $tipo_documento = TipoDocumentIdent::where("name", $row["tipo_documento"])->first();
        if (!$tipo_documento) {
            return Client::first();
        }
        $nro_document = $row["numero_documento"];
        $address = $row["direccion"];
        $origen = $row["origen"];


        $client_segment = ClientSegment::where("name", "like" . "%" . trim($row["tipo_de_cliente"]) . "%")->first();
        $sucursale = Sucursale::where("name", "like" . "%" . trim($row["sucursal"]) . "%")->first();
        $user = User::where("email", trim($row["asesor"]))->first();

        //AQUI UBICAMOS LOS ARCHIVOS DE UBIGEO Y LE ADERIMOS A UN JSON
        $REGIONES = File::json(base_path('public/JSON/regiones.json'));
        $PROVINCIAS = File::json(base_path('public/JSON/provincias.json'));
        $DISTRITOS = File::json(base_path('public/JSON/distritos.json'));

        $REGION_SELECTED = null;
        foreach ($REGIONES as $key => $REGION) {
            if (Str::upper($REGION["name"]) == Str::upper(trim($row["region"]))) {
                $REGION_SELECTED = $REGION;
                break;
            }
        }

        $PROVINCIA_SELECTED = null;
        foreach ($PROVINCIAS as $key => $PROVINCIA) {
            if (
                $REGION_SELECTED && $PROVINCIA["department_id"] == $REGION_SELECTED["id"] &&
                Str::upper($PROVINCIA["name"]) == Str::upper(trim($row["provincia"]))
            ) {
                $PROVINCIA_SELECTED = $PROVINCIA;
                break;
            }
        }

        $DISTRITO_SELECTED = null;
        foreach ($DISTRITOS as $key => $DISTRITO) {
            if (
                $REGION_SELECTED &&  $DISTRITO["department_id"] == $REGION_SELECTED["id"] &&
                $PROVINCIA_SELECTED && $DISTRITO["province_id"]== $PROVINCIA_SELECTED["id"] &&
                Str::upper($DISTRITO["name"]) == Str::upper(trim($row["distrito"]))
            ) {
                $DISTRITO_SELECTED = $DISTRITO;
                break;
            }
        }

        $origen = "";
        switch ($row["origen"]) {
            case 'FACEBOOK':
                $origen = 1;
                break;
            case 'INSTAGRAM':
                $origen = 2;
                break;
            case 'WHATSAPP':
                $origen = 3;
                break;
            case 'GOOGLE':
                $origen = 4;
                break;
            case 'TIKTOK':
                $origen = 5;
                break;

            default:
                # code...
                break;
        }



        return new Client([
            "name" => $name,
            "surname" => $surname,
            "full_name" => $full_name,
            "client_segment_id" => $client_segment ? $client_segment->id : 1,
            "phone" => $phone,
            "email" => $email ? $email:NULL,
            "type" => $row["nombre"] || $row["apellido"] ? 1 : 2,
            "type_document_id" => $tipo_documento->id,
            "nro_document" => $nro_document,
            "origen" => $origen,

            "sucursale_id" => $sucursale ? $sucursale->id : 1,
            "asesor_id" => $user ? $user->id : 1,
            "address" => $address,
            "ubigeo_distrito" => $DISTRITO_SELECTED ? $DISTRITO_SELECTED["id"] : NULL,
            "ubigeo_provincia" => $PROVINCIA_SELECTED ? $PROVINCIA_SELECTED["id"] : NULL,
            "ubigeo_region" => $REGION_SELECTED ? $REGION_SELECTED["id"] : NULL,

            "region" => $row["region"],
            "provincia" => $row["provincia"],
            "distrito" => $row["distrito"],
            "state" => 1,
        ]);
    }

    public function rules(): array
    {
        return [
/*             '*.telefono' => ['required'],
            '*.tipo_de_cliente' => ['required'],
            '*.origen' => ['required'],
            '*.tipo_documento' => ['required'],
            '*.numero_documento' => ['required'],
            '*.region' => ['required'],
            '*.provincia' => ['required'],
            '*.distrito' => ['required'],
            '*.sucursal' => ['required'], */
        ];
    }
}

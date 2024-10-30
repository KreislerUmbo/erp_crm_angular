<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Models\Configuration\Sucursale;
use Illuminate\Http\Request;

use function Laravel\Prompts\search;

class SucursaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get("search");
        $sucursales = Sucursale::where("name", "like", "%" . $search . "%")
            ->orderBy("id", "desc")
            ->paginate(25);

        return response()->json([
            "total" => $sucursales->total(),
            "sucursales" => $sucursales->map(function ($sucursal) {
                return [
                    "id" => $sucursal->id,
                    "name" => $sucursal->name,
                    "address" => $sucursal->address,
                    "state" => $sucursal->state ?? 1,
                    "create_format_at" => $sucursal->created_at->format("d-m-Y   h:i A"),
                ];
            }),

        ]);
    }

public function config(){
    $sucursales= Sucursale::where("state",1)->orderBy("id","desc")->get();
    return response()->json([
        "sucursales"=>$sucursales->map(function($sucursal){
            return[
                "id"=>$sucursal->id,
                "name"=>$sucursal->name,
            ];
        }),

    ]);
}




    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $is_exists_sucursal = Sucursale::where("name", $request->name)->first();
        if ($is_exists_sucursal) {
            return response()->json([
                "message" => 403,
                "message_text" => "LA SUCURSAL YA EXISTE"
            ]);
        }

        $sucursal = Sucursale::create($request->all());

        return response()->json([
            "message" => 200,
            "sucursal" => [
                "id" => $sucursal->id,
                "name" => $sucursal->name,
                "address" => $sucursal->address,
                "state" => $sucursal->state,
                "create_format_at" => $sucursal->created_at->format("Y-m-d h:i A"),
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $is_exists_sucursal = Sucursale::where("name", $request->name)
            ->where("id", "<>", $id)
            ->first();
        if ($is_exists_sucursal) {
            return response()->json([
                "message" => 403,
                "message_text" => "LA SUCURSAL YA EXISTE"
            ]);
        }

        $sucursal = Sucursale::findOrFail($id);
        $sucursal->update($request->all());

        return response()->json([
            "message" => 200,
            "sucursal" => [
                "id" => $sucursal->id,
                "name" => $sucursal->name,
                "address" => $sucursal->address,
                "state" => $sucursal->state,
                "create_format_at" => $sucursal->created_at->format("Y-m-d h:i A"),
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $sucursal = Sucursale::findOrFail($id);
        //validacion por proforma

        $sucursal->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}

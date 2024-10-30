<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Models\Configuration\Sucursale;
use App\Models\Configuration\Warehouse;
use Illuminate\Http\Request;

class WarehouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get("search");
        $warehouses = Warehouse::where("name", "like", "%" . $search . "%")
            ->orderBy("id", "desc")
            ->paginate(25);

        $sucursales = Sucursale::where("state", 1)->orderBy("id", "desc")->get();

        return response()->json([
            "total" => $warehouses->total(),
            "warehouses" => $warehouses->map(function ($warehouse) {
                return [
                    "id" => $warehouse->id,
                    "name" => $warehouse->name,
                    "address" => $warehouse->address,
                    "state" => $warehouse->state,
                    "sucursale_id" => $warehouse->sucursale_id,
                    "sucursale" => $warehouse->sucursale,
                    "create_format_at" => $warehouse->created_at->format("d-m-Y   h:i A"),
                ];
            }),
            
            "sucursales" => $sucursales->map(function ($sucursal) {
                return [
                    "id" => $sucursal->id,
                    "name" => $sucursal->name,
                ];
            }),
        ]);
    }


    public function config()
    { //para listar susucrsales
        $sucursales = Sucursale::where("state", 1)->orderBy("id", "desc")->get();
        return response()->json([
            "sucursales" => $sucursales->map(function ($sucursal) {
                return [
                    "id" => $sucursal->id,
                    "name" => $sucursal->name,
                ];
            }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $is_exists_warehouse = Warehouse::where("name", $request->name)->first();
        if ($is_exists_warehouse) {
            return response()->json([
                "message" => 403,
                "message_text" => "YA EXISTE UN ALMACEN CON EL MISMO NOMBRE"
            ]);
        }

        $warehouse = Warehouse::create($request->all());
        return response()->json([
            "message" => 200,
            "warehouse" => [
                "id" => $warehouse->id,
                "name" => $warehouse->name,
                "address" => $warehouse->address,
                "state" => $warehouse->state,
                "sucursale_id" => $warehouse->sucursale_id,
                "sucursale" => $warehouse->sucursale,
                "create_format_at" => $warehouse->created_at->format("d-m-Y   h:i A"),
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
        $is_exists_warehouse = Warehouse::where("name", $request->name)
            ->where("id", "<>", $id)
            ->first();
            
        if ($is_exists_warehouse) {
            return response()->json([
                "message" => 403,
                "message_text" => "EL ALAMCEN YA EXISTE"
            ]);
        }

        $warehouse = Warehouse::findOrFail($id);
        $warehouse->update($request->all());

        return response()->json([
            "message" => 200,
            "warehouse" => [
                "id" => $warehouse->id,
                "name" => $warehouse->name,
                "address" => $warehouse->address,
                "state" => $warehouse->state,
                "sucursale_id" => $warehouse->sucursale_id,
                "sucursale" => $warehouse->sucursale,
                "create_format_at" => $warehouse->created_at->format("d-m-Y   h:i A"),
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $warehouse = Warehouse::findOrFail($id);
        //validacion por compra y stok de productos

        $warehouse->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}
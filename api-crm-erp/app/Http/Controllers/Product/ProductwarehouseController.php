<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product\ProductWarehouse;
use Illuminate\Http\Request;

class ProductwarehouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $product_warehouse = ProductWarehouse::create([
            "product_id" => $request->product_id,
            "unit_id" => $request->unit_id,
            "warehouse_id" => $request->warehouse_id,
            "stock" => $request->quantity,
        ]);
        return response()->json(
            [
                "message" => 200,
                "product_warehouse" => [
                    "id" => $product_warehouse->id,
                    "unit" => $product_warehouse->unit,
                    "warehouse" => $product_warehouse->warehouse,//"warehouse" viene del front angualar y warehouse deber ser los mismo que nombre de la relaacion en el model ProducWarehouse
                    "quantity" => $product_warehouse->stock,
                ]
            ]
        );
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
        $product_warehouse = ProductWarehouse::findOrfail($id);
        $product_warehouse -> update([
           // "product_id" => $request->product_id,
            "unit_id" => $request->unit_id,
            "warehouse_id" => $request->warehouse_id,
            "stock" => $request->quantity,
        ]);
        return response()->json(
            [
                "message" => 200,
                "product_warehouse" => [
                    "id" => $product_warehouse->id,
                    "unit" => $product_warehouse->unit,
                    "warehouse" => $product_warehouse->warehouse,//"warehouse" viene del front angualar y warehouse deber ser los mismo que nombre de la relaacion en el model ProducWarehouse
                    "quantity" => $product_warehouse->stock,
                ]
            ]
        );
    
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product_warehouse = ProductWarehouse::findOrfail($id);
        $product_warehouse->delete();
        return response()->json([
            "message"=>200,
        ]);
    }
}

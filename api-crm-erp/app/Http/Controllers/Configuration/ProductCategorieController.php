<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Models\Configuration\ProductCategorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductCategorieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get("search");
        $product_categories = ProductCategorie::where("name", "like", "%" . $search . "%")
            ->orderBy("id", "desc")
            ->paginate(25);

        return response()->json([
            "total" => $product_categories->total(),
            "product_categories" => $product_categories->map(function ($product_categorie) {
                return [
                    "id" => $product_categorie->id,
                    "name" => $product_categorie->name,
                    "imagen" => $product_categorie->imagen ? env("APP_URL") . "storage/" . $product_categorie->imagen : NULL,
                    "state" => $product_categorie->state ?? 1,
                    "create_format_at" => $product_categorie->created_at->format("d-m-Y   h:i A"),
                ];
            }),

        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $is_exists_productcategorie = ProductCategorie::where("name", $request->name)->first();
        if ($is_exists_productcategorie) {
            return response()->json([
                "message" => 403,
                "message_text" => "EL NOMBRE DE LA CATEGORIA YA EXISTE"
            ]);
        }
        //como hay una img  por guardar entonces hacemos
        if ($request->hasFile("categorie_imagen")) {
            $path = Storage::putFile("categories", $request->file("categorie_imagen"));
            $request->request->add(["imagen" => $path]);
        }

        $product_categorie = ProductCategorie::create($request->all());

        return response()->json([
            "message" => 200,
            "product_categorie" => [
                "id" => $product_categorie->id,
                "name" => $product_categorie->name,
                "imagen" => $product_categorie->imagen ? env("APP_URL") . "storage/" . $product_categorie->imagen : NULL,
                "state" => $product_categorie->state ?? 1,
                "create_format_at" => $product_categorie->created_at->format("d-m-Y   h:i A"),
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
        $is_exists_productcategorie = ProductCategorie::where("name", $request->name)
            ->where("id", "<>", $id)
            ->first();

        if ($is_exists_productcategorie) {
            return response()->json([
                "message" => 403,
                "message_text" => "EL NOMBRE DE LA CATEGORIA YA EXISTE"
            ]);
        }

        $product_categorie = ProductCategorie::findOrFail($id); //para sacar el id

        //como hay una img  por guardar entonces hacemos
        if ($request->hasFile("categorie_imagen")) {
            //validamos si hay para borrarla
            if ($product_categorie->imagen) {
                Storage::delete($product_categorie->imagen);
            }
            $path = Storage::putFile("categories", $request->file("categorie_imagen"));
            $request->request->add(["imagen" => $path]);
        }


        $product_categorie->update($request->all());

        return response()->json([
            "message" => 200,
            "product_categorie" => [
                "id" => $product_categorie->id,
                "name" => $product_categorie->name,
                "imagen" => $product_categorie->imagen ? env("APP_URL") . "storage/" . $product_categorie->imagen : NULL,
                "state" => $product_categorie->state ?? 1,
                "create_format_at" => $product_categorie->created_at->format("d-m-Y   h:i A"),
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product_categorie = ProductCategorie::findOrFail($id);
        //validacion por PRODUCTO

        $product_categorie->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}

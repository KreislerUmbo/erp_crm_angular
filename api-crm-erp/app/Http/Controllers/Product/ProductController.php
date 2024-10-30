<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Resources\Product\ProductCollection;
use App\Http\Resources\Product\ProductResource;
use App\Models\Configuration\ClientSegment;
use App\Models\Configuration\ProductCategorie;
use App\Models\Configuration\Provider;
use App\Models\Configuration\Sucursale;
use App\Models\Configuration\Unit;
use App\Models\Configuration\Warehouse;
use App\Models\Product\Product;
use App\Models\Product\ProductWallet;
use App\Models\Product\ProductWarehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;
        $product_categorie_id = $request->product_categorie_id;
        $disponibilidad = $request->disponibilidad;
        $tax_selected = $request->tax_selected;
        //filtro especial
        $sucursale_precio_multiple = $request->sucursale_precio_multiple;
        $almacen_warehouse = $request->almacen_warehouse;
        $segmentclient_precio_multiple = $request->segmentclient_precio_multiple;

        //where("title", "like", "%" . $search . "%")
        $products = Product::filterAdvance(
            $search,
            $product_categorie_id,
            $disponibilidad,
            $tax_selected,
            $sucursale_precio_multiple,
            $almacen_warehouse,
            $segmentclient_precio_multiple
        )
            ->orderBy("id", "desc")
            ->paginate(25);

        return response()->json([
            "total" => $products->total(),
            "products" =>  ProductCollection::make($products),

        ]);
    }


    public function config()
    {
        $almacenes = Warehouse::where("state", 1)->get();
        $sucursales = Sucursale::where("state", 1)->get();
        $units = Unit::where("state", 1)->get();
        $segment_clients = ClientSegment::where("state", 1)->get();
        $categories = ProductCategorie::where("state", 1)->get();
       // $providers = Provider::where("state", 1)->get();

        return response()->json([
            "almacenes" => $almacenes,
            "sucursales" => $sucursales,
            "units" => $units,
            "segment_clients" => $segment_clients,
            "categories" => $categories,
           // "providers"=>$providers,
        ]);
    }


    public function store(Request $request)
    {
        $is_exists_product = Product::where("title", $request->name)->first();
        if ($is_exists_product) {
            return response()->json([
                "message" => 403,
                "message_text" => "EL NOMBRE DEL PRODUCTO YA EXISTE"
            ]);
        }
        //como hay una img  por guardar entonces hacemos
        if ($request->hasFile("product_imagen")) {
            $path = Storage::putFile("products", $request->file("product_imagen"));
            $request->request->add(["imagen" => $path]);
        }

        $product = Product::create($request->all());


        $WAREHOUSES_PRODUCT = json_decode($request->WAREHOUSES_PRODUCT, true);

        foreach ($WAREHOUSES_PRODUCT as $key => $WAREHOUSES_PROD) {
            ProductWarehouse::create([
                "product_id" => $product->id,
                "unit_id" => $WAREHOUSES_PROD["unit"]["id"],
                "warehouse_id" => $WAREHOUSES_PROD["warehouse"]["id"],
                "stock" => $WAREHOUSES_PROD["quantity"],
            ]);
        }

        $WALLET_PRODUCTS = json_decode($request->WALLET_PRODUCTS, true);
        foreach ($WALLET_PRODUCTS as $key => $WALLET_PROD) {
            ProductWallet::create([
                "product_id" => $product->id,
                "unit_id" => $WALLET_PROD["unit"]["id"],
                "client_segment_id" => isset($WALLET_PROD["client_segment"]) ? $WALLET_PROD["client_segment"]["id"] : null, //en caso de ser vaccio se realiza una condicion ya que son campos no obligatorios
                "sucursal_id" => isset($WALLET_PROD["sucursale"]) ? $WALLET_PROD["sucursale"]["id"] : null, //en caso de ser vaccio se realiza una condicion ya que son campos no obligatorios
                "price" => $WALLET_PROD["precio"],
            ]);
        }

        return response()->json([
            "message" => 200,
        ]);
    }




    public function show(string $id)
    {
        $product = Product::findOrFail($id);
        return response()->json([
            "product" => ProductResource::make($product),
        ]);
    }




    public function update(Request $request, string $id)
    {
        $is_exists_product = Product::where("title", $request->name)
            ->where("id", "<>", $id)
            ->first();

        if ($is_exists_product) {
            return response()->json([
                "message" => 403,
                "message_text" => "EL NOMBRE DEL PRODUCTO YA EXISTE"
            ]);
        }

        $product = Product::findOrFail($id); //para sacar el id

        //como hay una img  por guardar entonces hacemos
        if ($request->hasFile("product_imagen")) {
            //validamos si hay para borrarla
            if ($product->imagen) {
                Storage::delete($product->imagen);
            }
            $path = Storage::putFile("products", $request->file("product_imagen"));
            $request->request->add(["imagen" => $path]);
        }


        $product->update($request->all());

        return response()->json([
            "message" => 200,

        ]);
    }



    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        //validacion por Proforma

        $product->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}

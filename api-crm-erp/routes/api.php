<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Configuration\ClientSegmentController;
use App\Http\Controllers\Configuration\MethodPaymentController;
use App\Http\Controllers\Configuration\ProductCategorieController;
use App\Http\Controllers\Configuration\ProviderController;
use App\Http\Controllers\Configuration\SucursaleController;
use App\Http\Controllers\Configuration\SucursaleDeliverieController;
use App\Http\Controllers\Configuration\UnitController;
use App\Http\Controllers\Configuration\WarehouseController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Product\ProductWalletController;
use App\Http\Controllers\Product\ProductwarehouseController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\UserAccessController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([
 
  //  'middleware' => 'auth:api',
    'prefix' => 'auth',
   // 'middleware'=>['auth:api'],//,'role:Super-Admin'
], function ($router) {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::post('/refresh', [AuthController::class, 'refresh'])->name('refresh');
    Route::post('/me', [AuthController::class, 'me'])->name('me');
});


Route::group([
    'middleware' => 'auth:api',
], function ($router) {
    Route::resource("roles",RolePermissionController::class);
    Route::post("/users/{id}",[UserAccessController::class,'update']);
    Route::get("/users/config",[UserAccessController::class,'config']);
    Route::resource("users",UserAccessController::class);

    Route::resource("/sucursales",SucursaleController::class);
    Route::resource('/warehouses', WarehouseController::class);
    Route::resource('/sucursal_deliveries',SucursaleDeliverieController ::class);
    Route::resource('/method_payments',MethodPaymentController ::class);
    Route::resource('/client_segments',ClientSegmentController ::class);
    
    Route::post("/product_categories/{id}",[ProductCategorieController::class,'update']);//para poder atuallizar la imagen de prouctategorie ademas va como post y no  como put
    Route::resource('/product_categories',ProductCategorieController ::class);

    Route::post("/providers/{id}",[ProviderController::class,'update']);//para poder atuallizar la imagen de prouctategorie ademas va como post y no  como put
    Route::resource('/providers',ProviderController::class);

    Route::post("/units/add-transform",[UnitController::class,'add_transform']);
    Route::delete("/units/delete-transform/{id}",[UnitController::class,'delete_transform']);
    Route::resource('/units',UnitController::class);

    Route::post("/products/index",[ProductController::class,'index']);
    Route::post("/products/import",[ProductController::class,'import_product']);
    Route::post("/products/{id}",[ProductController::class,'update']);
    Route::get("/products/config",[ProductController::class,'config']);
    Route::resource('products',ProductController ::class);

    Route::resource("product_wallets",ProductWalletController::class);
    Route::resource("product_warehouses",ProductwarehouseController::class);
    
});

Route::get("excel/export-products",[ProductController::class,"export_products"]);
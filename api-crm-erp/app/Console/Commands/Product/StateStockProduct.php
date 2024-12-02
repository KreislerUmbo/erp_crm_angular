<?php

namespace App\Console\Commands\Product;

use App\Models\Product\Product;
use Illuminate\Console\Command;

class StateStockProduct extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'product:state-stocks';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Asignal al producto 3 estados(1=Esta Disponible, 2= Por Agotar, 3= Agotado)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $products = Product::where("state", 1)->get();
        foreach ($products as $key => $product) {
            if ($product->umbral_unit_id) {
                $umbral = $product->umbral; //umbral esta definido en el modelo,, nota esto es la cantidad
                $umbral_unit_id = $product->umbral_unit_id; // umbral_unit_id esta definido en el modelo , nota esto es la unidad(unidad, caja, paquete,etc)

                $stock_total = 0;
                $is_umbral = false;
                foreach ($product->warehouse as $key => $warehous) { //warehouse es de la relacion enel modelo , este  for recorr 

                    //calcula la suma total   del estoxk
                    $stock_total += $warehous->stock;
                    // comparar la unidad del umbral
                    if ($warehous->unit_id == $umbral_unit_id) { //$warehous->unit_id viene de la relacion del modelo producto, aqui compara si son los mismo

                        // saber si el umbral es menor o igual al estock disponible
                        if ($warehous->stock <= $umbral) { 
                           //asigna estatus de por agotar
                            $product->update([
                                "state_stock" => 2,
                            ]);
                            $is_umbral = true;
                        }
                    }
                }
                if ($stock_total == 0) {
                     //asigna estatus a agotado
                    $product->update([
                        "state_stock" => 3,
                    ]);
                } else {
                    //asigna estatus de disponible
                    if (!$is_umbral) {
                        $product->update([
                            "state_stock" => 1,
                        ]);
                    }
                }
            }
        }
    }
}

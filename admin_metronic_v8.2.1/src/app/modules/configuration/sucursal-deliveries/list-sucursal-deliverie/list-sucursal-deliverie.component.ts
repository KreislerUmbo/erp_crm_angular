import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SucursalDeliverieService } from '../service/sucursal-deliverie.service';
import { CreateSucursalDeliverieComponent } from '../create-sucursal-deliverie/create-sucursal-deliverie.component';
import { EditSucursalDeliverieComponent } from '../edit-sucursal-deliverie/edit-sucursal-deliverie.component';
import { DeleteSucursalDeliverieComponent } from '../delete-sucursal-deliverie/delete-sucursal-deliverie.component';

@Component({
  selector: 'app-list-sucursal-deliverie',
  templateUrl: './list-sucursal-deliverie.component.html',
  styleUrls: ['./list-sucursal-deliverie.component.scss']
})
export class ListSucursalDeliverieComponent {
  
  search: string = '';
  SUCURSAL_DELIVERIES: any = [];
  isLoading$: any;
  totalPages: number = 0;
  currentPage: number = 1;

  constructor(
    public modalService: NgbModal,
    public sucursalDeliverieService: SucursalDeliverieService,
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.sucursalDeliverieService.isLoading$;
    this.listSucursalDeliveries()
  }

  listSucursalDeliveries(page = 1) {
    this.sucursalDeliverieService.listSucursalDeliveries(page, this.search).subscribe((resp: any) => {
      console.log(resp);
      this.SUCURSAL_DELIVERIES = resp.sucursal_deliveries;// sucursales-> es el nombbre debe ser igual al que se puso en index de controller laravel
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event: any) {
    this.listSucursalDeliveries($event)
  }

  createSucursalDeliverie() {
    const modalRef = this.modalService.open(CreateSucursalDeliverieComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.SucursalDeliverieC.subscribe((sucursal_deliveries: any) => {
      this.SUCURSAL_DELIVERIES.unshift(sucursal_deliveries);
    })
  }
 
  editSucursalDeliverie(SUCURSAL_DELIVERIES: any) {

    const modalRef = this.modalService.open(EditSucursalDeliverieComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.SUCURSAL_DELIVERIE_SELECTED = SUCURSAL_DELIVERIES;
    modalRef.componentInstance.SucursalDeliverieE.subscribe((sucursal_deliveries: any) => {
      let INDEX = this.SUCURSAL_DELIVERIES.findIndex((sucursal_deliveries: any) => sucursal_deliveries.id == SUCURSAL_DELIVERIES.id);
      if (INDEX != -1) {
        this.SUCURSAL_DELIVERIES[INDEX] = sucursal_deliveries;
      } 
    })
  } 

  deleteSucursalDeliverie(SUCURSAL_DELIVERIES: any) {

    const modalRef = this.modalService.open(DeleteSucursalDeliverieComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.SUCURSAL_DELIVERIE_SELECTED = SUCURSAL_DELIVERIES;

    modalRef.componentInstance.SucursalDeliverieD.subscribe((sucursal_deliveries: any) => {
      let INDEX = this.SUCURSAL_DELIVERIES.findIndex((sucursal_deliveries: any) => sucursal_deliveries.id == sucursal_deliveries.id);
      if (INDEX != -1) {
        this.SUCURSAL_DELIVERIES.splice(INDEX,1);
      } 
    })
  } 


}

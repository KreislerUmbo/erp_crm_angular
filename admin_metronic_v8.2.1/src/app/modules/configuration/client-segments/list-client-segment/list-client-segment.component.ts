import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientSegmentService } from '../service/client-segment.service';
import { CreateClientSegmentComponent } from '../create-client-segment/create-client-segment.component';
import { EditClientSegmentComponent } from '../edit-client-segment/edit-client-segment.component';
import { DeleteClientSegmentComponent } from '../delete-client-segment/delete-client-segment.component';

@Component({
  selector: 'app-list-client-segment',
  templateUrl: './list-client-segment.component.html',
  styleUrls: ['./list-client-segment.component.scss']
})
export class ListClientSegmentComponent {

  search: string = '';
  SEGMENCLIENTS: any = [];
  isLoading$: any;
  totalPages: number = 0;
  currentPage: number = 1;

  constructor(
    public modalService: NgbModal,
    public clientSegmentService: ClientSegmentService,
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.clientSegmentService.isLoading$;
    this.listClientSegments()
  }

  listClientSegments(page = 1) {
    this.clientSegmentService.listClientSegments(page, this.search).subscribe((resp: any) => {
      console.log(resp);
      this.SEGMENCLIENTS = resp.client_segments;// client_segments-> es el nombbre debe ser igual al que se puso en index de laravel
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event: any) {
    this.listClientSegments($event)
  }

   createClientSegments() {
    const modalRef = this.modalService.open(CreateClientSegmentComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.SegmetCientC.subscribe((client_segment: any) => {
      this.SEGMENCLIENTS.unshift(client_segment);
    })
  } 

   editClientSegments(SEGMENCLIENT: any) {

    const modalRef = this.modalService.open(EditClientSegmentComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.SEGMENTCLIENT_SELECTED = SEGMENCLIENT;
    modalRef.componentInstance.SegmentClientEdit.subscribe((client_segment: any) => {
      let INDEX = this.SEGMENCLIENTS.findIndex((client_segment: any) => client_segment.id == SEGMENCLIENT.id);
      if (INDEX != -1) {
        this.SEGMENCLIENTS[INDEX] = client_segment;
      } 
    })
  } 

 deleteClientSegments(SEGMENCLIENT: any) {

    const modalRef = this.modalService.open(DeleteClientSegmentComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.SEGMENTCLIENT_SELECTED = SEGMENCLIENT;

    modalRef.componentInstance.SegmentClientDelete.subscribe((client_segment: any) => {
      let INDEX = this.SEGMENCLIENTS.findIndex((client_segment: any) => client_segment.id == SEGMENCLIENT.id);
      if (INDEX != -1) {
        this.SEGMENCLIENTS.splice(INDEX,1);
      } 
    })
  } 

}

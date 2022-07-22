import { Component, OnInit } from '@angular/core';
import { SelectsService } from 'src/app/services/selects.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ServiceMainComponent } from '../service-main/service-main.component';
import * as bootstrap from 'bootstrap';
import { BehaviorSubject } from 'rxjs';
import { PostRequestService } from 'src/app/services/post-request.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-resume-mudanza',
  templateUrl: './resume-mudanza.component.html',
  styleUrls: ['./resume-mudanza.component.scss']
})
export class ResumeMudanzaComponent implements OnInit {

  mudanza: any;
  mudanzaView: any;
  places: any[] = [];
  articles: any[] = [];
  buildings: any = [];
  disableReg: boolean=false;
  msjRegisterError: any[]=[];
  constructor(
    public main: ServiceMainComponent,
    private postService: PostRequestService ,
    private selectService: SelectsService
  ) {  
    this.mudanzaView = this.main.mudanza;
    this.mudanza = this.main.mudanza;
    
  }  

  async ngOnInit() { 
    console.log(this.mudanza);
    await this.getBuildings();    
    await this.ensambleInventaryPlaces();
    await this.ensambleInventaryArticles();

    this.mudanzaView.destination.building_destin= this.buildings.find((p: any) => { return p.id ==this.mudanza.destination.building_id});
    this.mudanzaView.origin.building_origin= this.buildings.find((p: any) => { return p.id ==this.mudanza.origin.building_id})

  }  

  async ensambleInventaryPlaces(){
    await this.getPlaces();    
    for await (const [index, value] of this.mudanzaView.inventory.entries()){
      for await (const p of this.places){
        
        if (Number(p.id) == Number(value.place_id)){          
          this.mudanzaView.inventory[index].place_id =  p.id;
          this.mudanzaView.inventory[index].place_name =  p.name;
        }        
      }         
    }    
     
  }

  async ensambleInventaryArticles(){    
    await this.getArticles();
    for await (const [index, value] of this.mudanzaView.inventory.entries()){      
      for await (const [j, val] of value.items.entries()){
          for await (const ar of this.articles){
            
            if (ar.id==val){              
              this.mudanzaView.inventory[index].items[j]= Object.assign(val, {articulo: ar.name} )
            }
          }
      }    
    }
     
  }

  async getPlaces() {
    await this.selectService.getPlaces()
    .toPromise()
    .then(async (res: any) => {
      for await (const p of res.data)
        //if (p.id !== 1 && p.id !== 8){
          this.places.push(p)
        //}     
      
    })
  }

  async getArticles() {
    await this.selectService.getArticles()
    .toPromise()
    .then((res: any) => {
      this.articles = res.data;
      
    })
  }

  async getBuildings() {
    this.selectService.getBuildings()
    .toPromise()
    .then((res: any) => {
      this.buildings = res.data
    })
  }

  
  back() {
    this.main.step$.next(3);
  }

  goTo(pag: number) {
    this.main.step$.next(pag);
  }

  openSubmitedModal(){
    let submitedModal = new bootstrap.Modal(document.getElementById('submitedModal') as any, {
      keyboard: false
    })
    submitedModal?.show();
    this.disableReg=true
  }  

  openMsjErrorModal(){
    let registerError = new bootstrap.Modal(document.getElementById('registerError') as any, {
      keyboard: false
    })
    registerError?.show();
  }

  submit() {

    this.postService.saveMovingData(this.main.mudanza).subscribe(res => {
      console.log(res);
      this.openSubmitedModal();
      this.disableReg=false;
    }, ((error: HttpErrorResponse ) => {
      console.log(error.error) 
      this.msjError(error.error);
      this.disableReg=true;
    }));   
    
  }

  msjError(msjRegisterError: any){
    let msj: string[]=[];

    msj.push(msjRegisterError.message);
    
    if (msjRegisterError.errors.company_name!=undefined){
      msj.push(msjRegisterError.errors.company_name[0]);
    }
    if (msjRegisterError.errors.company_rut!=undefined){
      msj.push(msjRegisterError.errors.company_rut[0]);
    }
    if (msjRegisterError.errors.company_rut!=undefined){
      msj.push(msjRegisterError.errors.company_rut[0]);
    }
    if (msjRegisterError.errors.legal_rut!=undefined){
      msj.push(msjRegisterError.errors.legal_rut[0]);
    }
    if (msjRegisterError.errors.legal_email!=undefined){
      msj.push(msjRegisterError.errors.legal_rut[0]);
    }
    if (msjRegisterError.errors.account_type!=undefined){
      msj.push(msjRegisterError.errors.account_type[0]);
    }
    this.msjRegisterError=msj;
    this.openMsjErrorModal();
  }
}
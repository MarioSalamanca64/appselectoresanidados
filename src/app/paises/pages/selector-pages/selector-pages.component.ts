import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//switch map
import{ switchMap, tap } from 'rxjs/operators';

import { paisSmall, Pais } from '../../interfaces/paises.interface';
import { ServicesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-pages',
  templateUrl: './selector-pages.component.html',
  styles: [
  ]
})
export class SelectorPagesComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region    : ['', Validators.required],
    pais      : ['',Validators.required],
    frontera  : ['',Validators.required],
  })

  //llenar selectores
  regiones: string[]    = [];
  paises  : paisSmall[] = [];
  //fronteras: string []  = []; //antes
  fronteras: paisSmall []  = []; 
  

  //Ui
  cargando: boolean = false;


  constructor(private fb: FormBuilder,
              private paisesService: ServicesService ) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    //--cuando cambia lo que eligas en region--
    //.valueChanges
    //swicchtmap lo que hace es tomar un obserbale y lo muta en tro obserbable
    this.miFormulario.get('region')?.valueChanges
                      //pipe ayuda a trasformar el valor que este ariba que seria .get('region')?.valueChanges
                      .pipe(
                        //limpiar el formulario al momento de escoger un region y cambiarla limpiaria pais 
                        //_ no me interesa lo que venga ahi 
                        tap( ( _ ) => {
                            this.miFormulario.get('pais')?.reset('');
                            //desabilitar el campo
                            //this.miFormulario.get('frontera')?.disable();
                            //mostrar la parte de cargar pero depues se tiene que quitar
                            this.cargando = true;
                        }),
                        // aqui estara el valor producto de .get('region')?.valueChanges
                        switchMap( region => 
                          //regresa el nuevo obserbable a qui hace el switch o el cambio 
                          this.paisesService.getPaisesPorRegion( region ))
                          
                      )
                      //aqui ya se llama pais que de pendende de region
                      .subscribe ( paises => {
                        console.log(paises);
                        this.paises = paises;
                        //quietar la pantalla de cargando
                        this.cargando = false;
                        
                      })
    //--cuando cambia los que escojes en pais--
    this.miFormulario.get('pais')?.valueChanges
                    .pipe(
                      tap(() =>{
                        //frontera del formulario
                        this.miFormulario.get('frontera')?.reset('');
                        
                        //espara habilitar 
                        this.miFormulario.get('frontera')?.enable();
                        this.cargando = true;
                      }),
                      switchMap( codigo => this.paisesService.getPaisCodigo( codigo )),
                      switchMap( pais => this.paisesService.getPaisesPorCodigos( pais?.borders! ) )
                    )
                    .subscribe( paises => {
                      //console.log(pais);
                      // this.fronteras = pais?.borders || [] ;
                      this.fronteras = paises;
                      this.cargando = false;
                    })
    
                      



    //forma no optima
    // this.miFormulario.get('region')?.valueChanges
    //                 .subscribe(region =>{
    //                   console.log(region);

    //                   this.paisesService.getPaisesPorRegion(region)
    //                     .subscribe(paises => {
    //                       console.log(paises);
    //                       this.paises = paises;
    //                   })
    //                 })

  }

  guardar(){
    console.log(this.miFormulario.value);
    console.log('holamundo');
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { paisSmall, Pais } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private _baseUrl: string = 'https://restcountries.eu/rest/v2';
  // inyecion de region del api
  // _region para indicar que es privada
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  //sin gion bajo ya que es publica regreso un nuevo areglo desestruturado
  get regiones():string[] {
    return [ ... this._regiones ];
  }

  constructor( private http: HttpClient ) { }

  //crear el servicio para que traiga la informacion de este end point
  getPaisesPorRegion( region:string ):Observable<paisSmall[]>{
    const url:string = `${this._baseUrl}/region/${region}?fields=alpha3Code;name`
    return this.http.get<paisSmall[]>( url );
  }
  //llamar el servicio para decir las fronteras entre los paises
  getPaisCodigo(codigo:string): Observable<Pais | null>{
    //directiva para volver un objeto basio
    if(!codigo){
      return of(null)
    }
    const url = `${this._baseUrl}/alpha/${codigo}`;
    return  this.http.get<Pais>( url );
  }
  //espara cambiar el nombre de las fronteras y no solo vengan tres letras
  getPaisCodigoSmall(codigo:string): Observable<paisSmall | null>{
    //directiva para volver un objeto basio

    const url = `${this._baseUrl}/alpha/${codigo}?fields=alpha3Code;name`;
    return  this.http.get<paisSmall>( url );
  }
  //crear un servisio que resiva el areglo completo y ejecutarlas en manera simultanea
  getPaisesPorCodigos( borders: string[]):Observable<paisSmall[]>{
    if( !borders ){
      return of ([]);
    }

    const peticiones: Observable<any> [] = [];
    
    //crear el forech para pasar por todos los elememtos creados
    borders.forEach( codigo => {
      const peticion = this.getPaisCodigoSmall(codigo);
      //donde se imprimen los datos 
      peticiones.push( peticion );
    });

    //disparar todas les peticiones simultaneas rxjs
    return combineLatest( peticiones )


  }





}

import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, delay, Observable, retry, tap, throwError } from 'rxjs';
import { IProduct } from '../models/product';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',

})

export class ProductsService {
  products: IProduct[] = [];
  constructor(
    private httpClient: HttpClient,
    private errorService: ErrorService
  ) {}
  getAll(): Observable<IProduct[]> {
    return this.httpClient
      .get<IProduct[]>('https://fakestoreapi.com/products', {
        params: new HttpParams().append('limit', 5),
      })
      .pipe(delay(500),
      retry(2), 
      tap(products => this.products = products),
      catchError(this.errorHandler.bind(this)));
  }

  create(product: IProduct): Observable<IProduct> {
    return this.httpClient.post<IProduct>(
      'https://fakestoreapi.com/products',
      product
    );
  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message);
    return throwError(() => error.message);
  }
}

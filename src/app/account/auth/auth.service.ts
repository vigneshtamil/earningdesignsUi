import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class apiService {
    handleError(error: { error: { message: any; }; status: any; message: any; }) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(errorMessage);
    }
    constructor(private http: HttpClient) { }
    signup(data: any): Observable<any> {
        return this.http.post<any>(environment.apiurl + '/signup', data).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }
    login(data: any): Observable<any> {
        return this.http.post<any>(environment.apiurl + '/login', data).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }
    otpverify(data: any): Observable<any> {
        return this.http.post<any>(environment.apiurl + '/otpverified', data).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }
}
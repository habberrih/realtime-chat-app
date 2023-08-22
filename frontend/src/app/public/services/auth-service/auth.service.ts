import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { LoginResponseInterface } from 'src/app/model/login-res.interface';
import { UserInterface } from 'src/app/model/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  login(user: UserInterface): Observable<LoginResponseInterface> {
    return this.http.post<LoginResponseInterface>(`api/users/login`, user).pipe(
      tap(
        (res: LoginResponseInterface) =>
          localStorage.setItem('nestjs_chat_app', res.access_token),
        tap(() =>
          this.snackBar.open('Login Successfull', 'Close', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          })
        )
      )
      // catchError((e) => {
      //   this.snackBar.open(
      //     `Can not Login, due to: ${e.error.message}`,
      //     'Close',
      //     {
      //       duration: 5000,
      //       horizontalPosition: 'right',
      //       verticalPosition: 'top',
      //     }
      //   );
      //   return throwError(e);
      // })
    );
  }
}

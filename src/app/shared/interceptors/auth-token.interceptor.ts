import { HttpInterceptor, HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { switchMap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthTokenHttpInterceptor implements HttpInterceptor {

    constructor(
        private auth: AngularFireAuth
    ) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.auth.idToken.pipe(
            take(1),
            switchMap(idToken => {
                let clone = req.clone()
                if (idToken) {
                    clone = clone.clone({ headers: req.headers.set('Authorization', 'Bearer ' + idToken) });
                }
                return next.handle(clone)
            })
        )

    }
}

export const AuthTokenHttpInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthTokenHttpInterceptor,
    multi: true
}
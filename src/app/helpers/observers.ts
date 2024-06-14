import { defer, Observable } from "rxjs";
import { tap } from "rxjs/operators";

export const tapN = <T>(nEmissions, callback: (T) => void) => (source$: Observable<T>): Observable<T> =>
    defer(() => {
        let counter = 0;
        return source$.pipe(tap((item) => {
            if (counter < nEmissions) {
                callback(item);
                counter++;
            }
        }));
    });
export function isTokenExpiry(exp : number) : boolean{
    const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
    return exp < currentTime;

}
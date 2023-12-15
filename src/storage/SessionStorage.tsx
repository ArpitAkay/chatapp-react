export function getItem<T>(key: string): T | null {
    //store in session storage
    const value = sessionStorage.getItem(key);
    if (value) {
        return JSON.parse(value);
    }
    else {
        return null;
    }
}

export function setItem<T>(key: string, value: T | null): void {
    sessionStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key: string): void {
    sessionStorage.removeItem(key);
}

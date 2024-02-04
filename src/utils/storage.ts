export const storage = {
    get: (key: string) => localStorage.getItem(key),
    set: (key: string, value: any) => localStorage.setItem(key, value),
    remove: (key: string) => localStorage.removeItem(key),
    removeAll: () => localStorage.clear()
}
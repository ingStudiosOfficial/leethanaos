import { openDB, type IDBPDatabase } from "idb";

export async function getDb() {
    return openDB(import.meta.env.VITE_IDB_NAME, Number(import.meta.env.VITE_IDB_VER), {
        upgrade(db, oldVer, newVer) {
            if (!newVer) return;
            if (oldVer < newVer) {
                if (!db.objectStoreNames.contains('drive')) db.createObjectStore('drive');
            }
        }
    });
}
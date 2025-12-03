import { DocumentReference } from "firebase/firestore";
import { Users } from "./Users";

export type AuthorisedPerson = {
    name: string;
    age: number;
    relationship: string;
    numphone: string;
    archived: boolean;
    assigned_by: DocumentReference<Users>;
}

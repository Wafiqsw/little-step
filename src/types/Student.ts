import { DocumentReference } from "firebase/firestore";
import { Users } from "./Users";

export type Student = {
    name: string;
    age: number;
    gender: "male" | "female";
    enrollmentDate: Date;
    guardian: DocumentReference<Users>;
}

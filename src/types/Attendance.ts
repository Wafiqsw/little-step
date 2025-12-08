import { DocumentReference } from "firebase/firestore";
import { Student } from "./Student";

export type Attendance = {
    id: string;
    date: Date;
    attendance_status: boolean;
    arrival_status?: boolean;
    arrival_time?: Date;
    pickup_status?: boolean;
    pickup_time?: Date;
    student_ref: DocumentReference<Student>;
}

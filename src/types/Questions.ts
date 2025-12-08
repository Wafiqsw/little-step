import { DocumentReference } from "firebase/firestore";
import { Users } from "./Users";
import { Announcement } from "./Announcement";

export type Questions = {
    message: string;
    asked_by: DocumentReference<Users>; // Parent who asked the question
    announcement_ref: DocumentReference<Announcement>; // Announcement the question is about
    date_asked: Date;
}

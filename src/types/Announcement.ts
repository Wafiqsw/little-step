import { DocumentReference } from "firebase/firestore";
import { Users } from "./Users";

export type Announcement = {
    id: string;
    announcement_date: Date;
    tag: 'urgent' | 'important' | 'general';
    heading: string;
    subheading: string;
    title: string;
    content: string;
    posted_by: DocumentReference<Users>;
    created_at?: Date;
    updated_at?: Date;
}

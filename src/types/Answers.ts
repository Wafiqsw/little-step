import { DocumentReference } from "firebase/firestore";
import { Users } from "./Users";
import { Questions } from "./Questions";

/**
 * Answers Type - Bridge Entity for Many-to-Many Relationship
 *
 * This type represents the bridge/junction table between Teachers (Users with role='teacher')
 * and Questions. It implements a many-to-many relationship where:
 *
 * - Multiple teachers can answer the same question
 * - A teacher can answer multiple questions
 * - Each answer is a separate document in the 'answers' collection
 *
 * Relationship Structure:
 * ```
 * Announcement (1) ──────── (N) Questions (asked by Parents)
 *                                    │
 *                                    │ (N)
 *                                    │
 *                                 Answers (bridge)
 *                                    │
 *                                    │ (N)
 *                                    │
 *                              Teachers (Users)
 * ```
 *
 * Firestore Collections:
 * - announcements/{announcementId}
 * - questions/{questionId} - contains: announcement_ref, asked_by (parent)
 * - answers/{answerId} - contains: question_ref, answered_by (teacher), message, date_sent
 *
 * Usage Example:
 * To get all answers for a question:
 * - Query: answers collection where question_ref == questionId
 *
 * To get all questions answered by a teacher:
 * - Query: answers collection where answered_by == teacherRef
 */
export type Answers = {
    message: string;
    date_sent: Date;
    answered_by: DocumentReference<Users>; // Teacher who answered (Users with role='teacher')
    question_ref: DocumentReference<Questions>; // Question being answered
}

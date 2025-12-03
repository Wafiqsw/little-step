export type Student = {
    name: string;
    class: string;
    age: number;
    gender: "male" | "female";

    // Optional fields
    parentId?: string; // Reference to parent document
    guardianName?: string;
    guardianEmail?: string;
    medicalInfo?: string;
    allergies?: string;
}

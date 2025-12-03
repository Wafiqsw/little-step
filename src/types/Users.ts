export type Users = {
    email: string;
    name: string;
    numphone: string;
    role: "teacher" | "guardian";

    // Optional fields
    toc?: string;
    ic?: string;
    address?: string;
    occupation?: string;
    registered?: boolean;
}
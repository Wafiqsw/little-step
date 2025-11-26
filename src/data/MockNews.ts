export interface NewsArticle {
    id: number
    tag: 'urgent' | 'important' | 'general'
    count?: number
    heading: string
    subheading: string
    title: string
    date: string
    author: string
    description: string
    qna: QuestionAnswer[]
}

export interface QuestionAnswer {
    id: number
    parentName: string
    date: string
    question: string
    answers: Answer[]
}

export interface Answer {
    teacherName: string
    answerDate: string
    answer: string
}

export const mockNewsData: NewsArticle[] = [
    {
        id: 1,
        tag: 'urgent',
        count: 3,
        heading: 'School Closure Due to Weather',
        subheading: 'Important information regarding school closure tomorrow due to severe weather conditions',
        title: 'Important Notice: School Closure Due to Weather',
        date: 'November 26, 2025',
        author: 'Ms. Sarah Johnson',
        description: `Dear Parents and Guardians,

Due to severe weather conditions forecasted for tomorrow, we have made the difficult decision to close the school for the safety of all students and staff.

All classes will be cancelled and the school building will remain closed. We will provide updates via email and our parent portal regarding the reopening schedule.

Please ensure your children are supervised at home during this closure. Online learning materials will be available through the student portal by 10:00 AM.

Thank you for your understanding and cooperation during this time.`,
        qna: [
            {
                id: 1,
                parentName: 'Ahmad Bin Ali',
                date: 'Nov 26, 2025 - 9:30 AM',
                question: 'Will there be any makeup classes for the missed day?',
                answers: [
                    {
                        teacherName: 'Ms. Sarah Johnson',
                        answerDate: 'Nov 26, 2025 - 10:15 AM',
                        answer: 'Yes, we will schedule makeup classes once we resume normal operations. Details will be sent via email.',
                    },
                ],
            },
            {
                id: 2,
                parentName: 'Fatimah Hassan',
                date: 'Nov 26, 2025 - 10:00 AM',
                question: 'Are the online learning materials available for all grades?',
                answers: [
                    {
                        teacherName: 'Ms. Sarah Johnson',
                        answerDate: 'Nov 26, 2025 - 10:30 AM',
                        answer: 'Yes, materials are available for all grades. Please check the student portal.',
                    },
                    {
                        teacherName: 'Mr. John Smith',
                        answerDate: 'Nov 26, 2025 - 11:00 AM',
                        answer: 'Additionally, you can access recorded lessons from previous weeks if needed.',
                    },
                ],
            },
            {
                id: 3,
                parentName: 'Siti Nurhaliza',
                date: 'Nov 26, 2025 - 11:30 AM',
                question: 'What about the school bus service during the closure?',
                answers: [
                    {
                        teacherName: 'Mr. David Lee',
                        answerDate: 'Nov 26, 2025 - 12:00 PM',
                        answer: 'School bus services will also be suspended during the closure period. We will notify you when services resume.',
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        tag: 'important',
        count: 5,
        heading: 'Parent-Teacher Conference Schedule',
        subheading: 'Annual parent-teacher conferences scheduled for next week. Please book your slot.',
        title: 'Annual Parent-Teacher Conference - December 2025',
        date: 'November 25, 2025',
        author: 'Mr. David Lee',
        description: `Dear Parents and Guardians,

We are pleased to announce our annual Parent-Teacher Conference scheduled for December 2-6, 2025.

This is an excellent opportunity to discuss your child's academic progress, social development, and any concerns you may have. Each session will be approximately 15 minutes long.

Booking Information:
- Booking opens: November 27, 2025 at 9:00 AM
- Booking closes: November 30, 2025 at 5:00 PM
- Conference dates: December 2-6, 2025
- Time slots: 2:00 PM - 6:00 PM daily

Please log in to the parent portal to book your preferred time slot. Slots are limited and will be allocated on a first-come, first-served basis.

We look forward to meeting with you!`,
        qna: [
            {
                id: 1,
                parentName: 'Raj Kumar',
                date: 'Nov 25, 2025 - 2:00 PM',
                question: 'Can I book multiple slots if I have children in different classes?',
                answers: [
                    {
                        teacherName: 'Mr. David Lee',
                        answerDate: 'Nov 25, 2025 - 2:30 PM',
                        answer: 'Yes, you can book separate slots for each child. The system will allow you to select multiple time slots.',
                    },
                ],
            },
            {
                id: 2,
                parentName: 'Michelle Tan',
                date: 'Nov 25, 2025 - 3:15 PM',
                question: 'Is it possible to have a virtual conference instead of in-person?',
                answers: [
                    {
                        teacherName: 'Ms. Sarah Johnson',
                        answerDate: 'Nov 25, 2025 - 3:45 PM',
                        answer: 'Yes, we offer virtual conference options via Zoom. Please indicate your preference when booking.',
                    },
                ],
            },
        ],
    },
    {
        id: 3,
        tag: 'general',
        heading: 'School Sports Day 2025',
        subheading: 'Join us for our annual Sports Day celebration on December 15th',
        title: 'Annual School Sports Day - December 15, 2025',
        date: 'November 24, 2025',
        author: 'Coach Michael Brown',
        description: `Dear Parents and Guardians,

We are excited to invite you to our Annual School Sports Day on December 15, 2025!

This year's theme is "Unity Through Sports" and we have planned an exciting day filled with various sporting activities, competitions, and team-building exercises.

Event Details:
- Date: December 15, 2025
- Time: 8:00 AM - 3:00 PM
- Venue: School Sports Complex
- Dress Code: House colors (Red, Blue, Green, Yellow)

Activities Include:
- Track and field events
- Team relay races
- Tug of war
- Fun games for all ages
- Food stalls and refreshments

Parents are welcome to attend and cheer for their children. We encourage all students to participate and showcase their sporting spirit!

Please ensure your child brings:
- Water bottle
- Sunscreen
- Hat or cap
- Comfortable sports shoes

Looking forward to a fantastic day of sports and fun!`,
        qna: [
            {
                id: 1,
                parentName: 'Lim Wei Jie',
                date: 'Nov 24, 2025 - 4:00 PM',
                question: 'Will there be parking available for parents?',
                answers: [
                    {
                        teacherName: 'Coach Michael Brown',
                        answerDate: 'Nov 24, 2025 - 4:30 PM',
                        answer: 'Yes, parking will be available in the school parking lot. Additional parking spaces will be arranged at the nearby community center.',
                    },
                ],
            },
        ],
    },
    {
        id: 4,
        tag: 'important',
        count: 2,
        heading: 'Updated School Safety Protocols',
        subheading: 'New safety measures implemented for student drop-off and pick-up',
        title: 'Enhanced School Safety Protocols - Effective December 1, 2025',
        date: 'November 23, 2025',
        author: 'Principal Dr. Emily Wong',
        description: `Dear Parents and Guardians,

As part of our ongoing commitment to student safety, we are implementing enhanced safety protocols for student drop-off and pick-up procedures, effective December 1, 2025.

New Procedures:

Drop-off (7:00 AM - 7:45 AM):
- Use designated drop-off zone only
- Students must exit from the right side of the vehicle
- No parking in the drop-off zone
- Staff will be present to assist students

Pick-up (2:30 PM - 3:15 PM):
- Display your vehicle identification card
- Queue in designated lanes
- Students will be called by name
- No early dismissals without prior approval

Additional Safety Measures:
- CCTV monitoring of all entry/exit points
- Visitor registration at main office
- ID badges required for all visitors
- Emergency contact information must be up-to-date

Vehicle identification cards will be distributed next week. Please ensure you display it prominently during pick-up times.

Your cooperation in following these procedures is greatly appreciated as we work together to ensure the safety of all our students.`,
        qna: [
            {
                id: 1,
                parentName: 'Nurul Aisyah',
                date: 'Nov 23, 2025 - 10:00 AM',
                question: 'What if I forget my vehicle identification card?',
                answers: [
                    {
                        teacherName: 'Dr. Emily Wong',
                        answerDate: 'Nov 23, 2025 - 10:45 AM',
                        answer: 'Please proceed to the main office to verify your identity. We recommend keeping a spare card in your vehicle.',
                    },
                ],
            },
            {
                id: 2,
                parentName: 'Hassan Abdullah',
                date: 'Nov 23, 2025 - 11:30 AM',
                question: 'Can grandparents or other family members pick up my child?',
                answers: [
                    {
                        teacherName: 'Dr. Emily Wong',
                        answerDate: 'Nov 23, 2025 - 12:00 PM',
                        answer: 'Yes, but they must be listed as authorized pick-up persons in our system and present valid ID. Please update your emergency contacts if needed.',
                    },
                ],
            },
        ],
    },
    {
        id: 5,
        tag: 'general',
        heading: 'School Library New Books Arrival',
        subheading: 'Over 200 new books added to our library collection this month',
        title: 'New Books Collection - November 2025',
        date: 'November 22, 2025',
        author: 'Ms. Rachel Green',
        description: `Dear Parents and Students,

We are delighted to announce that our school library has received over 200 new books this month!

The new collection includes:
- Fiction and non-fiction titles for all age groups
- Latest bestsellers for young readers
- Educational reference materials
- Graphic novels and comics
- Science and technology books
- History and geography resources

Special Features:
- Interactive e-books available on tablets
- Audio books for language learning
- Study guides for exam preparation
- Magazines and periodicals

Library Hours:
- Monday to Friday: 7:30 AM - 4:00 PM
- Saturday: 9:00 AM - 1:00 PM
- Closed on Sundays and public holidays

Borrowing Rules:
- Students can borrow up to 3 books at a time
- Loan period: 2 weeks (renewable once)
- Late return fine: RM 0.50 per day per book

We encourage all students to visit the library and explore our new collection. Reading is a wonderful way to expand knowledge and imagination!

Happy reading!`,
        qna: [],
    },
]

// Helper function to get a single news article by ID
export const getNewsById = (id: number): NewsArticle | undefined => {
    return mockNewsData.find(news => news.id === id)
}

// Helper function to get news by tag
export const getNewsByTag = (tag: 'urgent' | 'important' | 'general'): NewsArticle[] => {
    return mockNewsData.filter(news => news.tag === tag)
}

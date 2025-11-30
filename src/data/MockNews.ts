export interface NewsArticle {
    id: number
    tag: 'urgent' | 'important' | 'general'
    count?: number
    heading: string
    subheading: string
    title: string
    date: string
    author: string
    authorId: number
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
        authorId: 1,
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
        authorId: 2,
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
        authorId: 3,
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
        authorId: 4,
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
        authorId: 5,
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
    {
        id: 6,
        tag: 'important',
        count: 4,
        heading: 'Upcoming Field Trip to Science Museum',
        subheading: 'Permission slips and payment due by December 10th',
        title: 'Field Trip to National Science Museum - December 18, 2025',
        date: 'November 21, 2025',
        author: 'Ms. Sarah Johnson',
        authorId: 1,
        description: `Dear Parents and Guardians,

We are excited to announce an educational field trip to the National Science Museum on December 18, 2025.

Trip Details:
- Date: December 18, 2025 (Wednesday)
- Departure: 8:00 AM from school
- Return: 3:00 PM to school
- Cost: RM 25 per student (includes transportation and admission)
- Grade levels: Years 4-6

What to Bring:
- Packed lunch and snacks
- Water bottle
- Comfortable walking shoes
- Sunscreen and hat
- Spending money for gift shop (optional, max RM 20)

Educational Objectives:
This trip aligns with our science curriculum and will provide hands-on learning experiences in:
- Physics and energy
- Biology and ecosystems
- Space and astronomy
- Technology and innovation

Permission slips were sent home today. Please complete and return them along with payment by December 10, 2025. Space is limited to 60 students, and spots will be allocated on a first-come, first-served basis.

We need 5 parent volunteers to accompany us. If you're interested in chaperoning, please indicate on the permission slip.

Looking forward to this exciting educational experience!`,
        qna: [
            {
                id: 1,
                parentName: 'Karen Lee',
                date: 'Nov 21, 2025 - 3:30 PM',
                question: 'Will there be any supervision during lunch time?',
                answers: [
                    {
                        teacherName: 'Ms. Sarah Johnson',
                        answerDate: 'Nov 21, 2025 - 4:00 PM',
                        answer: 'Yes, all students will be supervised during lunch. We will have designated eating areas and teachers will monitor all groups.',
                    },
                ],
            },
            {
                id: 2,
                parentName: 'Ahmad Ibrahim',
                date: 'Nov 21, 2025 - 5:15 PM',
                question: 'Can we pay in installments?',
                answers: [],
            },
        ],
    },
    {
        id: 7,
        tag: 'urgent',
        count: 8,
        heading: 'Health Screening Next Week',
        subheading: 'Annual health check-up for all students - consent forms required',
        title: 'Annual Student Health Screening - November 27-28, 2025',
        date: 'November 20, 2025',
        author: 'Ms. Sarah Johnson',
        authorId: 1,
        description: `Dear Parents and Guardians,

The annual student health screening will be conducted next week on November 27-28, 2025.

Screening Schedule:
- Year 1-3: November 27, 2025 (Thursday)
- Year 4-6: November 28, 2025 (Friday)
- Time: 9:00 AM - 2:00 PM
- Location: School Health Room

What Will Be Checked:
- Height and weight measurement
- Vision screening
- Dental examination
- Hearing test
- General health assessment
- Vaccination status review

Important Information:
1. This is a mandatory screening for all students
2. Consent forms must be signed and returned by November 25, 2025
3. Please inform us of any known health conditions or allergies
4. Students should have breakfast before the screening
5. Results will be shared with parents within one week

Medical Team:
The screening will be conducted by qualified medical professionals from the Ministry of Health, including:
- Registered nurses
- School health doctors
- Dental hygienists

Privacy and Confidentiality:
All health information will be kept confidential and shared only with parents/guardians and relevant school staff on a need-to-know basis.

If you have any concerns or questions about the screening, please contact the school office or speak with the school nurse.

Please return the consent form as soon as possible to ensure your child can participate in this important health assessment.`,
        qna: [
            {
                id: 1,
                parentName: 'Siti Aminah',
                date: 'Nov 20, 2025 - 10:00 AM',
                question: 'My child is afraid of needles. Will there be any injections?',
                answers: [
                    {
                        teacherName: 'Ms. Sarah Johnson',
                        answerDate: 'Nov 20, 2025 - 10:30 AM',
                        answer: 'This is just a screening, not a vaccination session. There will be no needles or injections. It\'s only measurements and examinations.',
                    },
                ],
            },
            {
                id: 2,
                parentName: 'James Wong',
                date: 'Nov 20, 2025 - 11:45 AM',
                question: 'Can parents accompany their children during the screening?',
                answers: [
                    {
                        teacherName: 'Ms. Sarah Johnson',
                        answerDate: 'Nov 20, 2025 - 12:15 PM',
                        answer: 'Due to space limitations, parents cannot accompany students during the screening. However, teachers and school nurses will be present to support the children.',
                    },
                ],
            },
        ],
    },
    {
        id: 8,
        tag: 'general',
        heading: 'Holiday Homework Assignments',
        subheading: 'December holiday homework for all grade levels',
        title: 'December Holiday Homework - Year 4 Students',
        date: 'November 19, 2025',
        author: 'Ms. Sarah Johnson',
        authorId: 1,
        description: `Dear Parents and Students,

As we approach the December school holidays, here are the homework assignments for Year 4 students.

Holiday Period: December 20, 2025 - January 5, 2026

Mathematics:
- Complete workbook pages 45-60
- Practice multiplication tables (6-10)
- Solve 5 word problems daily (worksheet provided)
- Optional: Math puzzle games online

English Language:
- Read one storybook and write a book report (template provided)
- Practice spelling words (Week 1-10 revision)
- Write a diary entry for 5 days during the holiday
- Create a poster about your favorite holiday activity

Science:
- Observe and record weather patterns for one week
- Plant a seed and document its growth (journal template provided)
- Watch educational science videos (list provided)
- Complete science project: "My Recycling Plan"

Bahasa Malaysia:
- Baca satu buku cerita dan tulis rumusan
- Latih pembacaan teks (10 minit setiap hari)
- Tulis karangan: "Percutian Saya"

General Guidelines:
1. Spend at least 30 minutes daily on homework
2. Take breaks and don't rush
3. Parents should supervise but not complete the work
4. All homework must be submitted by January 8, 2026
5. Late submissions will not be accepted without valid reason

Resources:
- Homework pack will be distributed on December 19
- Online resources link will be emailed to parents
- Extra worksheets available on school website

Remember to:
- Rest and enjoy your holiday
- Spend quality time with family
- Read regularly
- Stay active and healthy

If you have any questions about the homework, please email me before December 19.

Wishing everyone a wonderful and productive holiday!`,
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

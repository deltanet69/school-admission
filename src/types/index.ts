export type User = {
    id: string;
    role: 'admin' | 'teacher' | 'student' | 'staff';
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
};

export type Student = {
    id: string;
    slug?: string; // New field
    user_id?: string;
    name: string;
    nis: string;
    email?: string;
    phone?: string;
    gender?: string;
    place_of_birth?: string;
    date_of_birth?: string;
    address?: string;
    grade: string;
    enrollment_year?: string;
    parent_name?: string;
    parent_contact?: string; // keeping for backward compatibility or mapping
    parent_phone?: string;
    parent_email?: string;
    parent_dob?: string;
    profile_picture?: string;
    status: 'active' | 'graduated' | 'dropped';
    created_at: string;
    updated_at: string;
};

export type Teacher = {
    id: string;
    slug?: string; // New field
    user_id?: string;
    name: string;
    nip: string;
    subject_specialty?: string;
    phone?: string;
    email?: string;
    position?: string;
    profile_picture?: string;
    last_education?: string;
    status: string;
    created_at: string;
    updated_at: string;
};

export type Classroom = {
    id: string;
    slug?: string; // New field
    name: string;
    grade_level?: string;
    academic_year?: string;
    homeroom_teacher_id?: string;
    created_at: string;
    updated_at: string;
};

export type Admission = {
    id: string;
    description?: string; // For compatibility if used elsewhere, otherwise optional
    // Program Info
    program_selection: string;

    // Applicant Info
    applicant_name: string;
    preferred_name?: string;
    place_of_birth?: string;
    date_of_birth?: string;
    gender?: string;
    religion?: string;
    nationality?: string;
    siblings_count?: number;
    email?: string;
    phone?: string;
    previous_school?: string;

    // Parent Info
    parent_name?: string;
    parent_education?: string;
    parent_occupation?: string;
    parent_dob?: string;
    parent_email?: string;
    parent_phone?: string;
    monthly_income?: string;
    parent_status?: string;

    // Additional Info
    extracurricular_interests?: string[]; // Array of strings
    special_needs?: string[]; // Array of strings
    special_needs_note?: string;

    // Documents (JSONB structure: { key: url })
    documents?: Record<string, string>;

    // Meta
    referral_source?: string;
    declaration_agreed?: boolean;

    // Payment Info
    payment_status?: 'pending' | 'paid' | 'failed';
    payment_token?: string;
    payment_url?: string;
    amount?: number;

    status: 'pending' | 'approved' | 'rejected';
    submission_date: string;
    notes?: string;
    created_at: string;
    updated_at: string;
};

export type Update = {
    id: string;
    title: string;
    content: string;
    author_id?: string;
    category?: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
};

// ─── Auth Data Layer ───────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  password: string; // In production: hashed!
  name: string;
  surname: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

// ─── In-Memory User Store ──────────────────────────────────────────────

export const users: User[] = [
  {
    id: 'admin-1',
    email: 'admin@sauilmoro.it',
    password: 'admin123',
    name: 'Sau',
    surname: 'Il Moro',
    phone: '+39 333 1234567',
    role: 'admin',
    addresses: [],
    createdAt: '2024-01-01',
  },
  {
    id: 'user-1',
    email: 'marco@example.com',
    password: 'password123',
    name: 'Marco',
    surname: 'Rossi',
    phone: '+39 347 9876543',
    role: 'customer',
    addresses: [
      {
        id: 'addr-1',
        label: 'Casa',
        address: 'Via Roma 15',
        city: 'Cagliari',
        zip: '09100',
        country: 'Italia',
        isDefault: true,
      }
    ],
    createdAt: '2024-06-15',
  }
];

// ─── Helper Functions ──────────────────────────────────────────────────

export function findUserByEmail(email: string): User | undefined {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
}

export function createUser(data: {
  email: string;
  password: string;
  name: string;
  surname: string;
  phone?: string;
}): User {
  const user: User = {
    id: `user-${Date.now().toString(36)}`,
    email: data.email,
    password: data.password,
    name: data.name,
    surname: data.surname,
    phone: data.phone || '',
    role: 'customer',
    addresses: [],
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}

export function sanitizeUser(user: User) {
  // Return user without password
  const { password, ...safe } = user;
  return safe;
}

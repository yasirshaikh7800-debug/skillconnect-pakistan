import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SkillConnect Pakistan database...');

  // 1. Seed Categories
  const categories = [
    {
      name: 'Electrical & Wiring',
      slug: 'electrical-wiring',
      description: 'Licensed electricians for UPS, solar inverters, short-circuits, and home wiring.',
      iconUrl: '/icons/electrician.svg',
    },
    {
      name: 'Plumbing & Pipework',
      slug: 'plumbing-pipework',
      description: 'Expert plumbers for water pump fitting, leak repairs, and bathroom fixtures.',
      iconUrl: '/icons/plumbing.svg',
    },
    {
      name: 'AC Repair & Servicing',
      slug: 'ac-repair-servicing',
      description: 'Split & Inverter AC gas charging, deep master cleaning, and compressor repair.',
      iconUrl: '/icons/ac-repair.svg',
    },
    {
      name: 'Solar & Inverter Setup',
      slug: 'solar-inverter-setup',
      description: 'Solar panel installation, net metering assistance, and battery maintenance.',
      iconUrl: '/icons/solar.svg',
    },
    {
      name: 'Home Cleaning & Janitorial',
      slug: 'home-cleaning',
      description: 'Full house deep cleaning, sofa shampooing, and water tank cleaning.',
      iconUrl: '/icons/cleaning.svg',
    },
    {
      name: 'Home Tutors & Test Prep',
      slug: 'home-tutors',
      description: 'O/A Level, Matric, FSc, and university qualified home and online tutors.',
      iconUrl: '/icons/tutor.svg',
    },
    {
      name: 'Carpentry & Furniture',
      slug: 'carpentry-furniture',
      description: 'Custom furniture repair, door lock fitting, and kitchen cabinet assembly.',
      iconUrl: '/icons/carpenter.svg',
    },
    {
      name: 'Auto Mechanic & Breakdown',
      slug: 'auto-mechanic',
      description: 'Mobile mechanic service, car battery jumpstart, and computer diagnostics.',
      iconUrl: '/icons/mechanic.svg',
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log('Service categories seeded.');

  // 2. Seed Admin User
  const adminPassword = await bcrypt.hash('AdminPass@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@skillconnect.pk' },
    update: {},
    create: {
      email: 'admin@skillconnect.pk',
      phone: '+923000000000',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          firstName: 'System',
          lastName: 'Administrator',
          city: 'Islamabad',
          address: 'Blue Area, Sector F-6, Islamabad',
        },
      },
      wallet: {
        create: {
          balance: 50000.0, // Platform escrow / fees balance
        },
      },
    },
  });
  console.log(`Admin user created: ${admin.email}`);

  // 3. Seed Sample Service Provider (Electrician in Karachi)
  const providerPassword = await bcrypt.hash('ProviderPass@123', 10);
  const elecCat = await prisma.category.findUnique({ where: { slug: 'electrical-wiring' } });

  const providerUser = await prisma.user.upsert({
    where: { email: 'tariq.electrician@gmail.com' },
    update: {},
    create: {
      email: 'tariq.electrician@gmail.com',
      phone: '+923001234567',
      passwordHash: providerPassword,
      role: UserRole.PROVIDER,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          firstName: 'Tariq',
          lastName: 'Mehmood',
          city: 'Karachi',
          address: 'Gulshan-e-Iqbal Block 13D, Karachi',
          latitude: 24.918,
          longitude: 67.0971,
          bio: '10+ years experienced electrician specializing in solar inverters, distribution boxes, and residential wiring in Karachi.',
        },
      },
      providerProfile: {
        create: {
          cnicNumber: '42101-1234567-1',
          isVerified: true,
          hourlyRate: 1500.0, // PKR per hour
          rating: 4.9,
          totalReviews: 24,
          serviceRadiusKm: 20.0,
          services: {
            create: [
              {
                title: 'Solar & UPS Inverter Wiring',
                description: 'Complete wiring setup for hybrid solar inverters and battery bank integration.',
                basePrice: 3500.0, // PKR
                durationMinutes: 120,
                categoryId: elecCat!.id,
              },
              {
                title: 'Distribution Box & Breaker Repair',
                description: 'Circuit breaker diagnosis, main load balancing, and short-circuit repair.',
                basePrice: 1800.0,
                durationMinutes: 60,
                categoryId: elecCat!.id,
              },
            ],
          },
        },
      },
      wallet: {
        create: {
          balance: 12500.0,
        },
      },
    },
  });
  console.log(`Provider user created: ${providerUser.email}`);

  // 4. Seed Sample Customer (Karachi)
  const customerPassword = await bcrypt.hash('CustomerPass@123', 10);
  const customerUser = await prisma.user.upsert({
    where: { email: 'aisha.khan@gmail.com' },
    update: {},
    create: {
      email: 'aisha.khan@gmail.com',
      phone: '+923339876543',
      passwordHash: customerPassword,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          firstName: 'Aisha',
          lastName: 'Khan',
          city: 'Karachi',
          address: 'DHA Phase 6, Karachi',
          latitude: 24.7937,
          longitude: 67.0656,
        },
      },
      wallet: {
        create: {
          balance: 5000.0,
        },
      },
    },
  });
  console.log(`Customer user created: ${customerUser.email}`);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

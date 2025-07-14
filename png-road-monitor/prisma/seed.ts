import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding PNG Road Construction Monitor database...');

  // Create provinces
  const provinces = await Promise.all([
    prisma.province.upsert({
      where: { code: 'WHP' },
      update: {},
      create: {
        id: 'prov-1',
        name: 'Western Highlands',
        code: 'WHP',
        region: 'Highlands'
      }
    }),
    prisma.province.upsert({
      where: { code: 'NCD' },
      update: {},
      create: {
        id: 'prov-2',
        name: 'National Capital District',
        code: 'NCD',
        region: 'Southern'
      }
    }),
    prisma.province.upsert({
      where: { code: 'MPL' },
      update: {},
      create: {
        id: 'prov-3',
        name: 'Morobe',
        code: 'MPL',
        region: 'Momase'
      }
    })
  ]);

  // Create work types
  const workTypes = await Promise.all([
    prisma.workType.upsert({
      where: { name: 'Road Construction' },
      update: {},
      create: {
        id: 'wt-1',
        name: 'Road Construction',
        category: 'Infrastructure'
      }
    }),
    prisma.workType.upsert({
      where: { name: 'Bridge Construction' },
      update: {},
      create: {
        id: 'wt-2',
        name: 'Bridge Construction',
        category: 'Infrastructure'
      }
    }),
    prisma.workType.upsert({
      where: { name: 'Road Maintenance' },
      update: {},
      create: {
        id: 'wt-3',
        name: 'Road Maintenance',
        category: 'Maintenance'
      }
    })
  ]);

  // Create users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@doworks.gov.pg' },
      update: {},
      create: {
        id: 'user-1',
        email: 'admin@doworks.gov.pg',
        password: '$2b$10$samplehashedpassword123456789',
        name: 'Demo Administrator',
        role: 'ADMIN'
      }
    }),
    prisma.user.upsert({
      where: { email: 'john.kerenga@doworks.gov.pg' },
      update: {},
      create: {
        id: 'user-2',
        email: 'john.kerenga@doworks.gov.pg',
        password: '$2b$10$samplehashedpassword123456789',
        name: 'John Kerenga',
        role: 'PROJECT_MANAGER'
      }
    }),
    prisma.user.upsert({
      where: { email: 'sarah.mendi@doworks.gov.pg' },
      update: {},
      create: {
        id: 'user-3',
        email: 'sarah.mendi@doworks.gov.pg',
        password: '$2b$10$samplehashedpassword123456789',
        name: 'Sarah Mendi',
        role: 'SITE_ENGINEER'
      }
    })
  ]);

  // Create projects
  const projects = await Promise.all([
    prisma.project.upsert({
      where: { id: 'proj-1' },
      update: {},
      create: {
        id: 'proj-1',
        name: 'Mt. Hagen-Kagamuga Road Upgrade',
        description: 'Upgrade of the critical road connecting Mt. Hagen to Kagamuga Airport',
        location: 'Mt. Hagen, Western Highlands Province',
        provinceId: provinces[0].id,
        status: 'ACTIVE',
        progress: 65,
        budget: 45000000, // K45M
        spent: 29250000,  // K29.25M
        startDate: new Date('2024-03-01'),
        endDate: new Date('2025-06-30'),
        contractor: 'PNG Roads Limited',
        managerId: users[1].id,
        fundingSource: 'GOVERNMENT'
      }
    }),
    prisma.project.upsert({
      where: { id: 'proj-2' },
      update: {},
      create: {
        id: 'proj-2',
        name: 'Port Moresby Ring Road Extension',
        description: 'Extension of the ring road to improve traffic flow in Port Moresby',
        location: 'Port Moresby, National Capital District',
        provinceId: provinces[1].id,
        status: 'ACTIVE',
        progress: 42,
        budget: 85000000, // K85M
        spent: 35700000,  // K35.7M
        startDate: new Date('2024-01-15'),
        endDate: new Date('2025-12-31'),
        contractor: 'Capital Infrastructure Pty Ltd',
        managerId: users[1].id,
        fundingSource: 'GOVERNMENT'
      }
    }),
    prisma.project.upsert({
      where: { id: 'proj-3' },
      update: {},
      create: {
        id: 'proj-3',
        name: 'Lae-Nadzab Highway Reconstruction',
        description: 'Complete reconstruction of the highway connecting Lae to Nadzab Airport',
        location: 'Lae to Nadzab, Morobe Province',
        provinceId: provinces[2].id,
        status: 'PLANNING',
        progress: 15,
        budget: 62000000, // K62M
        spent: 9300000,   // K9.3M
        startDate: new Date('2024-06-01'),
        endDate: new Date('2026-03-31'),
        contractor: 'Morobe Construction Group',
        managerId: users[1].id,
        fundingSource: 'GOVERNMENT'
      }
    })
  ]);

  // Create GPS entries
  await Promise.all([
    prisma.gPSEntry.create({
      data: {
        id: 'gps-1',
        latitude: -5.837104,
        longitude: 144.295472,
        description: 'Mt. Hagen Town Center - Project Start',
        projectId: projects[0].id,
        userId: users[2].id,
        taskName: 'Site Survey',
        workType: 'Survey',
        roadSide: 'Both',
        startChainage: '0+000',
        endChainage: '0+500',
        taskDescription: 'Initial site survey and traffic count',
        photos: JSON.stringify([]),
        timestamp: new Date('2024-03-05T08:30:00Z')
      }
    }),
    prisma.gPSEntry.create({
      data: {
        id: 'gps-2',
        latitude: -9.4438,
        longitude: 147.1803,
        description: 'Jacksons Airport Junction',
        projectId: projects[1].id,
        userId: users[2].id,
        taskName: 'Foundation Work',
        workType: 'Construction',
        roadSide: 'Left',
        startChainage: '1+200',
        endChainage: '1+800',
        taskDescription: 'Foundation preparation for ring road extension',
        photos: JSON.stringify([]),
        timestamp: new Date('2024-01-20T10:15:00Z')
      }
    })
  ]);

  // Create financial entries
  await Promise.all([
    prisma.financialEntry.create({
      data: {
        id: 'fin-1',
        projectId: projects[0].id,
        userId: users[1].id,
        category: 'MATERIALS',
        type: 'EXPENSE',
        amount: 2500000, // K2.5M
        description: 'Aggregate and bitumen purchase',
        date: new Date('2024-03-10'),
        invoiceNumber: 'INV-2024-001',
        vendor: 'PNG Materials Supply Co.',
        isApproved: true,
        approvedBy: users[0].id,
        approvedAt: new Date('2024-03-12'),
        currency: 'PGK',
        exchangeRate: 1.0
      }
    }),
    prisma.financialEntry.create({
      data: {
        id: 'fin-2',
        projectId: projects[1].id,
        userId: users[1].id,
        category: 'EQUIPMENT',
        type: 'EXPENSE',
        amount: 1800000, // K1.8M
        description: 'Heavy machinery rental',
        date: new Date('2024-01-25'),
        invoiceNumber: 'INV-2024-002',
        vendor: 'PNG Heavy Equipment Hire',
        isApproved: true,
        approvedBy: users[0].id,
        approvedAt: new Date('2024-01-26'),
        currency: 'PGK',
        exchangeRate: 1.0
      }
    })
  ]);

  // Create progress entries
  await Promise.all([
    prisma.progressEntry.create({
      data: {
        id: 'prog-1',
        projectId: projects[0].id,
        date: new Date('2024-12-01'),
        physicalProgress: 65,
        financialProgress: 62,
        plannedProgress: 60,
        milestones: 'Bridge foundation completed, road surface 60% complete',
        issues: 'Weather delays due to heavy rain',
        nextActions: 'Continue surfacing work, install drainage',
        weatherConditions: 'Heavy rain periods',
        workforceCount: 45,
        equipmentStatus: 'All equipment operational',
        notes: 'Good progress despite weather challenges'
      }
    }),
    prisma.progressEntry.create({
      data: {
        id: 'prog-2',
        projectId: projects[1].id,
        date: new Date('2024-12-01'),
        physicalProgress: 42,
        financialProgress: 40,
        plannedProgress: 45,
        milestones: 'Earth works 80% complete, drainage installation started',
        issues: 'Land acquisition delays in some sections',
        nextActions: 'Complete drainage work, start road base preparation',
        weatherConditions: 'Dry season favorable for construction',
        workforceCount: 78,
        equipmentStatus: '2 excavators under maintenance',
        notes: 'Behind schedule due to land issues'
      }
    })
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created:`);
  console.log(`   - ${provinces.length} provinces`);
  console.log(`   - ${workTypes.length} work types`);
  console.log(`   - ${users.length} users`);
  console.log(`   - ${projects.length} projects`);
  console.log(`   - 2 GPS entries`);
  console.log(`   - 2 financial entries`);
  console.log(`   - 2 progress entries`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

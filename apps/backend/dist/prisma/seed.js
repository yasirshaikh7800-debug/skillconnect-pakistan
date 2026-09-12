"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
function slugify(value) {
    return String(value)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function main() {
    console.log('Seeding SkillConnect Pakistan with full demo data...');
    await prisma.$transaction([
        prisma.auditLog.deleteMany(),
        prisma.payment.deleteMany(),
        prisma.review.deleteMany(),
        prisma.booking.deleteMany(),
        prisma.chatMessage.deleteMany(),
        prisma.chatRoom.deleteMany(),
        prisma.service.deleteMany(),
        prisma.providerProfile.deleteMany(),
        prisma.company.deleteMany(),
        prisma.profile.deleteMany(),
        prisma.wallet.deleteMany(),
        prisma.user.deleteMany(),
        prisma.category.deleteMany(),
        prisma.district.deleteMany(),
        prisma.city.deleteMany(),
        prisma.province.deleteMany(),
    ]);
    const categories = [
        { name: 'Electrical & Wiring', slug: 'electrical-wiring', description: 'Certified electricians for wiring, breakers, inverter systems, and emergency repairs.', iconUrl: '/icons/electrician.svg' },
        { name: 'Plumbing & Pipework', slug: 'plumbing-pipework', description: 'Water tank, sink, pipe, drainage, and bathroom fixture solutions.', iconUrl: '/icons/plumbing.svg' },
        { name: 'AC Repair & Servicing', slug: 'ac-repair-servicing', description: 'Split AC, inverter AC, gas refills, and deep cleaning services.', iconUrl: '/icons/ac-repair.svg' },
        { name: 'Solar & Inverter Setup', slug: 'solar-inverter-setup', description: 'Solar installations, batteries, inverter setups, and net-metering support.', iconUrl: '/icons/solar.svg' },
        { name: 'Home Cleaning & Janitorial', slug: 'home-cleaning', description: 'Deep cleaning, disinfection, sofa shampooing, and water tank cleaning.', iconUrl: '/icons/cleaning.svg' },
        { name: 'Home Tutors & Test Prep', slug: 'home-tutors', description: 'Matric, FSc, O/A Level, university, and language tutoring services.', iconUrl: '/icons/tutor.svg' },
        { name: 'Carpentry & Furniture', slug: 'carpentry-furniture', description: 'Furniture repair, wardrobe assembly, kitchen carpentry, and custom woodwork.', iconUrl: '/icons/carpenter.svg' },
        { name: 'Auto Mechanic & Breakdown', slug: 'auto-mechanic', description: 'Car diagnostics, oil changes, towing, battery replacement, and roadside assistance.', iconUrl: '/icons/mechanic.svg' },
        { name: 'Mobile & Smartphone Repair', slug: 'mobile-repair', description: 'Screen replacement, battery issues, water damage, and software support.', iconUrl: '/icons/mobile.svg' },
        { name: 'Laptop & Computer Repair', slug: 'computer-repair', description: 'Hardware repair, software troubleshooting, virus removal, and upgrades.', iconUrl: '/icons/computer.svg' },
        { name: 'Painting & Wall Finishing', slug: 'painting-finishing', description: 'Interior, exterior, waterproofing, and texture paint services.', iconUrl: '/icons/paint.svg' },
        { name: 'Masonry & Construction', slug: 'masonry-construction', description: 'Brickwork, plastering, tile fitting, and small construction support.', iconUrl: '/icons/construction.svg' },
        { name: 'Welding & Fabrication', slug: 'welding-fabrication', description: 'Gate fabrication, ironworks, grill repairs, and custom metalwork.', iconUrl: '/icons/welding.svg' },
        { name: 'Beauty & Salon Services', slug: 'beauty-salon', description: 'Hair styling, makeup, threading, bridal grooming, and skincare.', iconUrl: '/icons/beauty.svg' },
        { name: 'Healthcare & Wellness', slug: 'healthcare-wellness', description: 'Physiotherapy, eldercare, nutrition guidance, and wellness visits.', iconUrl: '/icons/health.svg' },
        { name: 'Education & Coaching', slug: 'education-coaching', description: 'Essay writing, coding coaching, IELTS prep, and spoken English classes.', iconUrl: '/icons/education.svg' },
        { name: 'IT & Software Development', slug: 'it-software-development', description: 'Website design, app development, ERP support, and SaaS implementation.', iconUrl: '/icons/it.svg' },
        { name: 'Digital Marketing', slug: 'digital-marketing', description: 'SEO, social media management, ad campaigns, and content strategy.', iconUrl: '/icons/digital.svg' },
        { name: 'Content & Creative Design', slug: 'content-design', description: 'Logo design, packaging, illustration, video editing, and animation.', iconUrl: '/icons/design.svg' },
        { name: 'Automobile Maintenance', slug: 'automobile-maintenance', description: 'Engine tuneups, upholstery, detailing, and vehicle inspections.', iconUrl: '/icons/auto.svg' },
        { name: 'Agriculture & Farming', slug: 'agriculture-farming', description: 'Farm consultancy, irrigation setup, poultry support, and livestock care.', iconUrl: '/icons/agriculture.svg' },
        { name: 'Events & Catering', slug: 'events-catering', description: 'Wedding planning, photography, decoration, catering, and event management.', iconUrl: '/icons/events.svg' },
        { name: 'Business & Consulting', slug: 'business-consulting', description: 'Accounting, HR, legal documentation, and business advisory support.', iconUrl: '/icons/business.svg' },
        { name: 'Security & Protection', slug: 'security-protection', description: 'Security guards, CCTV setup, locksmithing, and alarm maintenance.', iconUrl: '/icons/security.svg' },
        { name: 'Appliance Repair', slug: 'appliance-repair', description: 'Fridge, washing machine, microwave, and oven repair specialists.', iconUrl: '/icons/appliance.svg' },
        { name: 'Tailoring & Fashion', slug: 'tailoring-fashion', description: 'Alteration, embroidery, stitching, bridal wear, and uniform tailoring.', iconUrl: '/icons/tailoring.svg' },
        { name: 'Vehicle & Driver Services', slug: 'vehicle-driver-services', description: 'Driver hire, pickup/drop-off, local transfer, and delivery support.', iconUrl: '/icons/driver.svg' },
        { name: 'Pest Control', slug: 'pest-control', description: 'Termite, mosquito, cockroach, and rodent pest elimination.', iconUrl: '/icons/pest.svg' },
        { name: 'Interior Design', slug: 'interior-design', description: 'Space planning, renovation consultation, and modular kitchen design.', iconUrl: '/icons/interior.svg' },
        { name: 'Moving & Packing', slug: 'moving-packing', description: 'House shifting, office relocation, loading, unloading, and packing.', iconUrl: '/icons/moving.svg' },
    ];
    for (const category of categories) {
        await prisma.category.upsert({
            where: { slug: category.slug },
            update: category,
            create: category,
        });
    }
    const provinces = [
        { name: 'Punjab', slug: 'punjab', code: 'PB' },
        { name: 'Sindh', slug: 'sindh', code: 'SD' },
        { name: 'Khyber Pakhtunkhwa', slug: 'khyber-pakhtunkhwa', code: 'KP' },
        { name: 'Balochistan', slug: 'balochistan', code: 'BA' },
        { name: 'Islamabad Capital Territory', slug: 'islamabad-capital-territory', code: 'ICT' },
        { name: 'Gilgit-Baltistan', slug: 'gilgit-baltistan', code: 'GB' },
        { name: 'Azad Jammu and Kashmir', slug: 'azad-jammu-and-kashmir', code: 'AJK' },
    ];
    const provinceRecords = [];
    for (const province of provinces) {
        const record = await prisma.province.upsert({
            where: { slug: province.slug },
            update: province,
            create: province,
        });
        provinceRecords.push({ id: record.id, slug: province.slug });
    }
    const provinceBySlug = new Map(provinceRecords.map((item) => [item.slug, item.id]));
    const citySeedData = [
        ['Punjab', 'Lahore', true, 31.5497, 74.3436],
        ['Punjab', 'Faisalabad', true, 31.4187, 73.0791],
        ['Punjab', 'Rawalpindi', true, 33.5651, 73.0169],
        ['Punjab', 'Gujranwala', true, 32.1877, 74.1945],
        ['Punjab', 'Multan', true, 30.1575, 71.5249],
        ['Punjab', 'Sargodha', true, 32.0740, 72.6861],
        ['Punjab', 'Bahawalpur', true, 29.3956, 71.6836],
        ['Punjab', 'Sialkot', true, 32.4925, 74.5318],
        ['Punjab', 'Sheikhupura', true, 31.7167, 73.9850],
        ['Punjab', 'Rahim Yar Khan', true, 28.4211, 70.2979],
        ['Punjab', 'Jhang', false, 31.2788, 72.3257],
        ['Punjab', 'Gujrat', false, 32.5741, 74.0785],
        ['Punjab', 'Kasur', false, 31.1156, 74.4467],
        ['Punjab', 'Mianwali', false, 32.5854, 71.5436],
        ['Punjab', 'Okara', false, 30.8100, 73.4500],
        ['Punjab', 'Sahiwal', false, 30.6647, 73.1064],
        ['Punjab', 'Wah Cantt', false, 33.7571, 72.7324],
        ['Punjab', 'Kamoke', false, 31.9748, 74.2244],
        ['Punjab', 'Hafizabad', false, 32.0667, 73.6854],
        ['Punjab', 'Khaniwal', false, 30.7815, 72.3517],
        ['Sindh', 'Karachi', true, 24.8607, 67.0011],
        ['Sindh', 'Hyderabad', true, 25.3960, 68.3578],
        ['Sindh', 'Sukkur', true, 27.7052, 68.8578],
        ['Sindh', 'Larkana', true, 27.5550, 68.2123],
        ['Sindh', 'Mirpur Khas', true, 25.5270, 69.0110],
        ['Sindh', 'Nawabshah', true, 26.2395, 68.4037],
        ['Sindh', 'Jacobabad', false, 28.2811, 68.4367],
        ['Sindh', 'Jamshoro', false, 25.4245, 68.2798],
        ['Sindh', 'Dadu', false, 26.7313, 67.7768],
        ['Sindh', 'Sanghar', false, 26.0469, 68.9490],
        ['Sindh', 'Thatta', false, 24.7467, 67.9236],
        ['Sindh', 'Tando Allahyar', false, 25.4604, 68.7174],
        ['Sindh', 'Badin', false, 24.6556, 68.8383],
        ['Sindh', 'Shikarpur', false, 27.9554, 68.6220],
        ['Sindh', 'Mithi', false, 24.7360, 69.7993],
        ['Khyber Pakhtunkhwa', 'Peshawar', true, 34.0151, 71.5249],
        ['Khyber Pakhtunkhwa', 'Abbottabad', true, 34.1468, 73.2135],
        ['Khyber Pakhtunkhwa', 'Mardan', true, 34.1989, 72.0231],
        ['Khyber Pakhtunkhwa', 'Swabi', true, 34.1208, 72.4697],
        ['Khyber Pakhtunkhwa', 'Kohat', true, 33.5883, 71.4425],
        ['Khyber Pakhtunkhwa', 'Mansehra', true, 34.3303, 73.2032],
        ['Khyber Pakhtunkhwa', 'Bannu', true, 32.9854, 70.6040],
        ['Khyber Pakhtunkhwa', 'Charsadda', false, 34.1488, 71.7311],
        ['Khyber Pakhtunkhwa', 'Haripur', false, 33.9985, 72.9347],
        ['Khyber Pakhtunkhwa', 'Nowshera', false, 33.9985, 71.9999],
        ['Khyber Pakhtunkhwa', 'Swat', false, 35.2227, 72.4258],
        ['Khyber Pakhtunkhwa', 'Dir', false, 35.2058, 71.8761],
        ['Khyber Pakhtunkhwa', 'Bannu', false, 32.9854, 70.6040],
        ['Balochistan', 'Quetta', true, 30.1798, 66.9750],
        ['Balochistan', 'Gwadar', true, 25.1268, 62.3254],
        ['Balochistan', 'Turbat', true, 26.0010, 63.0410],
        ['Balochistan', 'Khuzdar', true, 27.8114, 66.6145],
        ['Balochistan', 'Sibi', true, 29.5429, 67.8776],
        ['Balochistan', 'Zhob', false, 31.3418, 69.4487],
        ['Balochistan', 'Loralai', false, 30.3700, 68.5972],
        ['Balochistan', 'Chaman', false, 30.9237, 66.4515],
        ['Balochistan', 'Dalbandin', false, 28.8802, 64.4102],
        ['Balochistan', 'Kalat', false, 29.0268, 66.5932],
        ['Islamabad Capital Territory', 'Islamabad', true, 33.6844, 73.0479],
        ['Islamabad Capital Territory', 'Rawalpindi', false, 33.5651, 73.0169],
        ['Gilgit-Baltistan', 'Gilgit', true, 35.9200, 74.3087],
        ['Gilgit-Baltistan', 'Skardu', true, 35.3015, 75.6331],
        ['Gilgit-Baltistan', 'Hunza', false, 36.3161, 74.6557],
        ['Gilgit-Baltistan', 'Ghizer', false, 36.2380, 73.9820],
        ['Azad Jammu and Kashmir', 'Muzaffarabad', true, 34.3700, 73.4700],
        ['Azad Jammu and Kashmir', 'Mirpur', true, 33.1470, 73.7510],
        ['Azad Jammu and Kashmir', 'Bagh', false, 33.9780, 73.7810],
        ['Azad Jammu and Kashmir', 'Rawalakot', false, 33.8560, 73.7660],
    ];
    const extraCities = [
        'Attock', 'Chiniot', 'Vehari', 'Mandi Bahauddin', 'Narowal', 'Ferozwala', 'Jhelum', 'Taxila', 'Daska', 'Bhakkar', 'Mandi Bahauddin', 'Sadiqabad', 'Pattoki', 'Muridke', 'Burewala', 'Pakpattan', 'Khanpur', 'Nankana Sahib', 'Sukkur', 'Qambar Shahdadkot', 'Matiari', 'Badin', 'Narang Mandi', 'Khanewal', 'Rajanpur', 'Muzaffargarh', 'Chakwal', 'Talagang', 'Bhalwal', 'Mian Channu', 'Burewala', 'Narowal', 'Kot Addu', 'Mandi Bahauddin', 'Shahkot', 'Jaranwala', 'Sambrial', 'Hasilpur', 'Lodhran', 'Bhawalnagar', 'Burewala', 'Dera Ghazi Khan', 'Mianwali', 'Bhakkar', 'Kotli', 'Sialkot', 'Sadiqabad', 'Shahdadpur', 'Perowal', 'Pindi Gheb', 'Awaran', 'Khairpur', 'Tando Muhammad Khan', 'Matli', 'Umerkot', 'Saidu Sharif', 'Talagang', 'Karak', 'Parachinar', 'Mingora', 'Naran', 'Kalam', 'Buner', 'Malakand', 'Pabbi', 'Risalpur', 'Dera Ismail Khan', 'Tank', 'Bannu', 'Tajik', 'Mastung', 'Kharan', 'Nushki', 'Barkhan', 'Lasbela', 'Hub', 'Ormarah', 'Kohlu', 'Pishin', 'Mastung', 'Musa Khel', 'Sohbatpur', 'Ghotki', 'Naushahro Feroze', 'Tando Adam', 'Nooriabad', 'Malir', 'Korangi', 'North Nazimabad', 'Baldia', 'Gulberg', 'Defence', 'Clifton', 'Bahria Town', 'Muzafarabad', 'Jhelum', 'Bhimber', 'Kotli', 'Poonch', 'Haveli', 'Neelum', 'Shangla', 'Battagram', 'Hangu', 'Kurram', 'Buner', 'Chitral', 'Malam Jabba', 'Naltar', 'Danyor', 'Hunza', 'Nagar', 'Astore', 'Shigar', 'Skardu', 'Khaplu',
    ];
    for (const [provinceName, cityName, isMajor, latitude, longitude] of citySeedData) {
        const provinceId = provinceBySlug.get(slugify(provinceName));
        if (!provinceId) {
            continue;
        }
        await prisma.city.upsert({
            where: { provinceId_name: { provinceId, name: cityName } },
            update: { isMajor, latitude, longitude },
            create: {
                provinceId,
                name: cityName,
                slug: slugify(cityName),
                isMajor,
                latitude,
                longitude,
            },
        });
    }
    for (const cityName of extraCities) {
        const provinceId = provinceBySlug.get('punjab');
        await prisma.city.upsert({
            where: { provinceId_name: { provinceId: provinceId, name: cityName } },
            update: {},
            create: {
                provinceId: provinceId,
                name: cityName,
                slug: slugify(cityName),
                isMajor: false,
            },
        });
    }
    const allCities = await prisma.city.findMany({ include: { province: true } });
    const cityBySlug = new Map(allCities.map((city) => [city.slug, city]));
    const districtSeedData = [
        ['islamabad', 'Islamabad'],
        ['lahore', 'Lahore'],
        ['karachi', 'Karachi'],
        ['rawalpindi', 'Rawalpindi'],
        ['multan', 'Multan'],
        ['faisalabad', 'Faisalabad'],
        ['gujranwala', 'Gujranwala'],
        ['sialkot', 'Sialkot'],
        ['peshawar', 'Peshawar'],
        ['quetta', 'Quetta'],
        ['hyderabad', 'Hyderabad'],
        ['sukkur', 'Sukkur'],
        ['gilgit', 'Gilgit'],
        ['skardu', 'Skardu'],
        ['muzaffarabad', 'Muzaffarabad'],
        ['mirpur', 'Mirpur'],
        ['abbottabad', 'Abbottabad'],
        ['mansehra', 'Mansehra'],
        ['gwadar', 'Gwadar'],
        ['khuzdar', 'Khuzdar'],
    ];
    for (const [citySlug, districtName] of districtSeedData) {
        const city = cityBySlug.get(citySlug);
        if (!city)
            continue;
        await prisma.district.upsert({
            where: { cityId_name: { cityId: city.id, name: districtName } },
            update: {},
            create: {
                cityId: city.id,
                name: districtName,
                slug: slugify(districtName),
            },
        });
    }
    const adminPassword = await bcrypt.hash('AdminPass@123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@skillconnect.pk' },
        update: {},
        create: {
            email: 'admin@skillconnect.pk',
            phone: '+923000000000',
            passwordHash: adminPassword,
            role: client_1.UserRole.ADMIN,
            status: client_1.UserStatus.ACTIVE,
            profile: {
                create: {
                    firstName: 'System',
                    lastName: 'Administrator',
                    city: 'Islamabad',
                    address: 'Blue Area, Sector F-6, Islamabad',
                    provinceId: provinceBySlug.get('islamabad-capital-territory'),
                    cityId: cityBySlug.get('islamabad')?.id,
                    districtId: (await prisma.district.findFirst({ where: { slug: slugify('Islamabad') } }))?.id,
                },
            },
            wallet: { create: { balance: 50000 } },
        },
    });
    console.log(`Admin seeded: ${admin.email}`);
    const customers = [
        { email: 'aisha.khan@gmail.com', phone: '+923339876543', firstName: 'Aisha', lastName: 'Khan', city: 'Karachi', address: 'DHA Phase 6, Karachi', citySlug: 'karachi' },
        { email: 'hamza.ali@yahoo.com', phone: '+923452345678', firstName: 'Hamza', lastName: 'Ali', city: 'Lahore', address: 'Model Town, Lahore', citySlug: 'lahore' },
        { email: 'sana.qureshi@outlook.com', phone: '+923214567890', firstName: 'Sana', lastName: 'Qureshi', city: 'Islamabad', address: 'G-10, Islamabad', citySlug: 'islamabad' },
        { email: 'bilal.hassan@mail.com', phone: '+923315678901', firstName: 'Bilal', lastName: 'Hassan', city: 'Peshawar', address: 'University Town, Peshawar', citySlug: 'peshawar' },
        { email: 'maria.shah@gmail.com', phone: '+923187654321', firstName: 'Maria', lastName: 'Shah', city: 'Quetta', address: 'Kharotabad, Quetta', citySlug: 'quetta' },
        { email: 'usman.khan@hotmail.com', phone: '+923125678432', firstName: 'Usman', lastName: 'Khan', city: 'Rawalpindi', address: 'Westridge, Rawalpindi', citySlug: 'rawalpindi' },
        { email: 'zainab.mirza@gmail.com', phone: '+923122345678', firstName: 'Zainab', lastName: 'Mirza', city: 'Hyderabad', address: 'Latifabad, Hyderabad', citySlug: 'hyderabad' },
        { email: 'faisal.rahman@live.com', phone: '+923345678901', firstName: 'Faisal', lastName: 'Rahman', city: 'Multan', address: 'Shah Rukn-e-Alam, Multan', citySlug: 'multan' },
        { email: 'mohsin.ahmed@ymail.com', phone: '+923332109876', firstName: 'Mohsin', lastName: 'Ahmed', city: 'Sukkur', address: 'Qambar, Sukkur', citySlug: 'sukkur' },
        { email: 'mehwish.khan@gmail.com', phone: '+923117654321', firstName: 'Mehwish', lastName: 'Khan', city: 'Muzaffarabad', address: 'Chattar, Muzaffarabad', citySlug: 'muzaffarabad' },
    ];
    const customerPassword = await bcrypt.hash('CustomerPass@123', 10);
    const createdCustomers = [];
    for (const customer of customers) {
        const city = cityBySlug.get(customer.citySlug);
        const user = await prisma.user.create({
            data: {
                email: customer.email,
                phone: customer.phone,
                passwordHash: customerPassword,
                role: client_1.UserRole.CUSTOMER,
                status: client_1.UserStatus.ACTIVE,
                profile: {
                    create: {
                        firstName: customer.firstName,
                        lastName: customer.lastName,
                        city: customer.city,
                        address: customer.address,
                        provinceId: city?.provinceId,
                        cityId: city?.id,
                        districtId: (await prisma.district.findFirst({ where: { cityId: city?.id } }))?.id,
                        latitude: city?.latitude,
                        longitude: city?.longitude,
                    },
                },
                wallet: { create: { balance: randomBetween(3000, 12000) } },
            },
        });
        createdCustomers.push(user);
    }
    const serviceCategoryBySlug = new Map();
    for (const category of categories) {
        const record = await prisma.category.findUnique({ where: { slug: category.slug } });
        if (record)
            serviceCategoryBySlug.set(category.slug, record.id);
    }
    const providerProfiles = [
        { email: 'tariq.electrician@gmail.com', phone: '+923001234567', firstName: 'Tariq', lastName: 'Mehmood', citySlug: 'karachi', categorySlug: 'electrical-wiring', rating: 4.9, reviews: 38, bio: 'Certified electrician with expertise in wiring, solar inverters, and residential maintenance.', services: ['Inverter Wiring & Earthing', 'Breaker Panel Repair', 'CCTV Cable Setup'] },
        { email: 'naseem.plumber@gmail.com', phone: '+923101234567', firstName: 'Naseem', lastName: 'Siddiqui', citySlug: 'lahore', categorySlug: 'plumbing-pipework', rating: 4.8, reviews: 29, bio: 'Skilled plumber delivering water tank, bathroom, and drainage solutions with quick response.', services: ['Bathroom Fitting', 'Water Tank Installation', 'Drainage Repair'] },
        { email: 'saad.ac@gmail.com', phone: '+923201234567', firstName: 'Saad', lastName: 'Raza', citySlug: 'islamabad', categorySlug: 'ac-repair-servicing', rating: 4.7, reviews: 24, bio: 'AC specialist covering gas refill, deep cleaning, and inverter split units.', services: ['Split AC Gas Refill', 'Deep AC Cleaning', 'Compressor Service'] },
        { email: 'farhan.solar@gmail.com', phone: '+923301234567', firstName: 'Farhan', lastName: 'Khan', citySlug: 'rawalpindi', categorySlug: 'solar-inverter-setup', rating: 4.9, reviews: 33, bio: 'Solar installer for rooftop systems, batteries, and hybrid inverter setups.', services: ['Hybrid Solar Installation', 'Battery Bank Setup', 'Solar Net Metering Support'] },
        { email: 'hira.cleaning@gmail.com', phone: '+923401234567', firstName: 'Hira', lastName: 'Aslam', citySlug: 'peshawar', categorySlug: 'home-cleaning', rating: 4.8, reviews: 22, bio: 'Professional cleaning specialist for homes, offices, and water tank sanitation.', services: ['Deep House Cleaning', 'Sofa Shampooing', 'Water Tank Sanitization'] },
        { email: 'zara.tutor@gmail.com', phone: '+923501234567', firstName: 'Zara', lastName: 'Iqbal', citySlug: 'lahore', categorySlug: 'home-tutors', rating: 4.9, reviews: 41, bio: 'Experienced tutor for O/A Level, university prep, and spoken English.', services: ['Matric Physics Tutor', 'IELTS Preparation', 'Essay Writing Support'] },
        { email: 'usman.carpenter@gmail.com', phone: '+923601234567', firstName: 'Usman', lastName: 'Javed', citySlug: 'multan', categorySlug: 'carpentry-furniture', rating: 4.6, reviews: 18, bio: 'Furniture and carpentry expert for wardrobes, kitchen work, and door fittings.', services: ['Wardrobe Assembly', 'Kitchen Cabinet Install', 'Door Lock Fitting'] },
        { email: 'waqas.mechanic@gmail.com', phone: '+923701234567', firstName: 'Waqas', lastName: 'Mahmood', citySlug: 'quetta', categorySlug: 'auto-mechanic', rating: 4.7, reviews: 27, bio: 'Automobile technician for diagnostics, engine service, and mobile repairs.', services: ['Car Battery Replacement', 'Oil Change Service', 'Roadside Assistance'] },
        { email: 'javeria.mobile@gmail.com', phone: '+923801234567', firstName: 'Javeria', lastName: 'Ali', citySlug: 'hyderabad', categorySlug: 'mobile-repair', rating: 4.8, reviews: 30, bio: 'Phone expert for screens, charging ports, and motherboard repair.', services: ['Screen Replacement', 'Charging Port Repair', 'Data Recovery'] },
        { email: 'ahsan.computer@gmail.com', phone: '+923901234567', firstName: 'Ahsan', lastName: 'Malik', citySlug: 'sukkur', categorySlug: 'computer-repair', rating: 4.7, reviews: 25, bio: 'Computer technician for laptops, software issues, and hardware upgrades.', services: ['Laptop Keyboard Repair', 'Virus Removal', 'SSD Upgrade'] },
        { email: 'muneeb.paint@gmail.com', phone: '+924001234567', firstName: 'Muneeb', lastName: 'Aziz', citySlug: 'karachi', categorySlug: 'painting-finishing', rating: 4.6, reviews: 19, bio: 'Painter offering interior, exterior, and waterproofing finish work.', services: ['Interior Wall Paint', 'Waterproofing', 'Texture Finish'] },
        { email: 'bashir.mason@gmail.com', phone: '+924101234567', firstName: 'Bashir', lastName: 'Ahmed', citySlug: 'rawalpindi', categorySlug: 'masonry-construction', rating: 4.5, reviews: 17, bio: 'Mason handling brickwork, plastering, and small construction jobs.', services: ['Brick Wall Construction', 'Plastering Service', 'Tile Fitting'] },
        { email: 'shahzad.welder@gmail.com', phone: '+924201234567', firstName: 'Shahzad', lastName: 'Naeem', citySlug: 'gujranwala', categorySlug: 'welding-fabrication', rating: 4.8, reviews: 21, bio: 'Skilled welder for grills, gates, and bespoke metal fabrication.', services: ['Gate Fabrication', 'Steel Grill Repair', 'Custom Welding'] },
        { email: 'naila.beauty@gmail.com', phone: '+924301234567', firstName: 'Naila', lastName: 'Farooq', citySlug: 'lahore', categorySlug: 'beauty-salon', rating: 4.9, reviews: 35, bio: 'Beautician offering makeup, bridal styling, and salon at-home services.', services: ['Bridal Makeup', 'Party Makeup', 'Hair Styling'] },
        { email: 'arsalan.health@gmail.com', phone: '+924401234567', firstName: 'Arsalan', lastName: 'Memon', citySlug: 'karachi', categorySlug: 'healthcare-wellness', rating: 4.7, reviews: 26, bio: 'Wellness and rehabilitation support with at-home physiotherapy consults.', services: ['Physiotherapy Session', 'Elder Care Assistance', 'Nutritional Guidance'] },
    ];
    const providerPassword = await bcrypt.hash('ProviderPass@123', 10);
    const createdProviders = [];
    for (const provider of providerProfiles) {
        const city = cityBySlug.get(provider.citySlug);
        const user = await prisma.user.create({
            data: {
                email: provider.email,
                phone: provider.phone,
                passwordHash: providerPassword,
                role: client_1.UserRole.PROVIDER,
                status: client_1.UserStatus.ACTIVE,
                profile: {
                    create: {
                        firstName: provider.firstName,
                        lastName: provider.lastName,
                        city: provider.citySlug,
                        address: `${provider.citySlug} service area`,
                        provinceId: city?.provinceId,
                        cityId: city?.id,
                        districtId: (await prisma.district.findFirst({ where: { cityId: city?.id } }))?.id,
                        latitude: city?.latitude,
                        longitude: city?.longitude,
                        bio: provider.bio,
                    },
                },
                providerProfile: {
                    create: {
                        cnicNumber: `${randomBetween(10000, 99999)}-${randomBetween(1000000, 9999999)}-${randomBetween(1, 9)}`,
                        isVerified: true,
                        hourlyRate: randomBetween(1000, 3000),
                        rating: provider.rating,
                        totalReviews: provider.reviews,
                        serviceRadiusKm: randomBetween(10, 40),
                    },
                },
                wallet: { create: { balance: randomBetween(8000, 25000) } },
            },
            include: { providerProfile: true },
        });
        createdProviders.push(user);
    }
    const companyData = [
        { name: 'Elite Home Solutions', slug: 'elite-home-solutions', description: 'Multi-service home maintenance and repair studio.', ownerEmail: 'tariq.electrician@gmail.com', categorySlug: 'electrical-wiring', citySlug: 'karachi' },
        { name: 'BrightCare Cleaning Hub', slug: 'brightcare-cleaning-hub', description: 'Residential and commercial cleaning professionals.', ownerEmail: 'hira.cleaning@gmail.com', categorySlug: 'home-cleaning', citySlug: 'peshawar' },
        { name: 'SkillSprint Education', slug: 'skillsprint-education', description: 'Tutoring and exam preparation academy.', ownerEmail: 'zara.tutor@gmail.com', categorySlug: 'home-tutors', citySlug: 'lahore' },
        { name: 'MetroFix Tech Services', slug: 'metrofix-tech-services', description: 'Electronics repair and IT support center.', ownerEmail: 'ahsan.computer@gmail.com', categorySlug: 'computer-repair', citySlug: 'sukkur' },
    ];
    for (const company of companyData) {
        const owner = await prisma.user.findUnique({ where: { email: company.ownerEmail } });
        const category = await prisma.category.findUnique({ where: { slug: company.categorySlug } });
        const city = cityBySlug.get(company.citySlug);
        if (!owner || !category || !city)
            continue;
        await prisma.company.create({
            data: {
                name: company.name,
                slug: company.slug,
                description: company.description,
                ownerId: owner.id,
                provinceId: city.provinceId,
                cityId: city.id,
                categoryId: category.id,
                isVerified: true,
            },
        });
    }
    const createdCompanyLookup = new Map();
    const companies = await prisma.company.findMany({ select: { slug: true, id: true, ownerId: true } });
    companies.forEach((company) => createdCompanyLookup.set(company.ownerId, company.id));
    const serviceTemplates = {
        'electrical-wiring': [
            ['Domestic Wiring Service', 'Complete electrical wiring for new and existing homes.', 4500],
            ['Circuit Breaker Repair', 'Diagnostics and replacement of breakers and distribution boards.', 2200],
            ['Fan and Light Installation', 'Professional fan, chandelier, and lighting installation.', 1800],
        ],
        'plumbing-pipework': [
            ['Bathroom Plumbing Service', 'Sink, shower, and toilet plumbing fix and installation.', 2800],
            ['Water Tank Fitting', 'Water tank installation and connection service.', 2400],
            ['Drainage and Sewer Cleaning', 'Clog removal and drainage maintenance.', 1900],
        ],
        'ac-repair-servicing': [
            ['Split AC Gas Recharge', 'Safe refrigerant top-up with pressure testing.', 4200],
            ['Inverter AC Service', 'Deep cleaning and electrical diagnostics.', 3600],
            ['AC Compressor Repair', 'Compressor testing and replacement service.', 5200],
        ],
        'solar-inverter-setup': [
            ['Rooftop Solar Setup', 'Complete rooftop solar panel installation and tuning.', 95000],
            ['Hybrid Inverter Installation', 'Grid and battery hybrid inverter setup.', 38000],
            ['Solar Battery Maintenance', 'Battery health check and replacement support.', 12500],
        ],
        'home-cleaning': [
            ['Deep House Cleaning', 'Full home cleaning including kitchen, washroom, and floor scrubbing.', 5500],
            ['Sofa Shampooing', 'Professional upholstery and sofa cleaning.', 3200],
            ['Water Tank Sanitization', 'Water tank cleaning and disinfecting service.', 2400],
        ],
        'home-tutors': [
            ['Online Maths Tutoring', 'Interactive maths tutoring for school and college students.', 1800],
            ['IELTS Coaching', 'Speaking, writing, and listening IELTS preparation.', 3000],
            ['Essay Writing Help', 'Essay support for assignments and academic writing.', 2200],
        ],
        'carpentry-furniture': [
            ['Wardrobe Assembly', 'Custom wardrobe fitting and finishing service.', 7800],
            ['Kitchen Cabinet Installation', 'Built-in cabinet setup and repair.', 9600],
            ['Door Lock Fitting', 'Precise door and lock installation service.', 2500],
        ],
        'auto-mechanic': [
            ['Car Battery Replacement', 'Battery testing, replacement, and fitting.', 9000],
            ['Engine Oil Change', 'Quick oil, filter, and lubrication service.', 3200],
            ['Roadside Assistance', 'Emergency towing and jump-start support.', 5000],
        ],
        'mobile-repair': [
            ['Screen Replacement', 'High-quality display replacement for phones.', 6000],
            ['Charging Port Repair', 'Fast repair for weak or damaged charging ports.', 2800],
            ['Data Recovery', 'Recover contacts, messages, and device content.', 4000],
        ],
        'computer-repair': [
            ['Laptop Keyboard Repair', 'Keyboard replacement and board diagnostics.', 3500],
            ['Virus Removal', 'Complete malware cleanup and system optimization.', 2800],
            ['SSD Upgrade', 'Drive upgrade and OS migration support.', 6200],
        ],
        'painting-finishing': [
            ['Interior Wall Painting', 'Fresh interior paint and finishing touch-ups.', 6400],
            ['Waterproofing Service', 'Roof and wall waterproofing solutions.', 7800],
            ['Texture Finish', 'Wall texturing and decorative wall designs.', 8400],
        ],
        'masonry-construction': [
            ['Brick Wall Construction', 'Reliable brickwork for homes and boundary walls.', 9800],
            ['Plastering Service', 'Interior and exterior plastering finish.', 7200],
            ['Tile Fitting', 'Wall and floor tiling for homes and offices.', 8600],
        ],
        'welding-fabrication': [
            ['Gate Fabrication', 'Steel gate design and fabrication service.', 12500],
            ['Grill Repair', 'Repair of iron grills and metal frames.', 4700],
            ['Custom Metal Welding', 'One-off metal fabrication and welding.', 8400],
        ],
        'beauty-salon': [
            ['Bridal Makeup', 'Complete bridal beauty and hair styling service.', 12000],
            ['Party Makeup', 'Special occasion makeup for weddings and events.', 5000],
            ['Hair Styling', 'Stylish haircut and finish for all ages.', 2500],
        ],
        'healthcare-wellness': [
            ['Physiotherapy Session', 'Mobility and posture improvement session.', 2500],
            ['Elder Care Assistance', 'Daily care and support for seniors.', 4000],
            ['Diet and Nutrition Guidance', 'Personalized nutrition planning.', 3000],
        ],
        'education-coaching': [
            ['Spoken English Coaching', 'Conversation-focused English learning program.', 2000],
            ['Coding Beginner Lessons', 'Basic coding and problem-solving sessions.', 2200],
            ['Academic Support', 'Homework and concept clarity help.', 1600],
        ],
        'it-software-development': [
            ['Website Development', 'Modern business website design and deployment.', 18000],
            ['App Development', 'Custom mobile and desktop app solutions.', 35000],
            ['ERP Support', 'Software implementation and maintenance.', 22000],
        ],
        'digital-marketing': [
            ['Social Media Management', 'Content planning, posting, and audience growth.', 12000],
            ['SEO Optimization', 'On-page and technical SEO support.', 9000],
            ['Ad Campaign Setup', 'Google Ads and Meta campaign configuration.', 15000],
        ],
        'content-design': [
            ['Logo Design', 'Identity design and brand mark creation.', 7000],
            ['Video Editing', 'Short-form and promotional video editing.', 12000],
            ['Packaging Design', 'Professional packaging concept and layout.', 9000],
        ],
        'automobile-maintenance': [
            ['Car Detailing', 'Interior and exterior detailing service.', 6000],
            ['Vehicle Inspection', 'Comprehensive inspection and report.', 2800],
            ['Upholstery Service', 'Car seat and interior upholstery care.', 5000],
        ],
        'agriculture-farming': [
            ['Farm Consultancy', 'Crop planning and farm productivity advice.', 4500],
            ['Irrigation Setup', 'Furrow and drip irrigation installation.', 8700],
            ['Poultry Support', 'Poultry health and farm management guidance.', 3200],
        ],
        'events-catering': [
            ['Wedding Decor', 'Theme-based wedding and celebration decor.', 18000],
            ['Photography Package', 'Event photography service for guests and details.', 15000],
            ['Catering Service', 'Buffet and meal service for events.', 22000],
        ],
        'business-consulting': [
            ['Accounting Support', 'Bookkeeping and monthly financial reports.', 8000],
            ['HR Consulting', 'Recruitment and workplace policy support.', 10000],
            ['Legal Documentation', 'Business paperwork and registration support.', 7000],
        ],
        'security-protection': [
            ['CCTV Installation', 'Indoor and outdoor CCTV setup with monitoring.', 18000],
            ['Locksmith Service', 'Lock fitting, replacement, and repair.', 4000],
            ['Alarm Maintenance', 'Alarm system testing and servicing.', 6500],
        ],
        'appliance-repair': [
            ['Fridge Repair', 'Cooling system and compressor diagnostics.', 6000],
            ['Washing Machine Repair', 'Motor and drum-related repair.', 5500],
            ['Microwave Service', 'Heating element and circuit service.', 4200],
        ],
        'tailoring-fashion': [
            ['Suit Alteration', 'Professional fitting and seam adjustments.', 2200],
            ['Embroidery Service', 'Custom embroidery for uniforms and garments.', 3000],
            ['Uniform Tailoring', 'School and corporate uniform tailoring.', 2600],
        ],
        'vehicle-driver-services': [
            ['Driver Hire', 'Hourly or daily driver rental service.', 2500],
            ['Local Transfer', 'Airport and city transfer service.', 3000],
            ['Delivery Support', 'Small package and parcel delivery assistance.', 1800],
        ],
        'pest-control': [
            ['Cockroach Control', 'Fumigation and prevention treatment.', 3500],
            ['Mosquito Spray', 'Indoor mosquito control service.', 3000],
            ['Termite Treatment', 'Termite prevention and control service.', 9000],
        ],
        'interior-design': [
            ['Space Planning', 'Interior layout and room optimization.', 12000],
            ['Modular Kitchen Design', 'Kitchen planning and installation consultation.', 25000],
            ['Renovation Consultation', 'Designer advice for renovations.', 9000],
        ],
        'moving-packing': [
            ['House Shifting', 'Loading, transport, and unloading service.', 18000],
            ['Packing Service', 'Professional packing for fragile items.', 6000],
            ['Office Relocation', 'Office move planning and execution.', 22000],
        ],
    };
    const providerUserIds = await prisma.user.findMany({ where: { role: client_1.UserRole.PROVIDER }, select: { id: true, providerProfile: true } });
    for (const [index, providerUser] of providerUserIds.entries()) {
        const providerMeta = providerProfiles[index];
        const categoryId = serviceCategoryBySlug.get(providerMeta.categorySlug);
        const providerProfile = providerUser.providerProfile;
        if (!providerProfile)
            continue;
        const companyId = createdCompanyLookup.get(providerUser.id);
        if (companyId) {
            await prisma.providerProfile.update({ where: { id: providerProfile.id }, data: { companyId } });
        }
        const templates = serviceTemplates[providerMeta.categorySlug] ?? [];
        for (const [title, description, price] of templates) {
            await prisma.service.create({
                data: {
                    providerId: providerProfile.id,
                    categoryId,
                    title,
                    description,
                    basePrice: price,
                    durationMinutes: randomBetween(45, 180),
                    isAvailable: true,
                },
            });
        }
    }
    const services = await prisma.service.findMany({ include: { provider: true } });
    const customersList = await prisma.user.findMany({ where: { role: client_1.UserRole.CUSTOMER }, select: { id: true } });
    const providersList = await prisma.user.findMany({ where: { role: client_1.UserRole.PROVIDER }, select: { id: true } });
    for (let index = 0; index < Math.min(45, services.length); index++) {
        const service = services[index];
        const customer = customersList[index % customersList.length];
        const provider = providersList[index % providersList.length];
        const bookingCode = `SCPK-${100000 + index}`;
        const booking = await prisma.booking.create({
            data: {
                bookingCode,
                customerId: customer.id,
                providerId: provider.id,
                serviceId: service.id,
                status: index % 3 === 0 ? client_1.BookingStatus.COMPLETED : client_1.BookingStatus.ACCEPTED,
                scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (index + 1)),
                totalAmount: service.basePrice + 500,
                commissionFee: Math.round(service.basePrice * 0.1),
                providerEarning: service.basePrice - Math.round(service.basePrice * 0.1),
                address: `Service address ${index + 1}`,
                latitude: 33.6844 + index * 0.001,
                longitude: 73.0479 + index * 0.001,
                notes: 'Demo booking generated during seeding.',
                completedAt: index % 3 === 0 ? new Date(Date.now() - 1000 * 60 * 60 * 24 * (index + 1)) : null,
            },
        });
        await prisma.payment.create({
            data: {
                bookingId: booking.id,
                userId: customer.id,
                amount: booking.totalAmount,
                method: client_1.PaymentMethod.CASH_ON_DELIVERY,
                status: client_1.PaymentStatus.PAID,
                transactionId: `txn-${index + 1}`,
            },
        });
        if (index % 2 === 0) {
            const providerUser = await prisma.user.findUnique({ where: { id: provider.id }, include: { providerProfile: true } });
            const rating = randomBetween(4, 5);
            await prisma.review.create({
                data: {
                    bookingId: booking.id,
                    reviewerId: customer.id,
                    providerId: provider.id,
                    rating,
                    comment: `Professional service delivered with clear communication and quick turnaround.`,
                },
            });
            if (providerUser?.providerProfile) {
                await prisma.providerProfile.update({
                    where: { id: providerUser.providerProfile.id },
                    data: {
                        rating: ((providerUser.providerProfile.rating * providerUser.providerProfile.totalReviews) + rating) / (providerUser.providerProfile.totalReviews + 1),
                        totalReviews: providerUser.providerProfile.totalReviews + 1,
                    },
                });
            }
        }
    }
    console.log('Seeding completed successfully.');
}
main()
    .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map
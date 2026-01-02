
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const navigationData = [
    {
        id: 'foods',
        label: 'FOODS',
        href: '/products/foods',
        type: 'dropdown',
        columns: [
            {
                title: 'ACHAR (Pickle)',
                groups: [
                    {
                        title: 'VEG',
                        items: [
                            { label: 'Mix', href: '/products/foods/achar/veg/mix' },
                            { label: 'Radish', href: '/products/foods/achar/veg/radish' },
                            { label: 'Mushroom', href: '/products/foods/achar/veg/mushroom' },
                            { label: 'Gundruk', href: '/products/foods/achar/veg/gundruk' },
                            { label: 'Timur chhop (Powder)', href: '/products/foods/achar/veg/timur-chhop-(powder)' },
                            { label: 'Timur chhop (Oily)', href: '/products/foods/achar/veg/timur-chhop-(oily)' },
                        ]
                    },
                    {
                        title: 'NON VEG',
                        items: [
                            { label: 'Buff', href: '/products/foods/achar/non-veg/buff' },
                            { label: 'Chicken', href: '/products/foods/achar/non-veg/chicken' },
                            { label: 'Pork', href: '/products/foods/achar/non-veg/pork' },
                            { label: 'Mutton', href: '/products/foods/achar/non-veg/mutton' },
                            { label: 'Fish', href: '/products/foods/achar/non-veg/fish' },
                            { label: 'Timur chhap with Fish', href: '/products/foods/achar/non-veg/timur-chhap-with-fish' },
                        ]
                    }
                ]
            },
            {
                title: 'TEA',
                items: [
                    { label: 'Green Tea (Tea Bag)', href: '/products/foods/tea/green-tea-(tea-bag)' },
                    { label: 'CTC Masala Tea', href: '/products/foods/tea/ctc-masala-tea' },
                    { label: 'Golden Needle', href: '/products/foods/tea/golden-needle' },
                    { label: 'Silver Needle', href: '/products/foods/tea/silver-needle' },
                ]
            },
            {
                title: 'TYPICAL NEPALI',
                items: [
                    { label: 'Pustakari', href: '/products/foods/nepali/pustakari' },
                    { label: 'Gudpak', href: '/products/foods/nepali/gudpak' },
                    { label: 'Honey', href: '/products/foods/nepali/honey' },
                    { label: 'Buff Sukuti', href: '/products/foods/nepali/buff-sukuti' },
                    { label: 'Sukuti (Dry meat)', href: '/products/foods/nepali/sukuti-(dry-meat)' },
                    { label: 'Asala Dry Fish', href: '/products/foods/nepali/asala-dry-fish' },
                    { label: 'Dry Sidra', href: '/products/foods/nepali/dry-sidra' },
                    { label: 'Ghee', href: '/products/foods/nepali/ghee' },
                ]
            },
            {
                title: 'SPICE (MASALA)',
                items: [
                    { label: 'Momo', href: '/products/foods/spice/momo' },
                    { label: 'Thukpa / Choumine', href: '/products/foods/spice/thukpa-/-choumine' },
                    { label: 'Chatpate', href: '/products/foods/spice/chatpate' },
                    { label: 'Meat Curry', href: '/products/foods/spice/meat-curry' },
                    { label: 'Dal Makhani', href: '/products/foods/spice/dal-makhani' },
                    { label: 'Pani Puri', href: '/products/foods/spice/pani-puri' },
                    { label: 'Chicken Masala', href: '/products/foods/spice/chicken-masala' },
                    { label: 'Garam Masala', href: '/products/foods/spice/garam-masala' },
                ]
            }
        ]
    },
    {
        id: 'gift-souvenir',
        label: 'GIFT and SOUVENIR',
        href: '/products/gift-souvenir',
        type: 'link'
    },
    {
        id: 'puja-samagri',
        label: 'PUJA SAMAGRI',
        href: '/products/puja-samagri',
        type: 'link'
    },
    {
        id: 'handicrafts',
        label: 'HANDICRAFTS',
        href: '/products/handicrafts',
        type: 'link'
    },
    {
        id: 'dress',
        label: 'DRESS',
        href: '/products/dress',
        type: 'dropdown',
        columns: [
            {
                title: 'WOMEN',
                items: [
                    { label: 'Lehanga', href: '/products/dress/women/lehanga' },
                    { label: 'Saree', href: '/products/dress/women/saree' },
                    { label: 'Gown', href: '/products/dress/women/gown' },
                    { label: 'Kurtha', href: '/products/dress/women/kurtha' },
                    { label: 'Newari', href: '/products/dress/women/newari' },
                    { label: 'Gurung/Magar', href: '/products/dress/women/gurung/magar' },
                    { label: 'Tamang', href: '/products/dress/women/tamang' },
                    { label: 'Rai/Limbu', href: '/products/dress/women/rai/limbu' },
                    { label: 'Bridal Set', href: '/products/dress/women/bridal-set' },
                    { label: 'Choli', href: '/products/dress/women/choli' },
                ]
            },
            {
                title: 'MEN',
                items: [
                    { label: 'Daura Surwal', href: '/products/dress/men/daura-surwal' },
                    { label: 'Suit Set (2pcs/3pcs)', href: '/products/dress/men/suit-set-(2pcs/3pcs)' },
                    { label: 'Kurtha', href: '/products/dress/men/kurtha' },
                    { label: 'Newari', href: '/products/dress/men/newari' },
                    { label: 'Gurung/Magar', href: '/products/dress/men/gurung/magar' },
                    { label: 'Tamang', href: '/products/dress/men/tamang' },
                    { label: 'Rai/Limbu', href: '/products/dress/men/rai/limbu' },
                    { label: 'Bridal Set (Groom)', href: '/products/dress/men/bridal-set-(groom)' },
                ]
            },
            {
                title: 'KIDS',
                items: [
                    { label: 'Same as Women', href: '/products/dress/kids/women' },
                    { label: 'Same as Men', href: '/products/dress/kids/men' },
                ]
            }
        ]
    },
    {
        id: 'musical-instruments',
        label: 'MUSICAL INSTRUMENTS',
        href: '/products/musical-instruments',
        type: 'link'
    },
    {
        id: 'herbs-naturals',
        label: 'HERBS & NATURALS',
        href: '/products/herbs-naturals',
        type: 'link'
    },
    {
        id: 'books',
        label: 'BOOKS',
        href: '/products/books',
        type: 'link'
    }
];

async function main() {
    console.log('Seeding navigation menu...');

    await prisma.systemConfig.upsert({
        where: { key: 'navigation_menu' },
        update: { value: navigationData },
        create: {
            key: 'navigation_menu',
            value: navigationData
        }
    });

    console.log('Navigation menu seeded successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

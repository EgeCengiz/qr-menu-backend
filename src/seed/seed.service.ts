import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { SubCategoryEntity } from '../entities/sub-category.entity';
import { ProductEntity } from '../entities/product.entity';
import { WelcomeMediaEntity } from '../entities/welcome-media.entity';

interface SeedSubCategory {
  id: string;
  title: string;
  itemCount?: string;
}

interface SeedItem {
  id: number;
  name: string;
  desc: string;
  price: string;
  img: string;
  subCategory?: string;
  tags?: string[];
  isAvailable?: boolean;
}

interface SeedCategory {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  img: string;
  position: number;
  subCategories?: SeedSubCategory[];
  items: SeedItem[];
}

// Seed data from the frontend menuData.ts (videos excluded)
const SEED_CATEGORIES: SeedCategory[] = [
  {
    id: 'kahvalti',
    num: '01',
    title: 'Kahvaltı',
    subtitle: 'GÜNE İYİ BAŞLA',
    img: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=800',
    position: 1,
    subCategories: [
      { id: 'kahvaltilar', title: 'KAHVALTILAR' },
      { id: 'extra-kahvalti', title: 'EXTRA KAHVALTI' },
    ],
    items: [
      {
        id: 1,
        subCategory: 'kahvaltilar',
        name: 'EKMEK ÜSTÜ KAHVALTI',
        desc: 'ekşi mayalı ekmek üzerine eritilmiş mozzerella çeri domates roka yaprakları pesto sos parmak patates ve renç sos ile',
        price: '300,00 ₺',
        img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 2,
        subCategory: 'kahvaltilar',
        name: 'GARANOLO BOWL',
        desc: 'yoğurt üzerine mevsim meyveleri garanola badem chia tohumu',
        price: '350,00 ₺',
        img: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 3,
        subCategory: 'kahvaltilar',
        name: 'İDEAL KAHVALTI',
        desc: '2 KİŞİLİK- BEYAZ PEYNİR-KAŞAR-BURGER PEYNİR-BAL KAYMAK-TEREYAĞI-REÇEL-ZEYTİN-DOMATES-SALATALIK-OMLET-PATATES-SİGARABÖREĞİ-SOĞAN HALKASI',
        price: '900,00 ₺',
        img: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 4,
        subCategory: 'kahvaltilar',
        name: 'KAHVALTI ÇAYI',
        desc: 'taze demlenmiş rize çayı',
        price: '0,00 ₺',
        img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 5,
        subCategory: 'kahvaltilar',
        name: 'KAHVALTI SALATASI',
        desc: 'simit-çeri domates-salatalık-ezine peynizi-yeşil biber-mısır-vini gret sos',
        price: '360,00 ₺',
        img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 6,
        subCategory: 'kahvaltilar',
        name: 'KAHVALTI TABAĞI',
        desc: 'beyaz peynir, kaşar peynir, burgu peyniri, siyah zeytin, yeşil zeytin, biberli yeşil zeytin, domates salatalık, yeşillik, bal, vişne reçel, ayva reçel, çikolata, sahanda yumurta, patates, sosis, sigara böreği',
        price: '450,00 ₺',
        img: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 7,
        subCategory: 'kahvaltilar',
        name: 'PEYNİR TABAĞI',
        desc: 'ezine, kaşar, tulum ve burgu peyniri çeşitleri, ceviz ve mevsim meyveleri ile',
        price: '200,00 ₺',
        img: 'https://images.unsplash.com/photo-1631379578550-7038263db699?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 8,
        subCategory: 'kahvaltilar',
        name: 'SERPME KAHVALTI KİŞİ BAŞI',
        desc: 'ezine peyniri, beyaz peynir, kaşar, burgu peynir, topi peynir, maydanoz, çörek otlu minci, tereyağı, siyah zeytin, çizik zeytin, biberli, yeşil zeytin, bal-kaymak, tahin-pekmez, vişne reçeli, ayva reçeli, çikolata, kahvaltılık ezme. (EN AZ İKİ KİŞİ İLE SERVİS AÇILMAKTADIR)',
        price: '650,00 ₺',
        img: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 9,
        subCategory: 'kahvaltilar',
        name: 'YAZ KAHVALTISI',
        desc: 'fresh meyve-soğuk yoğurt-badem-ceviz',
        price: '300,00 ₺',
        img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 10,
        subCategory: 'kahvaltilar',
        name: 'MIHLAMA / KUYMAK',
        desc: 'yayla tereyağı mısır unu ve köy kolot peyniri ile',
        price: '260,00 ₺',
        img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 11,
        subCategory: 'extra-kahvalti',
        name: 'PASTIRMA',
        desc: 'ızgarada sotelenmiş özel pastırma dilimleri',
        price: '350,00 ₺',
        img: 'https://images.unsplash.com/photo-1544025162-8315ea07620a?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 12,
        subCategory: 'extra-kahvalti',
        name: 'BEYAZ PEYNİRLİ OMLET',
        desc: 'akdeniz yeşillikleri ve green sos ile',
        price: '165,00 ₺',
        img: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 13,
        subCategory: 'extra-kahvalti',
        name: 'SUCUKLU SAHANDA YUMURTA',
        desc: 'özel afyon sucuğu ve sahanda tereyağlı yumurta',
        price: '220,00 ₺',
        img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 14,
        subCategory: 'extra-kahvalti',
        name: 'KAVURMALI SAHANDA YUMURTA',
        desc: 'rize kavurması ile sahanda yumurta',
        price: '280,00 ₺',
        img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 15,
        subCategory: 'extra-kahvalti',
        name: 'MENEMEN',
        desc: 'taze domates, sivri biber ve yumurta',
        price: '190,00 ₺',
        img: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 16,
        subCategory: 'extra-kahvalti',
        name: 'PATATES KIZARTMASI',
        desc: 'özel baharatlı parmak patates',
        price: '140,00 ₺',
        img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 17,
        subCategory: 'extra-kahvalti',
        name: 'SİGARA BÖREĞİ',
        desc: 'el açması çıtır peynirli börek (6 adet)',
        price: '150,00 ₺',
        img: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 18,
        subCategory: 'extra-kahvalti',
        name: 'PANCAKE TABAĞI',
        desc: 'taze meyveler ve sıcak çikolata sosu ile',
        price: '210,00 ₺',
        img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
    ],
  },
  {
    id: 'mutfak',
    num: '02',
    title: 'Mutfak',
    subtitle: 'ŞEFTEN İMZA LEZZETLER',
    img: 'https://images.unsplash.com/photo-1544025162-8315ea07620a?auto=format&fit=crop&q=80&w=800',
    position: 2,
    subCategories: [
      { id: 'burger-sandvic', title: 'BURGER & SANDVİÇ' },
      { id: 'izgaralar', title: 'IZGARALAR & ANA YEMEKLER' },
      { id: 'makarnalar', title: 'MAKARNALAR & PASTA' },
    ],
    items: [
      {
        id: 19,
        subCategory: 'burger-sandvic',
        name: 'HOOKAHLAB SPECIAL BURGER',
        desc: '180gr dana köfte, karamelize soğan, cheddarlı özel lab sosu ve parmak patates ile',
        price: '380,00 ₺',
        img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 20,
        subCategory: 'burger-sandvic',
        name: 'CHICKEN CRISPY BURGER',
        desc: 'çıtır tavuk bonfile, sezar sos, marul, turşu ve patates kızartması',
        price: '320,00 ₺',
        img: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 21,
        subCategory: 'izgaralar',
        name: 'DANA ANTRİKOT IZGARA',
        desc: 'fırınlanmış patates püre yatağında, özel mantar sosu ve ızgara sebzeler eşliğinde 200gr antrikot',
        price: '680,00 ₺',
        img: 'https://images.unsplash.com/photo-1544025162-8315ea07620a?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 22,
        subCategory: 'izgaralar',
        name: 'TAVUK FAJITA',
        desc: 'sote biber ve soğanlarla renkli döküm tavada, tortilla ekmeği ve özel soslar ile',
        price: '380,00 ₺',
        img: 'https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 23,
        subCategory: 'makarnalar',
        name: 'PENNE ARRABBIATA',
        desc: 'acılı domates sos, siyah zeytin, taze fesleğen ve parmesan peyniri',
        price: '240,00 ₺',
        img: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 24,
        subCategory: 'makarnalar',
        name: 'FETTUCCINE ALFREDO',
        desc: 'julyen tavuk dilimleri, krema, kültür mantarı ve taze fesleğen',
        price: '270,00 ₺',
        img: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
    ],
  },
  {
    id: 'kahve-sicak',
    num: '03',
    title: 'Kahve & Sıcak',
    subtitle: 'TAZE DEMLEME & KAHVELER',
    img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800',
    position: 3,
    subCategories: [
      { id: 'espresso-bazli', title: 'ESPRESSO BAZLI' },
      { id: 'demleme-caylar', title: 'DEMLEME & BİTKİ ÇAYLARI' },
    ],
    items: [
      {
        id: 25,
        subCategory: 'espresso-bazli',
        name: 'LATTE MACCHIATO',
        desc: 'taze kavrulmuş espresso çekirdekleri ve kadifemsi süt köpüğü',
        price: '110,00 ₺',
        img: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 26,
        subCategory: 'espresso-bazli',
        name: 'CAPPUCCINO',
        desc: 'yoğun espresso bazı ve bol süt köpüğü',
        price: '105,00 ₺',
        img: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 27,
        subCategory: 'espresso-bazli',
        name: 'AMERICANO',
        desc: 'çift shot espresso ve sıcak su',
        price: '95,00 ₺',
        img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 28,
        subCategory: 'demleme-caylar',
        name: 'TÜRK ÇAYI (BARDAK)',
        desc: 'özel rize harmanı taze demlenmiş çay',
        price: '35,00 ₺',
        img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 29,
        subCategory: 'demleme-caylar',
        name: 'KİŞ ÇAYI DEMLİK',
        desc: 'ıhlamur, adaçayı, zencefil, çubuk tarçın, karanfil ve bal',
        price: '160,00 ₺',
        img: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
    ],
  },
  {
    id: 'soguk-icecekler',
    num: '04',
    title: 'Soğuk İçecekler',
    subtitle: 'FERAHLATAN LEZZETLER',
    img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800',
    position: 4,
    subCategories: [
      { id: 'frozen-milkshake', title: 'FROZEN & MILKSHAKE' },
      { id: 'kokteyller', title: 'MOCKTAIL & MEYVE SUYU' },
    ],
    items: [
      {
        id: 30,
        subCategory: 'frozen-milkshake',
        name: 'MANGO FROZEN',
        desc: 'taze mango püresi, kırılmış buz ve nane',
        price: '155,00 ₺',
        img: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 31,
        subCategory: 'frozen-milkshake',
        name: 'BELÇİKA ÇİKOLATALI MILKSHAKE',
        desc: 'gerçek belçika çikolatası dondurması, soğuk süt ve krema',
        price: '165,00 ₺',
        img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 32,
        subCategory: 'kokteyller',
        name: 'MOJITO VIRGIN',
        desc: 'taze nane, misket limonu, esmer şeker ve soda',
        price: '145,00 ₺',
        img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
    ],
  },
  {
    id: 'tatlilar',
    num: '05',
    title: 'Tatlılar',
    subtitle: 'TATLI BİR MOLA',
    img: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=800',
    position: 5,
    subCategories: [
      { id: 'pastalar', title: 'PASTALAR & CHEESECAKE' },
      { id: 'sicak-tatlilar', title: 'SICAK TATLILAR' },
    ],
    items: [
      {
        id: 33,
        subCategory: 'pastalar',
        name: 'SAN SEBASTIAN CHEESECAKE',
        desc: 'orijinal reçete, yanında eritilmiş sıcak Belçika çikolatası ile servis edilir',
        price: '210,00 ₺',
        img: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 34,
        subCategory: 'sicak-tatlilar',
        name: 'SICAK ÇİKOLATALI SUFLE',
        desc: 'akışkan bitter çikolatalı iç dolgu, yanında sade dondurma ile',
        price: '185,00 ₺',
        img: 'https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
    ],
  },
  {
    id: 'nargile',
    num: '06',
    title: 'Hookah',
    subtitle: 'ÖZEL KARIŞIMLAR',
    img: 'https://images.unsplash.com/photo-1510375685784-2131976079c6?auto=format&fit=crop&q=80&w=800',
    position: 6,
    subCategories: [
      { id: 'imza-karisimlar', title: 'İMZA KARIŞIMLAR' },
      { id: 'klasik-aroma', title: 'KLASİK AROMALAR' },
    ],
    items: [
      {
        id: 35,
        subCategory: 'imza-karisimlar',
        name: 'LAB SIGNATURE NARGİLE',
        desc: 'ananas, nane, çarkıfelek meyvesi ve gizli lab şurubu ile hazırlanmış imza karışım',
        price: '450,00 ₺',
        img: 'https://images.unsplash.com/photo-1510375685784-2131976079c6?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
      {
        id: 36,
        subCategory: 'klasik-aroma',
        name: 'KLASİK ÇİFT ELMA',
        desc: 'anason ve elmanın geleneksel, sert ve yoğun buluşması',
        price: '350,00 ₺',
        img: 'https://images.unsplash.com/photo-1579545802287-34758d8442a8?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
      },
    ],
  },
];

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
    @InjectRepository(SubCategoryEntity)
    private readonly subCategoryRepo: Repository<SubCategoryEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(WelcomeMediaEntity)
    private readonly welcomeRepo: Repository<WelcomeMediaEntity>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedWelcomeMedia();
    await this.seedCategories();
  }

  private async seedWelcomeMedia() {
    const count = await this.welcomeRepo.count();
    if (count > 0) return;

    await this.welcomeRepo.save({
      videoUrl: null,
      posterImg:
        'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=800',
      title: 'HOOKAHLAB LOUNGE & CAFE',
      subtitle: 'PREMIUM QR MENU EXPERIENCE',
      durationSeconds: 4,
    });
    this.logger.log('Welcome media seeded');
  }

  private async seedCategories() {
    const count = await this.categoryRepo.count();
    if (count > 0) {
      this.logger.log(`Database already has ${count} categories — skipping seed`);
      return;
    }

    let totalProducts = 0;

    for (const seedCat of SEED_CATEGORIES) {
      // Save category
      const category = this.categoryRepo.create({
        id: seedCat.id,
        num: seedCat.num,
        title: seedCat.title,
        subtitle: seedCat.subtitle,
        img: seedCat.img,
        position: seedCat.position,
        videoUrl: null,
      });
      await this.categoryRepo.save(category);

      // Save sub categories
      const subCatMap: Record<string, SubCategoryEntity> = {};
      if (seedCat.subCategories) {
        for (let i = 0; i < seedCat.subCategories.length; i++) {
          const sc = seedCat.subCategories[i];
          const subCat = this.subCategoryRepo.create({
            id: `${seedCat.id}__${sc.id}`,
            title: sc.title,
            position: i,
            categoryId: category.id,
          });
          const saved = await this.subCategoryRepo.save(subCat);
          // Map original id to saved entity (using original short id for item lookup)
          subCatMap[sc.id] = saved;
        }
      }

      // Save products
      for (let i = 0; i < seedCat.items.length; i++) {
        const item = seedCat.items[i];
        const subCatEntity = item.subCategory ? subCatMap[item.subCategory] : null;

        const product = this.productRepo.create({
          id: item.id,
          name: item.name,
          desc: item.desc,
          price: item.price,
          img: item.img,
          tags: item.tags ? JSON.stringify(item.tags) : null,
          isAvailable: item.isAvailable ?? true,
          position: i,
          categoryId: category.id,
          subCategoryId: subCatEntity?.id ?? null,
        });
        await this.productRepo.save(product);
        totalProducts++;
      }
    }

    this.logger.log(
      `Seeded ${SEED_CATEGORIES.length} categories with ${totalProducts} products`,
    );
  }
}

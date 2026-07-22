// Переводы данных каталога по стабильному carSlug и по значениям характеристик.
// Клиент-безопасно (без server-only). Оригинальные данные в БД не меняются.
// Названия моделей (fullName) не переводим.

import type { Locale } from "@/lib/locale";
import { LOCALES } from "@/lib/locale";

type L<T> = Record<Locale, T>;

// --- Описания автомобилей по slug (все 8, на 4 языках) ---
export const CAR_DESCRIPTIONS: Record<string, L<string>> = {
  "audi-q7": {
    ru: "Полноразмерный премиум-внедорожник на 7 мест. Мощный двигатель, полный привод, роскошный салон и передовые системы безопасности.",
    en: "A full-size premium 7-seat SUV. Powerful engine, all-wheel drive, luxurious interior and advanced safety systems.",
    uk: "Повнорозмірний преміум-позашляховик на 7 місць. Потужний двигун, повний привід, розкішний салон та передові системи безпеки.",
    he: "רכב שטח יוקרתי בגודל מלא ל-7 נוסעים. מנוע חזק, הנעה כפולה, תא נוסעים מפואר ומערכות בטיחות מתקדמות.",
  },
  "bmw-5-series": {
    ru: "Представительный бизнес-седан для деловых поездок и особых случаев. Мощный двигатель, премиальный салон и комфортная подвеска.",
    en: "An executive business sedan for business trips and special occasions. Powerful engine, premium interior and a comfortable suspension.",
    uk: "Представницький бізнес-седан для ділових поїздок та особливих випадків. Потужний двигун, преміальний салон та комфортна підвіска.",
    he: "סדאן עסקי מפואר לנסיעות עסקים ולאירועים מיוחדים. מנוע חזק, תא נוסעים פרימיום ומתלים נוחים.",
  },
  "hyundai-accent": {
    ru: "Экономичный и надёжный седан для города и коротких поездок. Простой в управлении, с невысоким расходом топлива и вместительным для класса багажником.",
    en: "An economical and reliable sedan for the city and short trips. Easy to drive, with low fuel consumption and a roomy trunk for its class.",
    uk: "Економічний та надійний седан для міста й коротких поїздок. Простий в керуванні, з невисокою витратою пального та містким для класу багажником.",
    he: "סדאן חסכוני ואמין לעיר ולנסיעות קצרות. קל לנהיגה, עם צריכת דלק נמוכה ותא מטען מרווח לרמתו.",
  },
  "mercedes-v-class": {
    ru: "Вместительный и комфортный минивэн для больших компаний, семейных поездок и трансферов. Просторный салон на 7 мест и много места для багажа.",
    en: "A spacious and comfortable minivan for big groups, family trips and transfers. A roomy 7-seat interior and plenty of luggage space.",
    uk: "Місткий та комфортний мінівен для великих компаній, сімейних поїздок і трансферів. Просторий салон на 7 місць і багато місця для багажу.",
    he: "מיניוואן מרווח ונוח לקבוצות גדולות, נסיעות משפחתיות והסעות. תא ל-7 נוסעים והרבה מקום למטען.",
  },
  "skoda-octavia": {
    ru: "Просторный лифтбек с большим багажником — отличный выбор для поездок с багажом и дальних маршрутов. Экономичный дизельный двигатель.",
    en: "A spacious liftback with a large trunk — a great choice for trips with luggage and long routes. Economical diesel engine.",
    uk: "Просторий ліфтбек з великим багажником — чудовий вибір для поїздок із багажем та далеких маршрутів. Економічний дизельний двигун.",
    he: "ליפטבק מרווח עם תא מטען גדול — בחירה מצוינת לנסיעות עם מטען ולמסלולים ארוכים. מנוע דיזל חסכוני.",
  },
  "toyota-corolla": {
    ru: "Комфортный и надёжный седан для повседневных поездок и командировок. Плавный ход, тихий салон и автоматическая коробка передач.",
    en: "A comfortable and reliable sedan for everyday trips and business travel. Smooth ride, quiet cabin and automatic transmission.",
    uk: "Комфортний та надійний седан для щоденних поїздок і відряджень. Плавний хід, тихий салон та автоматична коробка передач.",
    he: "סדאן נוח ואמין לנסיעות יומיומיות ולנסיעות עבודה. נסיעה חלקה, תא שקט ותיבת הילוכים אוטומטית.",
  },
  "toyota-rav4": {
    ru: "Полноприводный гибридный кроссовер с высокой посадкой и низким расходом топлива. Уверенно чувствует себя и в городе, и на трассе.",
    en: "An all-wheel-drive hybrid crossover with a high seating position and low fuel consumption. Confident both in the city and on the highway.",
    uk: "Повнопривідний гібридний кросовер з високою посадкою та низькою витратою пального. Впевнено почувається і в місті, і на трасі.",
    he: "קרוסאובר היברידי עם הנעה כפולה, ישיבה גבוהה וצריכת דלק נמוכה. מרגיש בטוח גם בעיר וגם בכביש המהיר.",
  },
  "volkswagen-polo": {
    ru: "Компактный и практичный хэтчбек с современным салоном. Удобен в городе, легко паркуется, экономичен на трассе.",
    en: "A compact and practical hatchback with a modern interior. Convenient in the city, easy to park, economical on the highway.",
    uk: "Компактний та практичний хетчбек із сучасним салоном. Зручний у місті, легко паркується, економічний на трасі.",
    he: "האצ'בק קומפקטי ומעשי עם תא נוסעים מודרני. נוח בעיר, קל לחניה וחסכוני בכביש המהיר.",
  },
  "porsche-cayenne": {
    ru: "Флагманский премиум-кроссовер Porsche с мощным двигателем 3.0 (340 л.с.), полным приводом и роскошным салоном. Динамика спорткара в сочетании с комфортом бизнес-класса.",
    en: "Porsche's flagship premium SUV with a powerful 3.0-litre engine (340 hp), all-wheel drive and a luxurious interior. Sports-car dynamics combined with executive comfort.",
    uk: "Флагманський преміум-кросовер Porsche з потужним двигуном 3.0 (340 к.с.), повним приводом і розкішним салоном. Динаміка спорткара в поєднанні з комфортом бізнес-класу.",
    he: "רכב השטח הפרימיום הדגל של פורשה עם מנוע 3.0 עוצמתי (340 כ\"ס), הנעה כפולה ותא נוסעים מפואר. דינמיקה של מכונית ספורט בשילוב עם נוחות מחלקת מנהלים.",
  },
  "audi-sq5": {
    ru: "Заряженный спортивный кроссовер Audi SQ5 с двигателем 3.0 (355 л.с.) и полным приводом quattro. Яркая динамика, премиальный салон и передовые технологии.",
    en: "The high-performance Audi SQ5 sport crossover with a 3.0-litre engine (355 hp) and quattro all-wheel drive. Vivid dynamics, a premium interior and advanced technology.",
    uk: "Заряджений спортивний кросовер Audi SQ5 з двигуном 3.0 (355 к.с.) та повним приводом quattro. Яскрава динаміка, преміальний салон і передові технології.",
    he: "קרוסאובר הספורט העוצמתי Audi SQ5 עם מנוע 3.0 (355 כ\"ס) והנעת quattro כפולה. דינמיקה חיה, תא נוסעים פרימיום וטכנולוגיה מתקדמת.",
  },
  "porsche-macan": {
    ru: "Компактный премиум-кроссовер Porsche Macan с двигателем 3.0 (340 л.с.), коробкой PDK и полным приводом. Спортивная управляемость и премиальный уровень отделки.",
    en: "The compact Porsche Macan premium crossover with a 3.0-litre engine (340 hp), a PDK gearbox and all-wheel drive. Sporty handling and a premium level of finish.",
    uk: "Компактний преміум-кросовер Porsche Macan з двигуном 3.0 (340 к.с.), коробкою PDK і повним приводом. Спортивна керованість і преміальний рівень оздоблення.",
    he: "קרוסאובר הפרימיום הקומפקטי Porsche Macan עם מנוע 3.0 (340 כ\"ס), תיבת PDK והנעה כפולה. שליטה ספורטיבית ורמת גימור פרימיום.",
  },
  "audi-q3": {
    ru: "Компактный премиум-кроссовер Audi Q3 с двигателем 2.0 (230 л.с.) и полным приводом quattro. Современный салон, богатое оснащение и удобная высокая посадка.",
    en: "The compact Audi Q3 premium crossover with a 2.0-litre engine (230 hp) and quattro all-wheel drive. A modern interior, rich equipment and a comfortable high seating position.",
    uk: "Компактний преміум-кросовер Audi Q3 з двигуном 2.0 (230 к.с.) та повним приводом quattro. Сучасний салон, багате оснащення і зручна висока посадка.",
    he: "קרוסאובר הפרימיום הקומפקטי Audi Q3 עם מנוע 2.0 (230 כ\"ס) והנעת quattro כפולה. תא נוסעים מודרני, אבזור עשיר וישיבה גבוהה ונוחה.",
  },
};

// --- Комплектация (features) по русскому значению из БД ---
export const FEATURE_LABELS: Record<string, L<string>> = {
  "Климат-контроль": { ru: "Климат-контроль", en: "Climate control", uk: "Клімат-контроль", he: "בקרת אקלים" },
  "Двухзонный климат-контроль": { ru: "Двухзонный климат-контроль", en: "Dual-zone climate control", uk: "Двозонний клімат-контроль", he: "בקרת אקלים דו-אזורית" },
  "Четырёхзонный климат-контроль": { ru: "Четырёхзонный климат-контроль", en: "Four-zone climate control", uk: "Чотиризонний клімат-контроль", he: "בקרת אקלים ארבע-אזורית" },
  "Кондиционер": { ru: "Кондиционер", en: "Air conditioning", uk: "Кондиціонер", he: "מיזוג אוויר" },
  "Кожаный салон": { ru: "Кожаный салон", en: "Leather interior", uk: "Шкіряний салон", he: "ריפוד עור" },
  "Панорамная крыша": { ru: "Панорамная крыша", en: "Panoramic roof", uk: "Панорамний дах", he: "גג פנורמי" },
  "Bluetooth": { ru: "Bluetooth", en: "Bluetooth", uk: "Bluetooth", he: "Bluetooth" },
  "USB": { ru: "USB", en: "USB", uk: "USB", he: "USB" },
  "Камера кругового обзора": { ru: "Камера кругового обзора", en: "360° camera", uk: "Камера кругового огляду", he: "מצלמת 360°" },
  "Камера заднего вида": { ru: "Камера заднего вида", en: "Rear-view camera", uk: "Камера заднього виду", he: "מצלמת רוורס" },
  "Датчики парковки": { ru: "Датчики парковки", en: "Parking sensors", uk: "Датчики паркування", he: "חיישני חניה" },
  "Подушки безопасности": { ru: "Подушки безопасности", en: "Airbags", uk: "Подушки безпеки", he: "כריות אוויר" },
  "ABS": { ru: "ABS", en: "ABS", uk: "ABS", he: "ABS" },
  "Круиз-контроль": { ru: "Круиз-контроль", en: "Cruise control", uk: "Круїз-контроль", he: "בקרת שיוט" },
  "Подогрев сидений": { ru: "Подогрев сидений", en: "Heated seats", uk: "Підігрів сидінь", he: "חימום מושבים" },
  "Электростеклоподъёмники": { ru: "Электростеклоподъёмники", en: "Power windows", uk: "Електросклопідйомники", he: "חלונות חשמליים" },
  "Мультируль": { ru: "Мультируль", en: "Multifunction steering wheel", uk: "Мультикермо", he: "הגה רב-תכליתי" },
  "Трёхзонный климат-контроль": { ru: "Трёхзонный климат-контроль", en: "Three-zone climate control", uk: "Тризонний клімат-контроль", he: "בקרת אקלים תלת-אזורית" },
  "Бесключевой доступ": { ru: "Бесключевой доступ", en: "Keyless entry", uk: "Безключовий доступ", he: "כניסה ללא מפתח" },
  "Подогрев руля": { ru: "Подогрев руля", en: "Heated steering wheel", uk: "Підігрів керма", he: "הגה מחומם" },
  "Вентиляция сидений": { ru: "Вентиляция сидений", en: "Ventilated seats", uk: "Вентиляція сидінь", he: "אוורור מושבים" },
  "Память сидений": { ru: "Память сидений", en: "Seat memory", uk: "Пам'ять сидінь", he: "זיכרון מושבים" },
  "Электропривод багажника": { ru: "Электропривод багажника", en: "Power tailgate", uk: "Електропривід багажника", he: "דלת תא מטען חשמלית" },
  "Адаптивный круиз-контроль": { ru: "Адаптивный круиз-контроль", en: "Adaptive cruise control", uk: "Адаптивний круїз-контроль", he: "בקרת שיוט אדפטיבית" },
  "Контроль слепых зон": { ru: "Контроль слепых зон", en: "Blind-spot monitoring", uk: "Контроль сліпих зон", he: "ניטור שטח מת" },
  "Удержание в полосе": { ru: "Удержание в полосе", en: "Lane-keeping assist", uk: "Утримання в смузі", he: "שמירה על נתיב" },
  "Матричные фары LED": { ru: "Матричные фары LED", en: "Matrix LED headlights", uk: "Матричні фари LED", he: "פנסי מטריקס LED" },
  "Ксеноновые фары": { ru: "Ксеноновые фары", en: "Xenon headlights", uk: "Ксенонові фари", he: "פנסי קסנון" },
  "Ambient-подсветка": { ru: "Ambient-подсветка", en: "Ambient lighting", uk: "Ambient-підсвітка", he: "תאורת אווירה" },
  "Беспроводная зарядка": { ru: "Беспроводная зарядка", en: "Wireless charging", uk: "Бездротова зарядка", he: "טעינה אלחוטית" },
  "Apple CarPlay / Android Auto": { ru: "Apple CarPlay / Android Auto", en: "Apple CarPlay / Android Auto", uk: "Apple CarPlay / Android Auto", he: "Apple CarPlay / Android Auto" },
  "Аудиосистема Bose": { ru: "Аудиосистема Bose", en: "Bose audio system", uk: "Аудіосистема Bose", he: "מערכת שמע Bose" },
  "Аудиосистема Bang & Olufsen": { ru: "Аудиосистема Bang & Olufsen", en: "Bang & Olufsen audio system", uk: "Аудіосистема Bang & Olufsen", he: "מערכת שמע Bang & Olufsen" },
  "Пакет Sport Chrono": { ru: "Пакет Sport Chrono", en: "Sport Chrono package", uk: "Пакет Sport Chrono", he: "חבילת Sport Chrono" },
};

// --- Характеристики (значения из мэппера — русские) ---
export const TRANSMISSION_LABELS: Record<string, L<string>> = {
  "Автомат": { ru: "Автомат", en: "Automatic", uk: "Автомат", he: "אוטומט" },
  "Механика": { ru: "Механика", en: "Manual", uk: "Механіка", he: "ידני" },
};
export const FUEL_LABELS: Record<string, L<string>> = {
  "Бензин": { ru: "Бензин", en: "Petrol", uk: "Бензин", he: "בנזין" },
  "Дизель": { ru: "Дизель", en: "Diesel", uk: "Дизель", he: "דיזל" },
  "Гибрид": { ru: "Гибрид", en: "Hybrid", uk: "Гібрид", he: "היברידי" },
  "Электро": { ru: "Электро", en: "Electric", uk: "Електро", he: "חשמלי" },
};
export const DRIVETRAIN_LABELS: Record<string, L<string>> = {
  "Передний": { ru: "Передний", en: "Front", uk: "Передній", he: "קדמי" },
  "Задний": { ru: "Задний", en: "Rear", uk: "Задній", he: "אחורי" },
  "Полный": { ru: "Полный", en: "AWD", uk: "Повний", he: "כונן כפול" },
};
export const BODY_TYPE_LABELS: Record<string, L<string>> = {
  "Седан": { ru: "Седан", en: "Sedan", uk: "Седан", he: "סדאן" },
  "Хэтчбек": { ru: "Хэтчбек", en: "Hatchback", uk: "Хетчбек", he: "האצ'בק" },
  "Лифтбек": { ru: "Лифтбек", en: "Liftback", uk: "Ліфтбек", he: "ליפטבק" },
  "Кроссовер": { ru: "Кроссовер", en: "Crossover", uk: "Кросовер", he: "קרוסאובר" },
  "Внедорожник": { ru: "Внедорожник", en: "SUV", uk: "Позашляховик", he: "רכב שטח" },
  "Минивэн": { ru: "Минивэн", en: "Minivan", uk: "Мінівен", he: "מיניוואן" },
};

// --- Категории по slug (название + краткое описание) ---
export const CATEGORY_LABELS: Record<string, L<{ name: string; description: string }>> = {
  econom: {
    ru: { name: "Эконом", description: "Недорогие и экономичные авто для города" },
    en: { name: "Economy", description: "Affordable and economical cars for the city" },
    uk: { name: "Економ", description: "Недорогі та економічні авто для міста" },
    he: { name: "חסכוני", description: "רכבים זולים וחסכוניים לעיר" },
  },
  comfort: {
    ru: { name: "Комфорт", description: "Просторнее и удобнее для поездок" },
    en: { name: "Comfort", description: "Roomier and more comfortable for trips" },
    uk: { name: "Комфорт", description: "Просторіше та зручніше для поїздок" },
    he: { name: "קומפורט", description: "מרווח ונוח יותר לנסיעות" },
  },
  business: {
    ru: { name: "Бизнес", description: "Представительный класс для деловых поездок" },
    en: { name: "Business", description: "Executive class for business trips" },
    uk: { name: "Бізнес", description: "Представницький клас для ділових поїздок" },
    he: { name: "עסקי", description: "מחלקת מנהלים לנסיעות עסקים" },
  },
  suv: {
    ru: { name: "SUV", description: "Кроссоверы и внедорожники" },
    en: { name: "SUV", description: "Crossovers and off-road vehicles" },
    uk: { name: "SUV", description: "Кросовери та позашляховики" },
    he: { name: "SUV", description: "קרוסאוברים ורכבי שטח" },
  },
  minivan: {
    ru: { name: "Минивэн", description: "Вместительные авто для больших компаний" },
    en: { name: "Minivan", description: "Spacious cars for large groups" },
    uk: { name: "Мінівен", description: "Місткі авто для великих компаній" },
    he: { name: "מיניוואן", description: "רכבים מרווחים לקבוצות גדולות" },
  },
  premium: {
    ru: { name: "Премиум", description: "Автомобили высокого класса" },
    en: { name: "Premium", description: "High-class vehicles" },
    uk: { name: "Преміум", description: "Автомобілі високого класу" },
    he: { name: "פרימיום", description: "רכבים ברמה גבוהה" },
  },
};

// --- Города по названию из БД ---
export const CITY_LABELS: Record<string, L<string>> = {
  "Одесса": { ru: "Одесса", en: "Odesa", uk: "Одеса", he: "אודסה" },
  "Киев": { ru: "Киев", en: "Kyiv", uk: "Київ", he: "קייב" },
  "Львов": { ru: "Львов", en: "Lviv", uk: "Львів", he: "לביב" },
  "Харьков": { ru: "Харьков", en: "Kharkiv", uk: "Харків", he: "חרקוב" },
};

// --- Хелперы ---
function pick<T>(map: Record<string, L<T>>, key: string, locale: Locale): T | null {
  return map[key] ? map[key][locale] : null;
}

export function carDescription(slug: string, locale: Locale): string {
  const v = pick(CAR_DESCRIPTIONS, slug, locale);
  if (v == null) throw new Error(`Нет перевода описания авто: ${slug} (${locale})`);
  return v;
}

export function translateFeatures(features: string[], locale: Locale): string[] {
  return features.map((f) => {
    const v = pick(FEATURE_LABELS, f, locale);
    if (v == null) throw new Error(`Нет перевода комплектации: "${f}" (${locale})`);
    return v;
  });
}

// Для характеристик/категорий/городов — перевод с безопасным возвратом оригинала,
// если значение неизвестно (наборы конечны и полностью покрыты).
export function translateTransmission(v: string, locale: Locale) { return pick(TRANSMISSION_LABELS, v, locale) ?? v; }
export function translateFuel(v: string, locale: Locale) { return pick(FUEL_LABELS, v, locale) ?? v; }
export function translateDrivetrain(v: string, locale: Locale) { return pick(DRIVETRAIN_LABELS, v, locale) ?? v; }
export function translateBodyType(v: string, locale: Locale) { return pick(BODY_TYPE_LABELS, v, locale) ?? v; }
export function categoryName(slug: string, locale: Locale) { return CATEGORY_LABELS[slug]?.[locale]?.name ?? slug; }
export function categoryDescription(slug: string, locale: Locale) { return CATEGORY_LABELS[slug]?.[locale]?.description ?? ""; }
export function translateCity(name: string, locale: Locale) { return pick(CITY_LABELS, name, locale) ?? name; }

// --- Строгая проверка полноты переводов для активных машин ---
// Бросает явную ошибку в dev/build, если у какой-то машины нет перевода
// описания на любой из 4 языков или отсутствует перевод какой-либо комплектации.
export function assertCarContentComplete(
  cars: { slug: string; features: string[] }[],
): void {
  const problems: string[] = [];
  for (const car of cars) {
    for (const locale of LOCALES) {
      if (!CAR_DESCRIPTIONS[car.slug] || CAR_DESCRIPTIONS[car.slug][locale] == null) {
        problems.push(`описание ${car.slug} (${locale})`);
      }
    }
    for (const f of car.features) {
      if (!FEATURE_LABELS[f]) problems.push(`комплектация "${f}"`);
    }
  }
  if (problems.length > 0) {
    throw new Error(
      "Неполные переводы каталога: " + [...new Set(problems)].join("; "),
    );
  }
}

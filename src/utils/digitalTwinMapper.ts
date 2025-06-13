import {DigitalTwinTag} from '../types/digital-twin.types';

// AI'dan gelen etiketleri vücut bölgelerine eşleştiren haritalar
const labelToBodyPartMap: Record<string, DigitalTwinTag['bodyPart'] | null> = {
  // Baş ve Boyun
  Migren: 'head',
  migren: 'head',
  'Migren, İç Kulak Bozukluğu': 'head',
  'Migren veya Viral Enfeksiyon': 'head',
  'Baş ağrısı': 'head',
  Hipertiroidi: 'neck',
  Hipotiroidi: 'neck',
  Hipotiroitism: 'neck',
  Hipotiroidizm: 'neck',
  'Tiroid Hastalığı': 'neck',
  'Tiroid Problemi': 'neck',

  // Göğüs
  Grip: 'chest',
  'Grip veya Soğuk Algınlığı': 'chest',
  'Grip/Soğuk Algınlığı': 'chest',
  'Gribe işaret eden belirtiler': 'chest',
  'Soğuk algınlığı': 'chest',
  Zatüre: 'chest',
  'Üst solunum yolu enfeksiyonu': 'chest',
  'Üst Solunum Yolu Enfeksiyonu': 'chest',
  'Solunum Yolu Enfeksiyonu': 'chest',
  'Boğaz enfeksiyonu': 'chest',
  'Kalp Krizi': 'chest',

  // Karın
  'Mide Enfeksiyonu': 'abdomen',
  'Mide rahatsızlığı': 'abdomen',
  Gastrit: 'abdomen',
  'Gastrit/mide ülseri': 'abdomen',
  Gastroenterit: 'abdomen',
  'Sindirim sistemi enfeksiyonu': 'abdomen',
  'Gastrointestinal enfeksiyon': 'abdomen',
  'Gıda zehirlenmesi': 'abdomen',
  'Sindirim Sistemi Hastalığı': 'abdomen',
  'Karaciğer Hastalığı': 'abdomen',
  'Karaciğer rahatsızlığı': 'abdomen',
  'Böbrek Enfeksiyonu': 'abdomen',

  // Kan - Sistemik
  Anemi: 'systemic',
  'Anemi#DemirEksikliği': 'systemic',
  'Demir eksikliği anemisi': 'systemic',
  'Demir Eksikliği Anemisi': 'systemic',
  'Beslenme Bozukluğu': 'systemic',
  'Kronik Yorgunluk Sendromu': 'systemic',
  'Kronik yorgunluk sendromu': 'systemic',
  Fibromiyalji: 'systemic',
  fibromiyalji: 'systemic',
  'Genel sağlık durumu': 'systemic',
  'Genel sağlık sorunu': 'systemic',
  Menopoz: 'systemic',
  Enfeksiyon: 'systemic',
  'Viral/bakteriyel enfeksiyon': 'systemic',
  'Viral Enfeksiyon': 'systemic',
  'Viral enfeksiyon': 'systemic',
  'Viral Enfeksiyon/ Alerjik Reaksiyon': 'systemic',
  Alerji: 'systemic',
  'Alerjik reaksiyon': 'systemic',
  'Şeker Hastalığı': 'systemic',
  'Diabetes Mellitus (Şeker Hastalığı)': 'systemic',
  'Şeker hastalığı (Diyabet)': 'systemic',
  Diyabet: 'systemic',
  Hipoglisemi: 'systemic',
  Lenfoma: 'systemic',

  // Sistem Hataları / Geçersiz Etiketler
  'Tekrar deneme yapma süresi': null,
  'Rate Limit Hatası': null,
  'Rate limit hatası': null,
  HATA: null,
  'Tekrar deneyin': null,
  'Sağlık sorunu tespiti yapılamadı': null,

  // Eski etiketler (backward compatibility için)
  Sebum: 'head',
  'Göz Çevresi': 'head',
  'Göz Altı Morluğu': 'head',
  'Göz Kuruluğu': 'head',
  Sinüzit: 'head',
  Vertigo: 'head',
  'Boyun Ağrısı': 'neck',
  'Boyun Gerginliği': 'neck',
  'Göğüs Ağrısı': 'chest',
  'Nefes Darlığı': 'chest',
  Öksürük: 'chest',
  Bronşit: 'chest',
  Astım: 'chest',
  'Kalp Çarpıntısı': 'chest',
  'Mide Ağrısı': 'abdomen',
  Bulantı: 'abdomen',
  Hazımsızlık: 'abdomen',
  Kabızlık: 'abdomen',
  İshal: 'abdomen',
  'Bel Ağrısı': 'back',
  'Sırt Ağrısı': 'back',
  'Omurga Ağrısı': 'back',
  'Kol Ağrısı': 'arm',
  'Dirsek Ağrısı': 'arm',
  'Bilek Ağrısı': 'arm',
  'Alerjik Reaksiyon': 'arm',
  'Bacak Ağrısı': 'leg',
  'Diz Ağrısı': 'leg',
  'Ayak Bileği Ağrısı': 'leg',
  'Kas Krampı': 'leg',
};

// Etiket durumunu belirleme
const labelToStatusMap: Record<string, DigitalTwinTag['status']> = {
  // Normal durumlar
  Hafif: 'normal',
  Normal: 'normal',
  İyileşme: 'normal',

  // Uyarı durumları
  Orta: 'warning',
  Dikkat: 'warning',
  Takip: 'warning',

  // Tehlike durumları
  Ciddi: 'danger',
  Acil: 'danger',
  Yüksek: 'danger',
};

// Body Highlighter için vücut bölgesi eşleştirmesi
export const bodyPartToHighlighterMap: Record<
  NonNullable<DigitalTwinTag['bodyPart']>,
  string[]
> = {
  head: ['head'],
  neck: ['neck'],
  chest: ['chest', 'upper-back'],
  abdomen: ['abs', 'lower-back'],
  back: ['upper-back', 'lower-back'],
  arm: ['biceps', 'triceps', 'forearm'],
  leg: ['quadriceps', 'hamstring', 'calves', 'shin'],
  systemic: ['chest', 'abs'], // Sistemik hastalıklar için göğüs ve karın bölgesi
  full: [], // Tüm vücut için boş array
};

// Durum seviyesine göre renk yoğunluğu
export const statusToIntensityMap: Record<DigitalTwinTag['status'], number> = {
  normal: 1, // Normal durumda hafif renklendirme (0 yerine 1)
  warning: 2, // Orta yoğunluk
  danger: 3, // Yüksek yoğunluk
};

// Durum seviyesine göre renk (tema renkleriyle uyumlu)
export const statusToColorMap: Record<DigitalTwinTag['status'], string> = {
  normal: '#4CAF50', // Tema: success rengi
  warning: '#FF9800', // Turuncu (uyarı)
  danger: '#FF5252', // Tema: error rengi
};

// Body Highlighter için renk paleti
export const bodyHighlighterColors = ['#4CAF50', '#FF9800', '#FF5252']; // [normal, warning, danger]

/**
 * AI'dan gelen etiketi DigitalTwinTag formatına dönüştürür
 */
export const mapLabelToDigitalTwinTag = (
  label: string,
  aiResponse: string,
): DigitalTwinTag | null => {
  // Önce geçersiz etiketleri kontrol et
  if (labelToBodyPartMap[label] === null) {
    console.log(`Geçersiz etiket tespit edildi: ${label}`);
    return null; // Geçersiz etiketler için null döndür
  }

  // Vücut bölgesi belirleme - önce tam eşleşme ara
  let bodyPart: DigitalTwinTag['bodyPart'] = 'full';

  if (labelToBodyPartMap[label]) {
    bodyPart = labelToBodyPartMap[label] as DigitalTwinTag['bodyPart'];
  } else {
    // Kısmi eşleşme kontrolü (etiket içinde anahtar kelime arama)
    const lowercaseLabel = label.toLowerCase();
    for (const [key, value] of Object.entries(labelToBodyPartMap)) {
      if (
        value !== null &&
        (lowercaseLabel.includes(key.toLowerCase()) ||
          key.toLowerCase().includes(lowercaseLabel))
      ) {
        bodyPart = value;
        break;
      }
    }
  }

  // Durum belirleme - AI yanıtında belirli anahtar kelimeler ara
  let status: DigitalTwinTag['status'] = 'normal';
  const lowercaseResponse = aiResponse.toLowerCase();
  const lowercaseLabel = label.toLowerCase();

  // Önce etiket adına göre varsayılan durum belirle
  if (
    lowercaseLabel.includes('migren') ||
    lowercaseLabel.includes('ağrı') ||
    lowercaseLabel.includes('ağrısı') ||
    lowercaseLabel.includes('enfeksiyon') ||
    lowercaseLabel.includes('hastalık')
  ) {
    status = 'warning'; // Ağrı ve hastalıklar varsayılan olarak warning
  }

  if (
    lowercaseResponse.includes('ciddi') ||
    lowercaseResponse.includes('acil') ||
    lowercaseResponse.includes('tehlikeli') ||
    lowercaseResponse.includes('risk') ||
    lowercaseResponse.includes('kritik')
  ) {
    status = 'danger';
  } else if (
    lowercaseResponse.includes('dikkat') ||
    lowercaseResponse.includes('takip') ||
    lowercaseResponse.includes('kontrol') ||
    lowercaseResponse.includes('artabilir') ||
    lowercaseResponse.includes('uyarı')
  ) {
    status = 'warning';
  }

  // Sistemik hastalıklar genellikle daha ciddidir
  if (bodyPart === 'systemic') {
    status = status === 'normal' ? 'warning' : status;
  }

  console.log(`=== Etiket Mapping Debug ===`);
  console.log(`Label: ${label}`);
  console.log(`Body Part: ${bodyPart}`);
  console.log(`Status: ${status}`);
  console.log(`AI Response: ${aiResponse}`);

  return {
    id: Date.now().toString(),
    name: label,
    value: '1', // Varsayılan değer
    status,
    date: new Date().toISOString().split('T')[0],
    bodyPart,
  };
};

/**
 * Vücut bölgesine göre etiketleri filtreler
 */
export const filterTagsByBodyPart = (
  tags: DigitalTwinTag[],
  bodyPart: DigitalTwinTag['bodyPart'] | null,
): DigitalTwinTag[] => {
  if (!bodyPart) return tags;
  return tags.filter(tag => tag.bodyPart === bodyPart);
};

/**
 * Duruma göre etiketleri sıralar (danger > warning > normal)
 */
export const sortTagsByStatus = (tags: DigitalTwinTag[]): DigitalTwinTag[] => {
  const statusOrder = {danger: 3, warning: 2, normal: 1};
  return [...tags].sort(
    (a, b) => statusOrder[b.status] - statusOrder[a.status],
  );
};

/**
 * Etiketleri Body Highlighter için uygun formata dönüştürür
 */
export const convertTagsToBodyHighlights = (tags: DigitalTwinTag[]) => {
  const bodyHighlights: Array<{slug: string; intensity: number}> = [];

  console.log('=== convertTagsToBodyHighlights Debug ===');
  console.log('Input tags:', tags);

  // Tüm durumları göster (normal, warning, danger)
  const activeIssues = tags.filter(
    tag =>
      tag.status === 'normal' ||
      tag.status === 'warning' ||
      tag.status === 'danger',
  );

  console.log('Active issues (normal/warning/danger):', activeIssues);

  activeIssues.forEach(tag => {
    const bodyParts = bodyPartToHighlighterMap[tag.bodyPart || 'full'];
    const intensity = statusToIntensityMap[tag.status];

    console.log(
      `Tag: ${tag.name}, BodyPart: ${tag.bodyPart}, Status: ${tag.status}`,
    );
    console.log(`Mapped body parts:`, bodyParts);
    console.log(`Intensity:`, intensity);

    if (bodyParts && intensity >= 1) {
      // Normal durumu da dahil etmek için >= 1
      bodyParts.forEach(part => {
        // Aynı vücut bölgesi için birden fazla etiket varsa, en yüksek yoğunluğu al
        const existingIndex = bodyHighlights.findIndex(h => h.slug === part);
        if (existingIndex >= 0) {
          bodyHighlights[existingIndex].intensity = Math.max(
            bodyHighlights[existingIndex].intensity,
            intensity,
          );
        } else {
          bodyHighlights.push({slug: part, intensity});
        }
      });
    }
  });

  console.log('Final body highlights:', bodyHighlights);
  return bodyHighlights;
};

/**
 * Etiketleri vücut bölgesine göre gruplar
 */
export const groupTagsByBodyPart = (tags: DigitalTwinTag[]) => {
  const grouped: Record<string, DigitalTwinTag[]> = {};

  tags.forEach(tag => {
    const bodyPart = tag.bodyPart || 'full';
    if (!grouped[bodyPart]) {
      grouped[bodyPart] = [];
    }
    grouped[bodyPart].push(tag);
  });

  return grouped;
};

/**
 * Belirli bir vücut bölgesinin sağlık durumunu değerlendirir
 */
export const evaluateBodyPartHealth = (
  tags: DigitalTwinTag[],
): {
  status: DigitalTwinTag['status'];
  count: number;
  latestDate: string;
} => {
  if (tags.length === 0) {
    return {status: 'normal', count: 0, latestDate: ''};
  }

  // En kötü durumu bul
  const hasDanger = tags.some(tag => tag.status === 'danger');
  const hasWarning = tags.some(tag => tag.status === 'warning');

  let status: DigitalTwinTag['status'] = 'normal';
  if (hasDanger) status = 'danger';
  else if (hasWarning) status = 'warning';

  // En son tarih
  const latestDate = tags
    .map(tag => tag.date)
    .sort()
    .reverse()[0];

  return {
    status,
    count: tags.length,
    latestDate,
  };
};

/**
 * Sağlık durumu istatistiklerini hesaplar
 */
export const calculateHealthStats = (tags: DigitalTwinTag[]) => {
  const stats = {
    total: tags.length,
    normal: tags.filter(tag => tag.status === 'normal').length,
    warning: tags.filter(tag => tag.status === 'warning').length,
    danger: tags.filter(tag => tag.status === 'danger').length,
    bodyPartsAffected: new Set(tags.map(tag => tag.bodyPart)).size,
    systemicCount: tags.filter(tag => tag.bodyPart === 'systemic').length,
  };

  // Genel sağlık skoru (0-100) - sistemik hastalıklar daha ağır puanlanır
  const healthScore =
    stats.total > 0
      ? Math.max(
          0,
          100 -
            stats.warning * 15 -
            stats.danger * 30 -
            stats.systemicCount * 10,
        )
      : 100;

  return {
    ...stats,
    healthScore,
    riskLevel:
      healthScore >= 80 ? 'low' : healthScore >= 60 ? 'medium' : 'high',
  };
};

/**
 * Geçersiz etiketleri kontrol eder
 */
export const isValidLabel = (label: string): boolean => {
  return labelToBodyPartMap[label] !== null;
};

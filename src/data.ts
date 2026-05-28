export interface OnboardingQuestion {
  id: string;
  field: "major" | "habits" | "coping" | "philosophy";
  title: string;
  subtitle: string;
  options: {
    value: string;
    label: string;
    description: string;
  }[];
}

export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: "q1",
    field: "major",
    title: "Kamu paling tertarik di bidang teknologi apa?",
    subtitle: "Semua orang punya jalur tech yang berbeda. Mana yang paling mendeskripsikan fokusmu?",
    options: [
      {
        value: "Full-Stack Web & Interfaces",
        label: "Full-Stack Web & Interfaces",
        description: "Membangun web apps interaktif, merancang API yang bersih, dan mengelola microservices."
      },
      {
        value: "Deep Systems Engineering",
        label: "Systems & Infrastructure",
        description: "Ngoprek performa sistem, arsitektur backend tebal, compiler, dan manajemen memori."
      },
      {
        value: "AI & Quantitative Modeling",
        label: "AI & Machine Learning",
        description: "Ngebangun AI, melatih model cerdas, mengolah data, dan eksperimen machine learning."
      },
      {
        value: "Cybersecurity & Hardened Networks",
        label: "Security & Pentesting",
        description: "Melakukan vulnerability assessment, penetration testing, dan merancang protokol zero-trust."
      },
      {
        value: "Interactive Engine Architecture",
        label: "Engine & Game Development",
        description: "Memprogram engine game, kalkulasi fisika real-time, matematika 3D, dan pipeline audio kustom."
      }
    ]
  },
  {
    id: "q2",
    field: "habits",
    title: "Di luar jam wajib kuliah atau kerja, apa yang biasanya kamu lakuin?",
    subtitle: "Materi kelas sering kali nggak cukup. Bagaimana cara kamu terus mengasah skill?",
    options: [
      {
        value: "Algorithmic Martyrdom",
        label: "Mengasah Otak di LeetCode",
        description: "Fokus mengoptimalkan performa algoritma. Otakmu refleks berpikir dalam kompleksitas Big-O."
      },
      {
        value: "Prolific Side Projects",
        label: "Eksperimen Side Project (Indie Builder)",
        description: "Punya puluhan ide dan repo GitHub setengah matang, tapi semuanya punya setup modern dan UI estetik."
      },
      {
        value: "Technical Networking & Speaking",
        label: "Aktif di Komunitas & Networking",
        description: "Ikut hackathon, sharing di forum pengembang, cari kenalan tech leader, dan kontribusi open-source."
      },
      {
        value: "Perfect Academic Dedication",
        label: "Akademisi Berprestasi & Riset",
        description: "Menyelesaikan tugas kuliah jauh sebelum deadline, baca riset sains, dan peduli dengan teori komputasi."
      }
    ]
  },
  {
    id: "q3",
    field: "coping",
    title: "Apa bahan bakar utama kamu saat harus fokus ngoding?",
    subtitle: "Menghadapi tumpukan bug dan meeting harian butuh ritual penyeimbang yang pas.",
    options: [
      {
        value: "Espressos & Deep Night Shifts",
        label: "Kopi Hitam & Begadang",
        description: "Espresso ganda di tengah malam dengan layar monitor gelap-gulita yang dipenuhi baris kode."
      },
      {
        value: "Gym, Fresh Air & Sleep Hygiene",
        label: "Gaya Hidup Sehat & Teratur",
        description: "Lari pagi sebelum ngantor, menjaga istirahat cukup 8 jam, dan menjaga fokus lewat fisik yang bugar."
      },
      {
        value: "Virtual Sandbox & Social Media",
        label: "Gaming & Komunitas Discord",
        description: "Mencari hiburan dari game imersif, baca meme di grup developer, atau ngobrol santai di VC Discord."
      }
    ]
  },
  {
    id: "q4",
    field: "philosophy",
    title: "Apa kompas utama (North Star) dalam perjalanan kariermu?",
    subtitle: "Saat melihat ke belakang nanti, pencapaian apa yang membuat seluruh lelahmu sepadan?",
    options: [
      {
        value: "Maximum Capital Accumulation",
        label: "Pencapaian Finansial Maksimal",
        description: "Mengejar posisi teknologi dengan kompensasi tinggi, memaksimalkan opsi saham, dan pensiun dini."
      },
      {
        value: "Uncompromising Technical Craft",
        label: "Menjadi Ahli Rekayasa Perangkat Lunak",
        description: "Sangat peduli pada keindahan kode, struktur folder yang rapi, dan performa program yang efisien."
      },
      {
        value: "Democratized Public Code",
        label: "Kontribusi Ekosistem & Berbagi Dampak",
        description: "Membuat library open-source bermanfaat, mengajari developer junior, dan aktif berbagi ilmu."
      }
    ]
  }
];

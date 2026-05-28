import { Profile, Stats, Phase, Choice } from "./src/types";

// Generates an initial career phase (Year 1) as a high-fidelity local fallback.
export function getLocalFirstPhase(profile: Profile): Phase {
  const major = profile.major || "Full-Stack Web & Interfaces";
  const habits = profile.habits || "Prolific Side Projects";
  const coping = profile.coping || "Espressos & Deep Night Shifts";
  const philosophy = profile.philosophy || "Uncompromising Technical Craft";

  let title = "The Legacy Crucible (Tahun 1: Awal Perjuangan)";
  let narrative = "";
  let statChanges = { money: 15, stress: 10, codingSkill: 15, reputation: 5, motivation: 10 };

  // Generate customized narrative based on technology area focus (major)
  if (major.includes("Full-Stack")) {
    narrative = `Kamu memulai perjalanan sebagai Junior Web Developer di agensi software lokal daerah Jakarta Selatan. Setup di mejamu menyambutmu dengan sebuah laptop usang yang dipenuhi stiker 'Junior' dan codebase monolitik jQuery tebal peninggalan developer terdahulu. Lead Developer terlihat kurang tidur selama tiga bulan terakhir, lalu memperlihatkan backlog Jira penuh bug warisan yang memusingkan. Kebiasaanmu yang menyukai ${habits.toLowerCase()} membuatmu memandang tumpukan utang teknis (tech debt) ini sebagai labirin misterius yang harus ditaklukkan dengan segera.`;
  } else if (major.includes("Systems")) {
    narrative = `Kamu bergabung sebagai Junior Infrastructure Engineer di perusahaan fintech level Seri-B yang sedang gencar bermitigasi server ke cloud terdistribusi. Bug race condition parah melumpuhkan proses checkout saldo jutaan user tepat di jam sibuk pertamamu. Bosmu panik mondar-mandir di ruang meeting SCBD sembari memantau diagram Grafana yang memerah membara. Ini adalah tes instan bagi pemahaman teoretis arsitektur sistemmu, di mana setiap detik down-time merugikan ratusan juta rupiah milik nasabah.`;
  } else if (major.includes("AI")) {
    narrative = `Sebagai Data & AI Associate baru di startup e-commerce terkemuka, kamu diberikan kendali klaster server GPU yang bising dan berantakan. Tugas pertamamu: melatih ulang (retrain) model rekomendasi yang bermasalah karena sering menampilkan barang absurd ke user. Pihak marketing gundah lantaran angka konversi penjualan menukik tajam. Dengan gaya kopingmu yang mengandalkan ${coping.toLowerCase()}, kamu harus gesit menguji teknik debugging dan pembersihan model statistik agar target performa tercapai.`;
  } else if (major.includes("Cybersecurity")) {
    narrative = `Kamu resmi menyandang gelar Junior Security Analyst di firma konsultan keamanan elite Indonesia. Di kuartal pertamamu bekerja, satu klien perbankan swasta raksasa terindikasi mengalami kebocoran kredensial API dan ancaman serangan DDoS. Kamu ditempatkan di Security Operations Center (SOC) yang penuh ketegangan, menatap berjalannya ratusan baris log terminal siber yang berkedip cepat. Di sinilah kepatuhan terhadap zero-trust dan intuisi analitismu akan ditempa oleh api sesungguhnya.`;
  } else {
    // Interactive Engine / Game Development
    narrative = `Langkah pertamamu dimulai di studio game indie lokal sebagai Gameplay Programmer pemula. Game mobile andalan mereka yang dijadwalkan meluncur minggu depan mendadak terhambat kebocoran memori (memory leak) misterius pada kustom rendering engine, melumpuhkan FPS dari 60 ke belasan bingkai per detik. Seluruh tim desainer panik dan produser game menghela nafas panjang berkali-kali. Kamu berupaya membongkar tumpukan kode pointer grafis C++ demi menyelamatkan rilis game.`;
  }

  const choices = [
    {
      id: "A",
      text: "Ambil inisiatif mengamankan backend utama dan merancang ulang sistem pencatatan log (logging).",
      flavorText: "Habiskan akhir pekan untuk membuktikan dedikasi totalmu pada codebase ini."
    },
    {
      id: "B",
      text: "Tawarkan presentasi teknis usulan migrasi framework modern kepada tim Lead Developer.",
      flavorText: "Fokus pada komunikasi, penyelarasan solusi inovatif, dan manajemen kepentingan."
    },
    {
      id: "C",
      text: "Kerjakan perbaikan tambal-sulam standar di jam kerja dan kembangkan portfolio side-project pribadimu.",
      flavorText: "Jaga kesehatan mental sembari tetap mengasah spesialisasi masa depan secara mandiri."
    }
  ];

  return {
    year: "Year 1",
    title,
    narrative,
    statChanges,
    choices
  };
}

// Generates next career phases (Year 3, Year 5, Year 10, or Year 15 Ending)
export function getLocalNextPhase(
  profile: Profile,
  currentStats: Stats,
  history: any[],
  nextPhaseIndex: number
): Phase {
  const major = profile.major || "Full-Stack Web & Interfaces";
  const habits = profile.habits || "Prolific Side Projects";
  const coping = profile.coping || "Espressos & Deep Night Shifts";
  const philosophy = profile.philosophy || "Uncompromising Technical Craft";

  const isEnding = nextPhaseIndex >= 4;

  if (isEnding) {
    // Determine ending archetype based on stats and profile
    let endingArchetype = "Arsitek Sistem Senior Karismatik";
    let title = "Legendary Developer Legacy";
    let narrative = "";
    let lessonsLearned = [
      "Penguasaan fundamental komputasi jauh lebih abadi dibandingkan tren framework musiman yang silih berganti.",
      "Kesehatan mental dan kontrol stres yang baik adalah rahasia mutlak di balik umur karier tech yang panjang.",
      "Warisan engineering terbaik bukanlah sistem yang sempurna, melainkan regenerasi tim yang telah terdorong oleh kepemimpinanmu."
    ];

    if (currentStats.money >= 70 && currentStats.stress <= 40) {
      endingArchetype = "The Zen Solopreneur / Nomad Digital";
      title = "Puncak Kebebasan Finansial & Kedamaian Pikiran";
      narrative = `15 tahun perjalanan kariermu telah rampung dikompilasi. Di atas meja kerja kayumu yang kokoh berlapis doff, tergeletak laptop teringan berperforma monster, secangkir specialty arabika dingin, dan e-passport berisi visa nomad global. Sisa rambutmu masih lebat terjaga berkat kopingmu yang mengutamakan kualitas tidur dan kebugaran fisik. Kamu berhasil melepaskan diri dari rantai korporasi monoton, memanfaatkan modal kuat dan micro-SaaS ciptaanmu yang mendatangkan devisa modal pasif sembari bersantai di tepi pantai Bali atau Lombok.`;
    } else if (currentStats.codingSkill >= 75 && currentStats.reputation >= 70) {
      endingArchetype = "Software Craftsman Tokoh Industri Legendaris";
      title = "Arsitek Abadi dengan Reputasi Tanpa Tanding";
      narrative = `Luar luar biasa. Dedikasimu pada kerapian struktur internal program dan pilar fundamental rekayasa perangkat lunak mengantarkanmu ke kursi elite industri teknologi nasional. Namamu kerap disebut dalam diskusi teknis kelas tinggi, dan kontribusimu di platform git global menjadi kiblat developer muda Indonesia. Kamu menghabiskan hari sebagai Principal Consultant yang hanya dipanggil ketika sistem perbankan menderita bug mematikan atau beban transaksi triliunan rupiah mengalami bottleneck skala nasional.`;
    } else if (currentStats.money >= 80 && currentStats.stress >= 65) {
      endingArchetype = "VC Partner & Tech Evangelist Ambisius";
      title = "Pemain Kelas Atas dengan Intensitas Tanpa Batas";
      narrative = `Tahun ke-15 perjalananmu berakhir di pucuk rantai kompensasi modal ventura ternama di SCBD Jakarta. Kamu adalah pengambil keputusan krusial di balik pendanaan startup unicorn masa depan. Namun, gumpalan rambut beruban dan obat asam lambung di laci mejamu mengonfirmasi besarnya tekanan yang kamu tanggung bertahun-tahun. Kehidupan berkecepatan ultra di bawah target pertumbuhan agresif telah menuntut segalanya dari dirimu, tapi warisan finansial yang kamu amankan telah melampaui mimpi paling liar di masa remajamu.`;
    } else if (currentStats.motivation >= 70 && currentStats.reputation >= 65) {
      endingArchetype = "Pahlawan Komunitas & Guru Developer Bangsa";
      title = "Menabur Inspirasi dan Edukasi Tanpa Pamrih";
      narrative = `Kamu menutup 15 tahun karirmu bukan dengan tumpukan saham korporasi megah, melainkan tawa hangat dari ribuan anak didik yang sukses bertransformasi menjadi engineer andal berkat bimbinganmu. Dari kursus online interaktif, mentoring open-source, hingga naskah tutorial yang kamu sebarluaskan secara demokratis, kamu adalah mercusuar bagi lulusan baru tech Indonesia. Meja belajarmu dikelilingi oleh kado buatan tangan developer junior dan rasa syukur komunitas tech yang begitu bangga memilikimu.`;
    } else {
      endingArchetype = "Veteran Tech & Senior Architect Karismatik";
      title = "Penyintas Badai Industri & Mentor Andal";
      narrative = `Kompilasi final perjalanan 15 tahun berhasil disusun. Sebagai veteran sistem yang disegani, kamu telah menyaksikan naik-turunnya siklus keuangan makro, gelombang PHK massal siber, hingga punahnya framework-framework lawas. Kamu memilih jalur aman yang berwibawa, di mana keahlianmu menakar risiko, mendesain fallback arsitektur cadangan, dan menjembatani kepentingan bisnis ke barisan insinyur menjadikannya pimpinan yang dipercaya di mana pun kamu mendarat.`;
    }

    return {
      year: "The Ultimate Legacy",
      title,
      narrative,
      endingArchetype,
      lessonsLearned,
      isEnding: true
    };
  }

  // Intermediate phases: Year 3, Year 5, Year 10
  let yearLabel = "Year 3";
  let title = "Ambang Senioritas (Tahun 3)";
  let narrative = "";
  let statChanges = { money: 15, stress: 15, codingSkill: 15, reputation: 10, motivation: -5 };
  let choices: Choice[] = [];

  if (nextPhaseIndex === 1) {
    // Year 3
    yearLabel = "Year 3";
    title = "Persimpangan Senioritas (Tahun 3)";
    narrative = `Tahun ke-3 berjalan dengan cepat. Berkat pemahaman mendalammu pada bidang ${major}, kamu tak lagi dipandang sebagai junior yang gemetar mengeksekusi komit Git. LinkedIn-mu mulai didekati oleh headhunter berkali-kali dalam seminggu. Namun bersama kematangan keahlian, tuntutan politik internal kantor, tumpang tindih keputusan manajer produk yang membingungkan, dan beban membimbing engineer magang yang sering me-merge kode merusak server mulai bergeser ke pundakmu secara eksklusif.`;
    
    choices = [
      {
        id: "A",
        text: "Kunci jalur karir teknis murni (IC - Individual Contributor), tawarkan diri mendesain arsitektur microservices internal.",
        flavorText: "Kembangkan penguasaan teknismu sedalam mungkin, abaikan intrik manajemen."
      },
      {
        id: "B",
        text: "Ambil lisensi Scrum Master/Management Certified dan terima promosi posisi Engineering Lead.",
        flavorText: "Banyak rapat, koordinasi bisnis, kendalikan arah sprint dan lepaskan hobi ngoding harian."
      },
      {
        id: "C",
        text: "Terima tawaran melompat kerja ke rintisan startup luar negeri dengan penawaran gaji dolar penuh (remote work).",
        flavorText: "Dapatkan akselerasi tabungan finansial drastis, tapi hadapi zona waktu kerja yang sangat berbeda."
      }
    ];
    statChanges = { money: 20, stress: 15, codingSkill: 15, reputation: 10, motivation: -10 };

  } else if (nextPhaseIndex === 2) {
    // Year 5
    yearLabel = "Year 5";
    title = "Siklus Pasang Surut & Inovasi Mandiri (Tahun 5)";
    narrative = `Tahun ke-5 melanda karier profesionalmu. Kegandrunganmu pada ${habits.toLowerCase()} mulai membuahkan hasil nyata dalam bentuk side project yang mulai mendapatkan traksi organik di Twitter/X dan GitHub. Kamu sadar bahwa waktu adalah aset paling berharga. Di satu sisi, sistem di kantor lamamu kembali mengalami pergeseran struktural manajemen yang berisik, sementara tawaran investasi awal (angel investor) dari kolegamu datang mengajakmu fokus membangun tim rintisan software studio mandiri.`;

    choices = [
      {
        id: "A",
        text: "Fokus ganda mengurus pekerjaan utama sembari begadang merilis mikro-SaaS mandiri Anda ke pasar global.",
        flavorText: "Rasakan puncak kelelahan fisik, tetapi kepemilikan saham 100% adalah milikmu sepenuhnya."
      },
      {
        id: "B",
        text: "Fokus total mengajukan promosi ke tingkat Principal Engineer di tempat kerjamu demi kestabilan masa depan.",
        flavorText: "Pilih kedamaian keamanan karir dengan asuransi swasta terbaik dan jaminan masa tua melimpah."
      },
      {
        id: "C",
        text: "Resign murni, bangun tim software agency beranggotakan 3 rekan terpercaya untuk melayani klien-klien kakap.",
        flavorText: "Ubah stress mengoding baris program menjadi ketegangan memperebutkan deals bisnis bernilai ratusan juta."
      }
    ];
    statChanges = { money: 25, stress: 20, codingSkill: 20, reputation: 15, motivation: 5 };

  } else {
    // Year 10
    yearLabel = "Year 10";
    title = "Status Veteran & Persimpangan Elite (Tahun 10)";
    narrative = `Satu dekade berkecimpung di industri rekayasa perangkat lunak mengajarimu bahwa tren bahasa pemrograman datang dan pergi dengan dramatik. Teman-teman seangkatanmu sebagian besar telah pensiun merakit barisan kode dan beralih fokus mengelola bisnis franchise kuliner atau menjadi jajaran direksi korporasi murni. Filosofi karirmu (${philosophy.toLowerCase()}) kini telah matang. Sebuah persimpangan agung mendekatimu untuk menentukan warisan yang ingin kamu tinggalkan di ekosistem digital nasional.`;

    choices = [
      {
        id: "A",
        text: "Terima pinangan korporat teknologi papan atas untuk posisi VP of Technology / CTO skala regional.",
        flavorText: "Pikul otoritas pengambil keputusan tertinggi atas ratusan engineers dengan beban stres sangat berat."
      },
      {
        id: "B",
        text: "Pilih mengajar di bootcamp/universitas ternama dan dedikasikan sisa waktumu sebagai core contributor library open-source.",
        flavorText: "Lepaskan ambisi kejar harta berlebih demi ketenangan batin mendalam dan dampak sosial yang abadi."
      },
      {
        id: "C",
        text: "Investasikan tabunganmu untuk meluncurkan startup teknologi mandiri bermandikan integrasi AI canggih garapanmu sendiri.",
        flavorText: "Pertaruhkan seluruh reputasi dan kapitalmu untuk merevolusi ekosistem industri digital tanah air."
      }
    ];
    statChanges = { money: 30, stress: 25, codingSkill: 20, reputation: 25, motivation: 10 };
  }

  return {
    year: yearLabel,
    title,
    narrative,
    statChanges,
    choices
  };
}

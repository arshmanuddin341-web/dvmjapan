/**
 * Global car brands for logo slider.
 * Logo URLs: vl.imgix.net (avto-dev vehicle-logotypes CDN) - works in browser.
 */

const VL_IMG = (slug: string) => `https://vl.imgix.net/img/${slug}-logo.png`;

export const carBrands: { name: string; slug: string; domain: string; logoUrl: string }[] = [
  // Japan
  { name: "Toyota", slug: "toyota", domain: "toyota.com", logoUrl: VL_IMG("toyota") },
  { name: "Nissan", slug: "nissan", domain: "nissan-global.com", logoUrl: VL_IMG("nissan") },
  { name: "Honda", slug: "honda", domain: "honda.com", logoUrl: VL_IMG("honda") },
  { name: "Mazda", slug: "mazda", domain: "mazda.com", logoUrl: VL_IMG("mazda") },
  { name: "Mitsubishi", slug: "mitsubishi", domain: "mitsubishi-motors.com", logoUrl: VL_IMG("mitsubishi") },
  { name: "Subaru", slug: "subaru", domain: "subaru.com", logoUrl: VL_IMG("subaru") },
  { name: "Suzuki", slug: "suzuki", domain: "suzuki.com", logoUrl: VL_IMG("suzuki") },
  { name: "Daihatsu", slug: "daihatsu", domain: "daihatsu.com", logoUrl: VL_IMG("daihatsu") },
  { name: "Lexus", slug: "lexus", domain: "lexus.com", logoUrl: VL_IMG("lexus") },
  { name: "Infiniti", slug: "infiniti", domain: "infiniti.com", logoUrl: VL_IMG("infiniti") },
  { name: "Acura", slug: "acura", domain: "acura.com", logoUrl: VL_IMG("acura") },
  // Germany
  { name: "BMW", slug: "bmw", domain: "bmw.com", logoUrl: VL_IMG("bmw") },
  { name: "Mercedes-Benz", slug: "mercedes-benz", domain: "mercedes-benz.com", logoUrl: VL_IMG("daimler") },
  { name: "Volkswagen", slug: "volkswagen", domain: "volkswagen.com", logoUrl: VL_IMG("volkswagen") },
  { name: "Audi", slug: "audi", domain: "audi.com", logoUrl: VL_IMG("audi") },
  { name: "Porsche", slug: "porsche", domain: "porsche.com", logoUrl: VL_IMG("porsche") },
  { name: "Opel", slug: "opel", domain: "opel.com", logoUrl: VL_IMG("opel") },
  { name: "Mini", slug: "mini", domain: "mini.com", logoUrl: VL_IMG("mini") },
  { name: "Smart", slug: "smart", domain: "smart.com", logoUrl: VL_IMG("smart") },
  // USA
  { name: "Ford", slug: "ford", domain: "ford.com", logoUrl: VL_IMG("ford") },
  { name: "Chevrolet", slug: "chevrolet", domain: "chevrolet.com", logoUrl: VL_IMG("chevrolet") },
  { name: "Tesla", slug: "tesla", domain: "tesla.com", logoUrl: VL_IMG("tesla") },
  { name: "Jeep", slug: "jeep", domain: "jeep.com", logoUrl: VL_IMG("jeep") },
  { name: "Dodge", slug: "dodge", domain: "dodge.com", logoUrl: VL_IMG("dodge") },
  { name: "Cadillac", slug: "cadillac", domain: "cadillac.com", logoUrl: VL_IMG("cadillac") },
  { name: "GMC", slug: "gmc", domain: "gmc.com", logoUrl: VL_IMG("gmc") },
  { name: "Lincoln", slug: "lincoln", domain: "lincoln.com", logoUrl: VL_IMG("lincoln") },
  // Korea
  { name: "Hyundai", slug: "hyundai", domain: "hyundai.com", logoUrl: VL_IMG("hyundai") },
  { name: "Kia", slug: "kia", domain: "kia.com", logoUrl: VL_IMG("kia") },
  { name: "Genesis", slug: "genesis", domain: "genesis.com", logoUrl: VL_IMG("genesis") },
  { name: "SsangYong", slug: "ssangyong", domain: "ssangyong.com", logoUrl: VL_IMG("ssangyong") },
  // France
  { name: "Peugeot", slug: "peugeot", domain: "peugeot.com", logoUrl: VL_IMG("peugeot") },
  { name: "Renault", slug: "renault", domain: "renault.com", logoUrl: VL_IMG("renault") },
  { name: "Citroën", slug: "citroen", domain: "citroen.com", logoUrl: VL_IMG("citroen") },
  { name: "DS", slug: "ds", domain: "dsautomobiles.com", logoUrl: VL_IMG("ds") },
  // Italy
  { name: "Fiat", slug: "fiat", domain: "fiat.com", logoUrl: VL_IMG("fiat") },
  { name: "Ferrari", slug: "ferrari", domain: "ferrari.com", logoUrl: VL_IMG("ferrari") },
  { name: "Lamborghini", slug: "lamborghini", domain: "lamborghini.com", logoUrl: VL_IMG("lamborghini") },
  { name: "Maserati", slug: "maserati", domain: "maserati.com", logoUrl: VL_IMG("maserati") },
  { name: "Alfa Romeo", slug: "alfa-romeo", domain: "alfaromeo.com", logoUrl: VL_IMG("alfa-romeo") },
  { name: "Lancia", slug: "lancia", domain: "lancia.com", logoUrl: VL_IMG("lancia") },
  // UK
  { name: "Land Rover", slug: "land-rover", domain: "landrover.com", logoUrl: VL_IMG("land-rover") },
  { name: "Jaguar", slug: "jaguar", domain: "jaguar.com", logoUrl: VL_IMG("jaguar") },
  { name: "Bentley", slug: "bentley", domain: "bentleymotors.com", logoUrl: VL_IMG("bentley") },
  { name: "Rolls-Royce", slug: "rolls-royce", domain: "rolls-roycemotorcars.com", logoUrl: VL_IMG("rolls-royce") },
  { name: "Aston Martin", slug: "aston-martin", domain: "astonmartin.com", logoUrl: VL_IMG("aston-martin") },
  { name: "Lotus", slug: "lotus", domain: "lotuscars.com", logoUrl: VL_IMG("lotus") },
  // Sweden
  { name: "Volvo", slug: "volvo", domain: "volvocars.com", logoUrl: VL_IMG("volvo") },
  { name: "Saab", slug: "saab", domain: "saab.com", logoUrl: VL_IMG("saab") },
  { name: "Koenigsegg", slug: "koenigsegg", domain: "koenigsegg.com", logoUrl: VL_IMG("koenigsegg") },
  // China
  { name: "BYD", slug: "byd", domain: "byd.com", logoUrl: VL_IMG("byd") },
  { name: "Geely", slug: "geely", domain: "geely.com", logoUrl: VL_IMG("geely") },
  { name: "Great Wall", slug: "great-wall", domain: "gwm.com.cn", logoUrl: VL_IMG("great-wall") },
  { name: "Chery", slug: "chery", domain: "cheryinternational.com", logoUrl: VL_IMG("chery") },
  { name: "NIO", slug: "nio", domain: "nio.com", logoUrl: VL_IMG("nio") },
  { name: "XPeng", slug: "xpeng", domain: "xpeng.com", logoUrl: VL_IMG("xpeng") },
  // India
  { name: "Tata", slug: "tata", domain: "tatamotors.com", logoUrl: VL_IMG("tata") },
  { name: "Mahindra", slug: "mahindra", domain: "mahindra.com", logoUrl: VL_IMG("mahindra") },
  // Spain
  { name: "SEAT", slug: "seat", domain: "seat.com", logoUrl: VL_IMG("seat") },
  { name: "Cupra", slug: "cupra", domain: "cupraofficial.com", logoUrl: VL_IMG("cupra") },
  // Czech
  { name: "Škoda", slug: "skoda", domain: "skoda-auto.com", logoUrl: VL_IMG("skoda") },
  // Malaysia
  { name: "Proton", slug: "proton", domain: "proton.com", logoUrl: VL_IMG("proton") },
  { name: "Perodua", slug: "perodua", domain: "perodua.com.my", logoUrl: VL_IMG("perodua") },
  // Others
  { name: "Isuzu", slug: "isuzu", domain: "isuzu.com", logoUrl: VL_IMG("isuzu") },
  { name: "Scania", slug: "scania", domain: "scania.com", logoUrl: VL_IMG("scania") },
  { name: "MAN", slug: "man", domain: "man.eu", logoUrl: VL_IMG("man") },
  { name: "Iveco", slug: "iveco", domain: "iveco.com", logoUrl: VL_IMG("iveco") },
  { name: "Bugatti", slug: "bugatti", domain: "bugatti.com", logoUrl: VL_IMG("bugatti") },
  { name: "McLaren", slug: "mclaren", domain: "mclaren.com", logoUrl: VL_IMG("mclaren") },
  { name: "Pagani", slug: "pagani", domain: "pagani.com", logoUrl: VL_IMG("pagani") },
];

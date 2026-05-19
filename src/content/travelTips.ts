import ruegenImg from "@/assets/travel-ruegen.jpg";
import tropicalImg from "@/assets/travel-tropical.jpg";
import spreewaldImg from "@/assets/travel-spreewald.jpg";

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export interface PostLocale {
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  imgAlt: string;
  readingTime: string;
  content: ContentBlock[];
}

export interface TravelPost {
  slug: string;
  image: string;
  publishedAt: string; // ISO
  de: PostLocale;
  en: PostLocale;
}

export const travelPosts: TravelPost[] = [
  // ============================================================
  // 1) RÜGEN
  // ============================================================
  {
    slug: "wohnmobil-ruegen-ostsee-von-berlin",
    image: ruegenImg,
    publishedAt: "2026-05-19",
    de: {
      title: "Mit dem Wohnmobil nach Rügen – Ostsee-Urlaub ab Berlin",
      excerpt:
        "Rügen mit dem Wohnmobil von Berlin aus erleben: Route, beste Campingplätze, Tipps zu Kreidefelsen, Sellin und Kap Arkona – plus ehrliche Insider-Hinweise.",
      metaTitle: "Wohnmobil Rügen mieten von Berlin – Route, Stellplätze & Tipps 2026",
      metaDescription:
        "Mit dem Wohnmobil von Berlin nach Rügen: beste Route, ruhige Campingplätze, Kreidefelsen, Sellin & Kap Arkona. Erfahrungsbericht mit konkreten Tipps für die Ostsee-Reise.",
      imgAlt: "Wohnmobil bei Sonnenuntergang an der Ostseeküste auf Rügen",
      readingTime: "8 Min. Lesezeit",
      content: [
        { type: "p", text: "Rügen ist die größte Insel Deutschlands – und für Camper aus Berlin eines der dankbarsten Reiseziele überhaupt. In knapp drei Stunden Fahrt bist du von Berlin-Pankow bis zum Rügendamm in Stralsund, danach beginnt eine andere Welt: Kreideklippen, weiße Sandstrände, Buchenwälder, die zum UNESCO-Weltnaturerbe gehören, und mondäne Seebäder, die aussehen, als hätte die Zeit sie liebevoll konserviert. Mit dem Wohnmobil ab Berlin nach Rügen zu fahren bedeutet, dass du nicht an Hotelchecks und Restaurantöffnungszeiten gebunden bist. Du fährst zum Sonnenuntergang zum Kap Arkona, kochst dir oben auf der Klippe einen Kaffee und schläfst auf einem Stellplatz, der mehr Sterne als jedes 5-Sterne-Resort hat." },
        { type: "h2", text: "Wohnmobil Rügen von Berlin: Die ideale Route" },
        { type: "p", text: "Die Standardroute ist klar: Berlin-Pankow → A114 → A11 → A20 → A19 → B96 → Stralsund → Rügen. Insgesamt rund 290 km, je nach Verkehr 3 bis 3,5 Stunden. Wer Zeit mitbringt, sollte aber den Umweg über die mecklenburgische Schweiz oder Greifswald in Kauf nehmen. Mit einem Camper für 4 Personen ist Komfort entscheidend, und gerade auf der A19 hinter Wittstock lohnen sich kurze Pausen an den Raststätten Stolpe-Süd oder Linstow-Krakow, wo du auch problemlos mit einem 7,5-Tonner parken kannst." },
        { type: "p", text: "Der Tipp aus eigener Erfahrung: Starte früh. Wenn du um 7 Uhr morgens losfährst, bist du gegen 10 Uhr auf der Insel, hast Zeit für einen entspannten Strandspaziergang in Binz und kannst am späten Nachmittag deinen Stellplatz beziehen. Wer dagegen am Freitagnachmittag startet, steht garantiert vor Wittstock im Stau – und das ist mit einem 3,5-Tonner kein Spaß. Plane für die Rückfahrt am besten den Sonntagvormittag oder den Montag." },
        { type: "h2", text: "Die schönsten Campingplätze für Wohnmobile auf Rügen" },
        { type: "p", text: "Rügen hat eine erstaunlich gute Camping-Infrastruktur. Was viele unterschätzen: In der Hauptsaison (Juli/August) sind die beliebten Plätze oft Wochen im Voraus ausgebucht. Reserviere unbedingt frühzeitig, gerade wenn du mit Hund reist – Haustiere sind zwar fast überall erlaubt, aber die hundefreundlichen Buchten füllen sich zuerst." },
        { type: "h3", text: "Campingplatz Drewoldke (Altenkirchen)" },
        { type: "p", text: "Direkt am steilen Klippenufer im Norden Rügens. Spektakuläre Sonnenuntergänge, ruhige Lage, sehr gepflegte sanitäre Anlagen. Ideal, wenn du Kap Arkona und das Fischerdörfchen Vitt erkunden willst. Preislich im oberen Mittelfeld, aber jeden Cent wert." },
        { type: "h3", text: "Naturcamping Prora" },
        { type: "p", text: "Eingebettet zwischen dem Strand von Prora und dem Kleinen Jasmunder Bodden. Du läufst keine fünf Minuten und stehst im Wasser. Perfekt für Familien mit Kindern, die nicht ständig im Auto sitzen wollen. Mit einem Wohnmobil für 4 Personen findest du hier auch in der Hauptsaison eher einen Platz als in Binz oder Sellin." },
        { type: "h3", text: "Regenbogen Camp Göhren" },
        { type: "p", text: "Im Südosten der Insel, direkt am Mönchgut. Großer Platz mit vielen Familienangeboten, eigener Strandzugang und einer der besten Lagen für Wanderungen am Hochuferweg. Etwas trubeliger, dafür mit Restaurant und Brötchenservice." },
        { type: "h2", text: "Sehenswürdigkeiten Rügen mit dem Wohnmobil entdecken" },
        { type: "p", text: "Drei Ziele gehören für uns auf jede Rügen-Tour mit dem Camper, und sie lassen sich an einem verlängerten Wochenende sehr gut kombinieren." },
        { type: "h3", text: "Kreidefelsen und Königsstuhl im Nationalpark Jasmund" },
        { type: "p", text: "Der Klassiker. Wichtig: Mit dem Wohnmobil darfst du nicht direkt zum Königsstuhl fahren, die Zufahrt ist nur Shuttlebussen vorbehalten. Du parkst in Hagen und nimmst von dort den Bus. Plane für die gesamte Tour rund 4 Stunden ein, inklusive des Hochuferweges zur Viktoriasicht – der eigentlich noch beeindruckender ist als der Königsstuhl selbst." },
        { type: "h3", text: "Sellin und seine Seebrücke" },
        { type: "p", text: "Die wahrscheinlich schönste Seebrücke der Ostsee. Im weißen Bäderstil mit Restaurant am Brückenende. Geh am besten in der Nebensaison oder morgens vor 10 Uhr hin – dann hast du die Brücke fast für dich. Mit dem Camper parkst du am besten auf dem Großparkplatz Sellin (Wilhelmstraße) und gehst die letzten 800 Meter zu Fuß." },
        { type: "h3", text: "Kap Arkona und Vitt" },
        { type: "p", text: "Der nördlichste Punkt der Insel. Zwei Leuchttürme, ein Marinepeilturm, ein 800 Jahre altes Fischerdorf, das aussieht wie ein Freilichtmuseum. Auch hier: Wohnmobil oben am Parkplatz lassen, runter zum Dorf läufst du etwa 20 Minuten. Wer kann, bleibt bis zum Sonnenuntergang – das Licht auf dem Steilufer ist magisch." },
        { type: "h2", text: "Praktische Tipps für die Wohnmobil-Tour nach Rügen" },
        { type: "ul", items: [
          "Reise möglichst nicht in den Sommerferien Berlin-Brandenburgs an – die Insel ist voll, die Stellplätze knapp.",
          "Mai, Juni und September sind die idealen Monate: Wetter stabil, Wassertemperaturen ab Juni angenehm, Stellplätze entspannt buchbar.",
          "Tanken vor der Insel günstiger als auf Rügen selbst – nutze die Tankstellen in Stralsund.",
          "Brötchen bestellst du am Vorabend an der Camping-Rezeption – morgens stehst du sonst in der Schlange.",
          "Hundebesitzer: Viele Strände sind in der Hauptsaison hundefrei. Hundestrände gibt es in Binz, Göhren und Glowe – informiere dich vorab.",
          "Trinkwasser auffüllen geht auf jedem größeren Campingplatz, oft gegen kleine Gebühr.",
        ] },
        { type: "h2", text: "Wie viele Tage Rügen mit dem Wohnmobil?" },
        { type: "p", text: "Für ein ehrliches Insel-Gefühl brauchst du mindestens 5 Tage. 3 Tage gehen, sind aber Stress. Ideal sind 7 Tage: zwei Standorte, einer im Norden (Drewoldke), einer im Südosten (Göhren oder Sellin), dazwischen zwei Tage Programm. Wer länger bleibt, kann zusätzlich noch Hiddensee per Fähre besuchen – die kleine Schwester Rügens, autofrei und ein Geheimtipp." },
        { type: "h2", text: "Wohnmobil mieten für die Rügen-Reise ab Berlin" },
        { type: "p", text: "Bei uns mietest du einen privaten Camper für 4 Personen direkt in Berlin-Pankow. Du bekommst eine persönliche Übergabe, 150 Freikilometer pro Tag (das reicht für Hin- und Rückfahrt plus großzügige Inseltouren), Vollkasko ohne Selbstbeteiligungs-Bombe und ein Fahrzeug, das wir selbst pflegen. Keine anonymen Schalter, keine versteckten Kosten – einfach Schlüssel abholen und los geht die Ostsee-Tour." },
        { type: "quote", text: "Rügen ist nicht laut. Rügen ist nicht spektakulär. Rügen ist genau das, was du nach einer Woche Großstadt wirklich brauchst." },
      ],
    },
    en: {
      title: "Motorhome trip to Rügen – a Baltic Sea holiday from Berlin",
      excerpt:
        "Explore Rügen by motorhome from Berlin: the best route, quiet campsites, chalk cliffs, Sellin and Cape Arkona – plus honest insider tips.",
      metaTitle: "Rent a Motorhome for Rügen from Berlin – Route, Pitches & Tips 2026",
      metaDescription:
        "Motorhome trip from Berlin to Rügen: best route, quiet campsites, chalk cliffs, Sellin and Cape Arkona. First-hand report with concrete tips for your Baltic Sea trip.",
      imgAlt: "Motorhome at sunset on the Baltic coast of Rügen",
      readingTime: "8 min read",
      content: [
        { type: "p", text: "Rügen is Germany's largest island – and for campers from Berlin one of the most rewarding destinations you can pick. In just under three hours of driving you get from Berlin-Pankow to the Rügen bridge in Stralsund, and from there a different world begins: chalk cliffs, white sand beaches, beech forests that are part of the UNESCO World Heritage, and elegant seaside resorts that look as if time had lovingly preserved them. Driving a motorhome from Berlin to Rügen means you are not bound by hotel check-ins or restaurant opening hours. You drive to Cape Arkona for sunset, brew a coffee on top of the cliff and sleep at a pitch that has more stars than any 5-star resort." },
        { type: "h2", text: "Motorhome Rügen from Berlin: the ideal route" },
        { type: "p", text: "The standard route is straightforward: Berlin-Pankow → A114 → A11 → A20 → A19 → B96 → Stralsund → Rügen. Around 290 km in total, depending on traffic 3 to 3.5 hours. If you have time, the detour via the Mecklenburg Switzerland region or Greifswald is well worth it. With a camper for 4 people, comfort matters, and especially on the A19 past Wittstock short breaks at the Stolpe-Süd or Linstow-Krakow service areas are very welcome – both have plenty of space for a 7.5-tonne vehicle." },
        { type: "p", text: "The tip from personal experience: leave early. If you start at 7 am, you are on the island by 10 am, have time for a relaxed beach walk in Binz and can check in at your pitch in the late afternoon. If you instead start on Friday afternoon, you are guaranteed to be stuck in a traffic jam before Wittstock – and that is no fun with a 3.5-tonne motorhome. For the return trip, aim for Sunday morning or Monday." },
        { type: "h2", text: "The best motorhome campsites on Rügen" },
        { type: "p", text: "Rügen has surprisingly good camping infrastructure. What many underestimate: in high season (July/August) the popular sites are often fully booked weeks in advance. Reserve early, especially if you travel with a dog – pets are welcome almost everywhere, but the dog-friendly bays fill up first." },
        { type: "h3", text: "Camping Drewoldke (Altenkirchen)" },
        { type: "p", text: "Directly on the steep cliff coast in the north of Rügen. Spectacular sunsets, quiet location, very well-kept sanitary facilities. Ideal if you want to explore Cape Arkona and the fishing village of Vitt. Upper mid-range in price, but worth every cent." },
        { type: "h3", text: "Naturcamping Prora" },
        { type: "p", text: "Tucked between the Prora beach and the small Jasmunder Bodden. You walk less than five minutes and you are in the water. Perfect for families with kids who do not want to sit in the car all day. With a motorhome for 4 people you are more likely to find a spot here than in Binz or Sellin during high season." },
        { type: "h3", text: "Regenbogen Camp Göhren" },
        { type: "p", text: "In the south-east of the island, right at Mönchgut. Large site with many family activities, its own beach access and one of the best starting points for hikes along the cliff trail. A bit busier, but with a restaurant and bread roll service." },
        { type: "h2", text: "Rügen sights to discover with the motorhome" },
        { type: "p", text: "Three destinations belong on every Rügen tour, and they can be combined nicely over a long weekend." },
        { type: "h3", text: "Chalk cliffs and Königsstuhl in Jasmund National Park" },
        { type: "p", text: "The classic. Important: you are not allowed to drive your motorhome directly to the Königsstuhl, access is reserved for shuttle buses. You park in Hagen and take the bus from there. Plan around 4 hours for the whole tour, including the cliff trail to the Victoria viewpoint – which is actually even more impressive than the Königsstuhl itself." },
        { type: "h3", text: "Sellin and its pier" },
        { type: "p", text: "Probably the most beautiful pier on the Baltic Sea. Built in the white spa style with a restaurant at the end. Go in low season or in the morning before 10 am – then you have the pier almost to yourself. With the camper, park at the large Sellin car park (Wilhelmstraße) and walk the last 800 metres." },
        { type: "h3", text: "Cape Arkona and Vitt" },
        { type: "p", text: "The northernmost point of the island. Two lighthouses, a naval bearing tower, an 800-year-old fishing village that looks like an open-air museum. Same rule: leave the motorhome at the upper car park, you walk about 20 minutes down to the village. If you can, stay until sunset – the light on the steep coast is magical." },
        { type: "h2", text: "Practical tips for the motorhome tour to Rügen" },
        { type: "ul", items: [
          "If possible, avoid the Berlin-Brandenburg summer school holidays – the island is full and pitches are scarce.",
          "May, June and September are ideal: stable weather, comfortable water temperatures from June, easy pitch availability.",
          "Refuel before the island – fuel is cheaper in Stralsund than on Rügen itself.",
          "Order your bread rolls at the campsite reception the evening before – otherwise you stand in line in the morning.",
          "Dog owners: many beaches are dog-free in high season. Dog beaches exist in Binz, Göhren and Glowe – check in advance.",
          "You can refill fresh water at any larger campsite, often for a small fee.",
        ] },
        { type: "h2", text: "How many days for Rügen by motorhome?" },
        { type: "p", text: "For an honest island feel you need at least 5 days. 3 days work, but they are stressful. Ideal is 7 days: two base locations, one in the north (Drewoldke), one in the south-east (Göhren or Sellin), and two days of sightseeing in between. If you stay longer, you can also visit Hiddensee by ferry – Rügen's small car-free sister island and a real insider tip." },
        { type: "h2", text: "Rent a motorhome for your Rügen trip from Berlin" },
        { type: "p", text: "With us you rent a private camper for 4 people directly in Berlin-Pankow. You get a personal handover, 150 free kilometres per day (enough for the round trip plus generous island tours), full insurance without a brutal deductible and a vehicle that we maintain ourselves. No anonymous counters, no hidden costs – just pick up the keys and your Baltic Sea trip begins." },
        { type: "quote", text: "Rügen is not loud. Rügen is not spectacular. Rügen is exactly what you really need after a week of big-city life." },
      ],
    },
  },

  // ============================================================
  // 2) TROPICAL ISLAND
  // ============================================================
  {
    slug: "tropical-island-mit-wohnmobil-ausflug",
    image: tropicalImg,
    publishedAt: "2026-05-19",
    de: {
      title: "Mit dem Wohnmobil ins Tropical Island – entspannt mit Übernachtung",
      excerpt:
        "Tagesausflug ins Tropical Island ab Berlin – ohne Stress. Wir sind einen Tag vorher mit dem Camper angereist, haben in Ruhe übernachtet und den ganzen Tag bis abends in der Tropenhalle verbracht.",
      metaTitle: "Tropical Island mit dem Wohnmobil – Übernachtung, Stellplatz & Tipps",
      metaDescription:
        "Mit dem Wohnmobil ins Tropical Island ab Berlin: Stellplatz direkt nebenan, entspannte Anreise einen Tag vorher und ein ganzer Tag in der Tropenhalle. Erfahrungsbericht mit Tipps.",
      imgAlt: "Wohnmobil auf einem Campingplatz in der Nähe vom Tropical Island Brandenburg",
      readingTime: "7 Min. Lesezeit",
      content: [
        { type: "p", text: "Das Tropical Island Resort in Krausnick ist Brandenburgs vielleicht ungewöhnlichste Sehenswürdigkeit. In einer ehemaligen Werfthalle für Luftschiffe – der größten freitragenden Halle der Welt – wurde eine künstliche Tropenwelt eingerichtet: Sandstrand, Lagunen, Regenwald, Rutschen, 25 Grad das ganze Jahr. Für Familien aus Berlin und Brandenburg ist es ein Klassiker, vor allem im Winter, wenn draußen drei Grad sind und drinnen die Palmen rauschen. Wir sind mit dem Wohnmobil hingefahren – und können nur sagen: Das ist die mit Abstand entspannteste Variante, dieses Ziel zu erleben." },
        { type: "h2", text: "Warum Tropical Island mit dem Wohnmobil?" },
        { type: "p", text: "Wer das Tropical Island als Tagesgast aus Berlin besucht, kennt das Problem: Hinfahrt, Stau auf der A13, Parkplatz suchen, Tickets anstehen, dann erst rein – und um 19 Uhr willst du eigentlich noch bleiben, weißt aber, dass dich noch über eine Stunde Heimfahrt erwartet. Mit dem Camper löst sich dieses Problem in Luft auf. Direkt neben dem Resort gibt es einen Campingplatz und einen offiziellen Wohnmobilstellplatz, du parkst, gehst ein paar Schritte zur Halle und am Abend bist du in 3 Minuten zurück in deinem Bett. Keine Müdigkeitsfahrt, kein Stress, kein nasses Handtuch auf dem Rücksitz." },
        { type: "h2", text: "Unsere Anreise mit dem Wohnmobil – ein Tag früher" },
        { type: "p", text: "Wir sind bewusst einen Tag vor dem geplanten Tropical-Island-Besuch losgefahren. Strecke ab Berlin-Pankow: über die A100, A113 und A13 Richtung Dresden, Abfahrt Staakow, dann sind es nur noch wenige Kilometer bis zum Resort. Insgesamt rund 70 Kilometer und – ohne Stau – knapp eine Stunde Fahrt. Wir haben gegen 16 Uhr eingecheckt, in Ruhe das Wohnmobil aufgestellt, draußen den Abend mit Markise und Klappstühlen verbracht und sind früh ins Bett. Kein Hetzen, kein Frühstart am nächsten Morgen, sondern ein entspannter Auftakt, wie Urlaub eigentlich beginnen sollte." },
        { type: "p", text: "Die Übernachtung war hervorragend. Der Platz war ruhig, die Sanitäranlagen sauber, Strom- und Wasseranschluss problemlos verfügbar. Da wir mit unserem eigenen Wohnmobil unterwegs waren, hatten wir Küche, Dusche und Toilette ohnehin an Bord – aber für die kleine Wäsche und Trinkwasserversorgung war die Infrastruktur perfekt. Am nächsten Morgen Kaffee an der Markise, ein paar Brötchen aus dem Campingshop, und dann gemütlich zur Tropenhalle gelaufen." },
        { type: "h2", text: "Ein ganzer Tag im Tropical Island – bis in den Abend hinein" },
        { type: "p", text: "Wir hatten den ganzen Tag Zeit. Das ist der eigentliche Unterschied. Wer normalerweise hinfährt, kalkuliert vier oder fünf Stunden in der Halle, weil die Rückfahrt drückt. Wir konnten morgens als eine der ersten rein, hatten die Rutschen ohne Wartezeit, mittags eine ausgiebige Pause auf den Liegestühlen im Sandstrand-Bereich, nachmittags die Sauna-Welt, abends noch mal Strömungskanal und Lagunen-Schwimmbad. Als wir gegen 21 Uhr rausgekommen sind, waren die Kinder satt, glücklich und müde. Drei Minuten später lagen wir im Wohnmobil und sind eingeschlafen." },
        { type: "h2", text: "Was kostet das? Tropical Island Wohnmobilstellplatz & Tageskarte" },
        { type: "p", text: "Der Stellplatz direkt am Resort kostet je nach Saison und Komfortlevel etwa 25 – 35 € pro Nacht inklusive Strom, der angrenzende Campingplatz Tropical Camp ist etwas günstiger. Hinzu kommen die Tageskarten für die Tropenhalle, die je nach Alter und gebuchter Variante (mit oder ohne Sauna) zwischen 40 und 60 € liegen. Familien sollten Online-Tickets buchen, das spart Geld und Wartezeit am Eingang. Wer eine Übernachtung dazubucht, bekommt häufig vergünstigte Eintritte – es lohnt sich, die Pakete auf der Resort-Website zu vergleichen." },
        { type: "h2", text: "Praktische Tipps für deinen Wohnmobil-Trip zum Tropical Island" },
        { type: "ul", items: [
          "Reise wirklich einen Tag vorher an. Das ist der zentrale Trick – die Anreise wird zum entspannten Auftakt statt zum Stressfaktor.",
          "Plätze direkt am Resort sind in Schulferien voll. Reserviere mindestens zwei Wochen vorher, im Winter auch eher.",
          "Nimm Badesachen, Bademantel, Flipflops und Handtücher selbst mit – Leihhandtücher in der Halle sind teuer.",
          "Kühlschrank vorher mit Snacks und Getränken füllen. In der Halle gibt es zwar Essen, aber für Familien wird das schnell zur Großinvestition.",
          "Strom- und Wasseranschluss prüfen: Auf den Plätzen ist CEE-Stecker Standard, ein Adapter sollte bei jeder Wohnmobilmiete dabei sein – bei uns ist er es.",
          "Mit Hund? Hunde sind im Resort nicht erlaubt, aber auf dem Campingplatz schon. Eine Person bleibt dann zeitweise beim Wohnmobil, der Wechsel klappt entspannt.",
        ] },
        { type: "h2", text: "Lohnt sich der Tropical-Island-Trip mit Wohnmobil aus Berlin?" },
        { type: "p", text: "Ganz klar ja. Die Kombination aus kurzer Anreise (rund 1 Stunde), Übernachtung direkt am Ziel und entspanntem Rückweg am nächsten Tag macht aus einem hektischen Tagestrip einen kleinen Mini-Urlaub. Gerade für Familien mit zwei oder mehr Kindern ist es deutlich nervenschonender. Wir haben dafür den Preis einer einzigen Nacht im Hotel investiert – und dafür zwei volle Tage Erholung bekommen, ohne einmal in Verlegenheit zu geraten, ob man jetzt noch fahren kann." },
        { type: "h2", text: "Wohnmobil mieten in Berlin für den Tropical-Island-Ausflug" },
        { type: "p", text: "Unser privater Camper für 4 Personen ist genau für solche kurzen Mikroreisen gemacht. Abholung in Berlin-Pankow, in einer Stunde am Ziel, vier echte Schlafplätze, eigene Toilette, Küche, Heizung. Vollkasko inklusive, 150 Freikilometer pro Tag (du brauchst maximal 150 hin und zurück), Haustiere willkommen. Mindestmietdauer beträgt allerdings 5 Tage – kombiniere den Tropical-Island-Trip am besten mit einem Spreewald-Wochenende oder ein paar Tagen Lausitz, dann passt die Rechnung perfekt." },
        { type: "quote", text: "Eine Nacht vorher anreisen, eine Nacht nachher – plötzlich ist aus einem stressigen Tagesausflug ein kleines Urlaubsabenteuer geworden." },
      ],
    },
    en: {
      title: "Tropical Islands by motorhome – a relaxed day trip with an overnight stay",
      excerpt:
        "Day trip to Tropical Islands from Berlin – without the stress. We arrived a day earlier with the camper, had a great night nearby and spent the whole next day in the tropical dome until evening.",
      metaTitle: "Tropical Islands by Motorhome – Pitch, Overnight Stay & Tips",
      metaDescription:
        "Tropical Islands by motorhome from Berlin: campsite right next door, relaxed arrival a day earlier and a full day in the tropical dome. First-hand report with practical tips.",
      imgAlt: "Motorhome at a campsite near Tropical Islands in Brandenburg",
      readingTime: "7 min read",
      content: [
        { type: "p", text: "Tropical Islands Resort in Krausnick is perhaps Brandenburg's most unusual attraction. Inside a former airship hangar – the largest free-standing hall in the world – an artificial tropical world has been built: sandy beach, lagoons, rainforest, slides, 25 degrees all year round. For families from Berlin and Brandenburg it is a classic, especially in winter when it is three degrees outside and palm trees rustle indoors. We drove there with our motorhome – and can only say: this is by far the most relaxed way to experience this destination." },
        { type: "h2", text: "Why visit Tropical Islands by motorhome?" },
        { type: "p", text: "Anyone visiting Tropical Islands from Berlin as a day guest knows the problem: the drive there, a traffic jam on the A13, finding a parking space, queueing for tickets, only then getting in – and at 7 pm you actually want to stay longer but know that a one-hour drive home is still ahead. With a camper this problem evaporates. Right next to the resort there is a campsite and an official motorhome pitch. You park, take a few steps to the dome, and in the evening you are back in your bed in three minutes. No tired driving, no stress, no wet towel on the back seat." },
        { type: "h2", text: "Our arrival by motorhome – a day earlier" },
        { type: "p", text: "We deliberately set off one day before our planned Tropical Islands visit. Route from Berlin-Pankow: via A100, A113 and A13 towards Dresden, exit Staakow, then only a few kilometres to the resort. Around 70 kilometres in total and – without traffic – just under one hour of driving. We checked in around 4 pm, set up the camper at our own pace, spent the evening outside with the awning and folding chairs and went to bed early. No rushing, no early start the next morning, just a relaxed kick-off – the way a holiday should actually begin." },
        { type: "p", text: "The overnight stay was excellent. The pitch was quiet, the sanitary facilities clean, electricity and fresh water available without hassle. Because we were travelling in our own motorhome, we already had a kitchen, shower and toilet on board – but for laundry and drinking water the infrastructure was perfect. The next morning coffee under the awning, a few bread rolls from the camping shop, and then a comfortable walk to the tropical dome." },
        { type: "h2", text: "A whole day at Tropical Islands – right until the evening" },
        { type: "p", text: "We had the whole day. That is the real difference. Most visitors calculate four or five hours inside the dome because the drive home is pressing. We could get in among the first ones in the morning, used the slides without waiting time, had a long lunch break on sun loungers in the beach area, did the sauna world in the afternoon, and back to the current channel and lagoon pool in the evening. When we came out around 9 pm, the kids were full, happy and tired. Three minutes later we were lying in the camper, fast asleep." },
        { type: "h2", text: "What does it cost? Tropical Islands motorhome pitch and day pass" },
        { type: "p", text: "The pitch right next to the resort costs around 25–35 € per night depending on season and comfort level, electricity included. The neighbouring Tropical Camp campsite is a little cheaper. On top come the day tickets for the dome, which range between 40 and 60 € depending on age and the booked variant (with or without sauna). Families should book online tickets – this saves money and waiting time at the entrance. If you book a stay including overnight, you often get discounted entries; it pays off to compare the packages on the resort website." },
        { type: "h2", text: "Practical tips for your motorhome trip to Tropical Islands" },
        { type: "ul", items: [
          "Really arrive one day earlier. That is the key trick – the journey becomes a relaxed kick-off rather than a stress factor.",
          "Pitches right at the resort are full during school holidays. Reserve at least two weeks in advance, in winter even earlier.",
          "Bring your own swimwear, bathrobe, flip-flops and towels – rental towels at the dome are pricey.",
          "Fill the fridge with snacks and drinks beforehand. There is food inside the dome, but for families that becomes a major investment fast.",
          "Check the electricity and water connection: pitches use CEE plugs, an adapter should be part of every motorhome rental – with us it is.",
          "Travelling with a dog? Dogs are not allowed inside the resort, but they are on the campsite. One person stays at the camper for a while, the swap works comfortably.",
        ] },
        { type: "h2", text: "Is the Tropical Islands trip by motorhome from Berlin worth it?" },
        { type: "p", text: "Absolutely yes. The combination of a short drive (around one hour), an overnight stay right at the destination and a relaxed return the next day turns a hectic day trip into a small mini-holiday. Especially for families with two or more children it is significantly less stressful. We invested the price of a single hotel night for this – and got two full days of recovery in return, without ever being in the awkward position of wondering whether driving is still safe." },
        { type: "h2", text: "Rent a motorhome in Berlin for the Tropical Islands trip" },
        { type: "p", text: "Our private camper for 4 people is made exactly for such short micro-trips. Pickup in Berlin-Pankow, one hour to the destination, four real sleeping berths, own toilet, kitchen, heating. Full insurance included, 150 free kilometres per day (you need at most 150 round trip), pets welcome. The minimum rental period is 5 days however – best combine the Tropical Islands trip with a Spreewald weekend or a few days in Lusatia, then the maths works out perfectly." },
        { type: "quote", text: "Arrive one night before, stay one night after – suddenly a stressful day trip becomes a small holiday adventure." },
      ],
    },
  },

  // ============================================================
  // 3) SPREEWALD
  // ============================================================
  {
    slug: "spreewald-tour-wohnmobil-ab-berlin",
    image: spreewaldImg,
    publishedAt: "2026-05-19",
    de: {
      title: "Spreewald-Tour mit dem Wohnmobil – Kahnfahrt, Stellplätze & Geheimtipps",
      excerpt:
        "Spreewald mit dem Wohnmobil ab Berlin – Route nach Lübbenau und Burg, beste Stellplätze, Kahnfahrt-Tipps, Gurken-Manufakturen und unsere ehrlichen Insider-Empfehlungen.",
      metaTitle: "Spreewald Wohnmobil Tour ab Berlin – Stellplätze, Kahnfahrt & Tipps",
      metaDescription:
        "Spreewald-Tour mit dem Wohnmobil ab Berlin: ruhige Stellplätze in Lübbenau und Burg, Kahnfahrt-Tipps, Radwege und kulinarische Geheimtipps. Erfahrungsbericht mit konkreten Empfehlungen.",
      imgAlt: "Wohnmobil auf einem Stellplatz im Spreewald in Brandenburg",
      readingTime: "8 Min. Lesezeit",
      content: [
        { type: "p", text: "Der Spreewald ist eine eigene kleine Welt – ein Labyrinth aus über 1.500 Kilometern Wasserläufen, Erlenbruchwäldern und Wiesen, das südöstlich von Berlin beginnt und sich bis ins Lausitzer Bergland zieht. Für Berliner ist er das schnellste echte Abenteuer: rund eine Stunde Fahrt, und du bist in einem UNESCO-Biosphärenreservat, in dem Postzusteller bis heute mit dem Kahn unterwegs sind. Eine Spreewald-Tour mit dem Wohnmobil ab Berlin gehört für uns zu den dankbarsten Mikroreisen, die Brandenburg zu bieten hat – kurze Anreise, intensive Natur, hervorragendes Essen, und gleichzeitig genug Strecke, um wirklich abzuschalten." },
        { type: "h2", text: "Spreewald mit dem Wohnmobil: Anreise und Route ab Berlin" },
        { type: "p", text: "Die schnellste Verbindung führt über die A113 und A13 Richtung Dresden, Abfahrt Lübbenau-Spreewald. Ab Berlin-Pankow bist du in etwa 75 Minuten dort – vorausgesetzt, du startest nicht im Freitagnachmittagsverkehr. Eine schönere Alternative für Camper, die Zeit haben: Bundesstraßen über Königs Wusterhausen und Lübben. Diese Route ist 20 Minuten länger, aber landschaftlich deutlich angenehmer und führt durch kleine Dörfer, in denen du auch problemlos einen Bäcker oder Hofladen findest." },
        { type: "p", text: "Die beiden klassischen Ausgangspunkte sind Lübbenau und Burg. Lübbenau ist die touristische Hauptstadt – mehr Trubel, mehr Auswahl an Kahnfahrten, viele Restaurants, fußläufige Altstadt. Burg ist ruhiger, natürlicher, hat den großen Vorteil der enormen Fließausdehnung mit weniger Touristen und eine besondere Atmosphäre. Wir empfehlen, beides zu kombinieren: Ein bis zwei Nächte in Lübbenau für das touristische Programm, zwei Nächte in Burg für die echte Spreewald-Stille." },
        { type: "h2", text: "Die besten Wohnmobilstellplätze im Spreewald" },
        { type: "h3", text: "Stellplatz am Spreewald-Tor Lübbenau" },
        { type: "p", text: "Direkt am Großen Hafen, zentral, fußläufig zu allen Kahnfahrt-Anlegern. Recht günstig (etwa 18 € pro Nacht inkl. Strom). In der Hauptsaison voll, aber organisiert. Perfekt für eine erste Nacht, um sofort ins Programm zu starten." },
        { type: "h3", text: "Spreewald-Camping Lübben" },
        { type: "p", text: "Sehr großer, gut ausgestatteter Campingplatz mit Schwimmbad, Restaurant und Brötchenservice. Liegt etwas außerhalb von Lübben, ist aber mit dem Fahrrad gut angebunden. Ideal für Familien mit Kindern, die mehrere Tage bleiben wollen." },
        { type: "h3", text: "Reisemobilhafen Burg" },
        { type: "p", text: "Unser persönlicher Favorit. Ruhig, eingebettet in Gärten, direkter Zugang zum Radwegenetz. Du läufst 10 Minuten und stehst am Spreewald-Hafen Burg, von dem die ruhigsten Kahnfahrten starten. In der Hauptsaison unbedingt reservieren." },
        { type: "h2", text: "Kahnfahrt buchen – worauf du achten solltest" },
        { type: "p", text: "Eine Spreewald-Tour ohne Kahnfahrt ist wie Berlin ohne Brandenburger Tor. Aber: Es gibt erhebliche Qualitätsunterschiede. Klassisch ist die 2- bis 3-Stunden-Tour mit lokalem Kahnführer, oft mit Einkehr in einer der typischen Spreewaldgaststätten. Diese Touren starten in Lübbenau am Großen Hafen und in Burg am Hafen Burg. Preise: zwischen 12 und 20 € pro Person." },
        { type: "p", text: "Unser Tipp: Buche eine Kahnfahrt am späten Nachmittag, idealerweise mit Sonnenuntergang. Das Licht ist dann magisch, die großen Reisegruppen sind weg und die Stille auf den Fließen ist beeindruckend. Wer es noch ruhiger mag, kann in Burg eine Solo-Kahnfahrt buchen oder ein Paddelboot mieten – das geht ab etwa 25 € pro Tag und du bestimmst deine eigene Route." },
        { type: "h2", text: "Spreewald-Radtour: 35 Kilometer pures Glück" },
        { type: "p", text: "Wer mehr will als nur Kahnfahren, sollte mit dem Rad fahren. Der Gurkenradweg ist die bekannteste Route – rund 260 km insgesamt, aber du kannst beliebige Etappen herauspicken. Schöne Tagestour: Burg → Leipe → Lehde → Lübbenau und zurück. Insgesamt rund 35 km, fast komplett autofrei, über Brücken, vorbei an Reetdachhäusern und Gurkenfeldern. In Lehde lohnt sich das Freilandmuseum, in Leipe der Imbiss am Hafen mit frischem Räucherfisch." },
        { type: "h2", text: "Essen im Spreewald – mehr als nur Gurken" },
        { type: "p", text: "Klar, Spreewälder Gurken gibt es überall. Aber unterschätze die Region nicht kulinarisch. Die typische sorbisch-wendische Küche – Hochzeitssuppe, Quark mit Leinöl und Pellkartoffeln, geräucherter Aal, Wildgerichte – ist deftig, ehrlich und überraschend raffiniert. Empfehlungen:" },
        { type: "ul", items: [
          "Gasthaus Wotschofska in Lübbenau – nur mit dem Kahn erreichbar, was den Abend zum Erlebnis macht.",
          "Schlossberghof Burg – regional, sehr gepflegt, vegetarisch ebenfalls stark.",
          "Spreewälder Hof Lehde – einfach, herzlich, mit großem Biergarten unter alten Bäumen.",
          "Gurkenmuseum Lehde – ja, ist touristisch, lohnt sich aber wegen der Verkostung verschiedener Einlegevarianten.",
        ] },
        { type: "h2", text: "Wann ist die beste Reisezeit für den Spreewald?" },
        { type: "p", text: "Mai bis Anfang Oktober. Der absolute Höhepunkt ist Mitte Mai bis Mitte Juni – warm genug zum Paddeln, noch nicht überlaufen, die Wiesen blühen. Der August ist wunderschön, aber voll. September ist unser persönlicher Favorit: mildes Licht, ruhige Wasserwege, abends frisch genug für ein Lagerfeuer-Gefühl mit der Markise am Wohnmobil. Im Winter ist der Spreewald geschlossen wirkend – die Kahnfahrten ruhen ab November bis Ostern, dafür hast du die Landschaft komplett für dich." },
        { type: "h2", text: "Praktische Tipps für deine Spreewald-Wohnmobil-Tour" },
        { type: "ul", items: [
          "Mücken! Im Mai und Juni bringt der Spreewald seine kleinen Bewohner mit. Mückenspray und Fliegengitter sind kein Luxus, sondern Pflicht.",
          "Mit dem Wohnmobil reichen 150 Freikilometer pro Tag locker für komplette Spreewald-Touren – die Strecken bleiben kurz, die Erlebnisse intensiv.",
          "Lade dir die App des Spreewald-Tourismus herunter – Kahnfahrten, Stellplätze und Restaurants auf einen Blick.",
          "Hunde willkommen: Im Spreewald sind Hunde fast überall erlaubt, auch auf den Kähnen (vorher fragen).",
          "Bargeld einstecken – manche kleinen Imbisse und Hofläden nehmen keine Karte.",
        ] },
        { type: "h2", text: "Wohnmobil mieten für die Spreewald-Tour ab Berlin" },
        { type: "p", text: "Bei uns mietest du einen privaten Camper für 4 Personen direkt in Berlin-Pankow. In rund 75 Minuten bist du im Spreewald, hast 150 Freikilometer pro Tag inklusive, Vollkasko ohne hohe Selbstbeteiligung, Markise und LED-Licht für gemütliche Abende vor dem Wohnmobil. Mindestmietdauer 5 Tage – ideal für eine ausgedehnte Spreewald-Runde mit Abstecher in die Lausitzer Seenplatte oder den Tropical-Island-Tag, den wir im anderen Artikel beschrieben haben." },
        { type: "quote", text: "Der Spreewald ist nicht weit – aber er fühlt sich an, als wärst du tausend Kilometer von Berlin entfernt." },
      ],
    },
    en: {
      title: "Spreewald tour by motorhome – punt boat ride, pitches & insider tips",
      excerpt:
        "Spreewald by motorhome from Berlin – route to Lübbenau and Burg, best pitches, punt boat tips, gherkin manufactories and our honest insider recommendations.",
      metaTitle: "Spreewald Motorhome Tour from Berlin – Pitches, Punt Boats & Tips",
      metaDescription:
        "Spreewald tour by motorhome from Berlin: quiet pitches in Lübbenau and Burg, punt boat tips, cycle routes and culinary insider tips. First-hand report with concrete recommendations.",
      imgAlt: "Motorhome at a pitch in the Spreewald region of Brandenburg",
      readingTime: "8 min read",
      content: [
        { type: "p", text: "The Spreewald is a small world of its own – a labyrinth of more than 1,500 kilometres of waterways, alder swamp forests and meadows that begins south-east of Berlin and reaches into the Lusatian hills. For Berliners it is the quickest real adventure: around an hour of driving and you are in a UNESCO Biosphere Reserve where postal workers still deliver mail by punt boat. A Spreewald tour by motorhome from Berlin is for us one of the most rewarding micro-trips Brandenburg has to offer – short drive, intense nature, excellent food, and yet enough distance to really switch off." },
        { type: "h2", text: "Spreewald by motorhome: arrival and route from Berlin" },
        { type: "p", text: "The fastest connection is via the A113 and A13 towards Dresden, exit Lübbenau-Spreewald. From Berlin-Pankow you are there in about 75 minutes – provided you do not start in Friday afternoon traffic. A more scenic alternative for campers with time: country roads via Königs Wusterhausen and Lübben. This route is 20 minutes longer, but landscape-wise significantly nicer and leads through small villages where you can easily find a bakery or a farm shop." },
        { type: "p", text: "The two classic starting points are Lübbenau and Burg. Lübbenau is the tourist capital – more bustle, more punt boat choices, many restaurants, walkable old town. Burg is quieter, more natural, with the huge advantage of the wide waterway network with fewer tourists and a very special atmosphere. We recommend combining both: one or two nights in Lübbenau for the touristy programme, two nights in Burg for the real Spreewald silence." },
        { type: "h2", text: "The best motorhome pitches in the Spreewald" },
        { type: "h3", text: "Pitch at Spreewald-Tor Lübbenau" },
        { type: "p", text: "Right at the Great Harbour, central, walking distance to all punt boat docks. Quite affordable (around 18 € per night including electricity). Full in high season, but organised. Perfect for a first night to dive straight into the programme." },
        { type: "h3", text: "Spreewald-Camping Lübben" },
        { type: "p", text: "Very large, well-equipped campsite with swimming pool, restaurant and bread roll service. A bit outside of Lübben, but well-connected by bicycle. Ideal for families with kids who want to stay several days." },
        { type: "h3", text: "Reisemobilhafen Burg" },
        { type: "p", text: "Our personal favourite. Quiet, embedded in gardens, with direct access to the cycle network. You walk 10 minutes and you stand at the Spreewald harbour in Burg, from where the quietest punt boat trips start. In high season, definitely reserve." },
        { type: "h2", text: "Booking a punt boat ride – what to look out for" },
        { type: "p", text: "A Spreewald tour without a punt boat ride is like Berlin without the Brandenburg Gate. But: there are significant quality differences. The classic is a 2 to 3 hour tour with a local boatman, often with a stop at one of the typical Spreewald inns. These tours start in Lübbenau at the Great Harbour and in Burg at Burg Harbour. Prices: between 12 and 20 € per person." },
        { type: "p", text: "Our tip: book a punt boat ride in the late afternoon, ideally including the sunset. The light is magical then, the big tour groups are gone and the silence on the waterways is impressive. If you want it even quieter, in Burg you can book a private punt boat ride or rent a canoe – this starts at around 25 € per day and you decide your own route." },
        { type: "h2", text: "Spreewald cycle tour: 35 kilometres of pure bliss" },
        { type: "p", text: "If you want more than just punt boats, get on a bike. The Gherkin Cycle Route is the most famous – around 260 km in total, but you can pick any section. Nice day tour: Burg → Leipe → Lehde → Lübbenau and back. About 35 km in total, almost entirely car-free, over bridges, past thatched-roof houses and gherkin fields. In Lehde the open-air museum is worth a visit, in Leipe the harbour snack bar with freshly smoked fish." },
        { type: "h2", text: "Eating in the Spreewald – more than just gherkins" },
        { type: "p", text: "Sure, Spreewald gherkins are everywhere. But do not underestimate the region culinarily. The typical Sorbian-Wendish cuisine – wedding soup, quark with linseed oil and jacket potatoes, smoked eel, game dishes – is hearty, honest and surprisingly sophisticated. Recommendations:" },
        { type: "ul", items: [
          "Gasthaus Wotschofska in Lübbenau – only reachable by punt boat, which makes the evening an experience in itself.",
          "Schlossberghof Burg – regional, very well-kept, also strong vegetarian options.",
          "Spreewälder Hof Lehde – simple, warm-hearted, with a large beer garden under old trees.",
          "Gherkin Museum Lehde – yes, it is touristy, but worth it for the tasting of different pickling varieties.",
        ] },
        { type: "h2", text: "When is the best time to visit the Spreewald?" },
        { type: "p", text: "May to early October. The absolute peak is mid-May to mid-June – warm enough to paddle, not yet overcrowded, meadows in bloom. August is beautiful but busy. September is our personal favourite: mild light, calm waterways, evenings cool enough for a campfire feeling under the motorhome awning. In winter the Spreewald seems closed – the punt boat rides pause from November until Easter, but you have the landscape completely to yourself." },
        { type: "h2", text: "Practical tips for your Spreewald motorhome tour" },
        { type: "ul", items: [
          "Mosquitoes! In May and June, the Spreewald brings its little inhabitants. Mosquito spray and fly screens are not a luxury but a must.",
          "With the motorhome, 150 free kilometres per day are easily enough for full Spreewald tours – distances stay short, experiences stay intense.",
          "Download the Spreewald tourism app – punt boats, pitches and restaurants at a glance.",
          "Dogs welcome: in the Spreewald dogs are allowed almost everywhere, even on the boats (ask in advance).",
          "Bring cash – some small snack bars and farm shops do not take cards.",
        ] },
        { type: "h2", text: "Rent a motorhome for the Spreewald tour from Berlin" },
        { type: "p", text: "With us you rent a private camper for 4 people directly in Berlin-Pankow. In around 75 minutes you are in the Spreewald, with 150 free kilometres per day included, full insurance without high deductibles, awning and LED lights for cosy evenings outside the motorhome. Minimum rental period 5 days – ideal for an extended Spreewald loop with a side trip to the Lusatian Lake District or the Tropical Islands day described in the other article." },
        { type: "quote", text: "The Spreewald is not far – but it feels as if you were a thousand kilometres away from Berlin." },
      ],
    },
  },
];

export const getPostBySlug = (slug: string): TravelPost | undefined =>
  travelPosts.find((p) => p.slug === slug);

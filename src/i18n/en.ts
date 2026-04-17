import type { de } from "./de";

export const en: typeof de = {
  // Navigation
  nav: {
    advantages: "Benefits",
    pricing: "Pricing",
    equipment: "Equipment",
    faq: "FAQ",
    contact: "Contact",
    inquire: "Inquire",
    inquireNow: "Inquire now",
    openMenu: "Open menu",
    brand: "CAMPER BERLIN",
  },

  // Hero
  hero: {
    title: "Rent a Motorhome in Berlin & Brandenburg",
    subtitle: "Your camper for 4 people – depart directly from Berlin and experience freedom on four wheels. Fully comprehensive insurance, 150\u00A0free kilometers per day and pets welcome.",
    badges: ["4 Sleeping spots", "Fully insured", "From €119/day", "Dogs welcome"],
    cta: "Send a free inquiry",
    imgAlt: "Rent a motorhome Berlin Brandenburg – Camper exterior view",
  },

  // Trust / Advantages
  trust: {
    label: "At a Glance",
    title: "Why rent our camper?",
    subtitle: "Minimum rental: 5 days · Price per day",
    items: [
      { title: "4 Sleeping & Seat places", text: "Room for the whole family – all secured with seatbelts." },
      { title: "150 km/day included", text: "Generous mileage package for day trips." },
      { title: "Fully insured", text: "No hidden insurance costs." },
      { title: "Abroad trips allowed", text: "Explore Europe – no problem." },
      { title: "Pet-friendly", text: "Your dog travels with you." },
      { title: "Awning tent included", text: "Extra living space in any weather." },
      { title: "Awning with LED", text: "Cozy evenings with mood lighting." },
      { title: "USB at sleeping spots", text: "Charge smartphones right at the bed." },
      { title: "Pickup in Berlin", text: "Start in Berlin." },
    ],
  },

  // Pricing
  pricing: {
    label: "Transparent Pricing",
    title: "What does a motorhome in Berlin cost?",
    offSeason: "Off Season",
    offSeasonPeriod: "October – April",
    mainSeason: "Peak Season",
    mainSeasonPeriod: "May 1 – September 30",
    popular: "Popular",
    perDay: "/ day",
    features: ["Price per day", "150 km per day included", "Fully insured", "Minimum rental: 5 days", "Extra km: €0.35/km"],
    cta: "Inquire now",
    deposit: "Deposit:",
    depositText: "€1,500 – by bank transfer or cash by arrangement.",
    cleaning: "Cleaning:",
    cleaningText: "No charge if returned clean. Otherwise €200.",
    extras: "Extras:",
    extrasText: "Gas grill (€40) · E-scooter (€75) · Bed linen (€20 per person)",
  },

  // Target groups
  target: {
    label: "Perfect for you",
    title: "Who is the camper ideal for?",
    items: [
      { title: "For Couples", text: "Discover the most beautiful spots together – romantic evenings under the awning included." },
      { title: "For Small Families", text: "4 sleeping spots, child seat anchors and plenty of storage." },
      { title: "For Road Trips from Berlin", text: "Directly from Berlin – Baltic Sea, Saxon Switzerland or Brandenburg." },
      { title: "For Trips with Dogs", text: "Your four-legged friend is welcome – maximum flexibility at campsites." },
      { title: "For Beginners", text: "Personal introduction and tutorial videos – start without prior experience." },
      { title: "For Trips Abroad", text: "Abroad trips allowed – Europe at your own pace." },
    ],
  },

  // Equipment
  equipment: {
    label: "Fully Equipped",
    title: "Everything on Board",
    categories: [
      {
        title: "Living & Sleeping",
        items: [
          "4 comfortable sleeping spots", "USB charging at every sleeping spot",
          "Blackout blinds for restful sleep", "Roof windows for light and fresh air",
          "Spacious cupboards for luggage", "Adapter for external power supply",
          "Central locking", "Driver and passenger seats swivel – better access to the dining table",
        ],
      },
      {
        title: "Kitchen",
        items: [
          "Gas stove with multiple burners", "Fridge with built-in freezer",
          "Coffee machine – enjoy fresh coffee in the morning",
        ],
      },
      {
        title: "Bathroom",
        items: ["Shower on board", "Toilet (cassette toilet)"],
      },
      {
        title: "Technology",
        items: [
          "TV with satellite system", "Audio system with Bluetooth, CD, DVD, MP3 & USB",
          "Navigation system",
        ],
      },
      {
        title: "Climate & Ventilation",
        items: [
          "Air conditioning in the driver area (standard)",
          "Additional air conditioning in living and sleeping area",
          "Air conditioning in living area also usable as heating",
          "Gas heating for cold days",
          "Fan (MaxxFan) – blows air in and out",
          "Provides air circulation, temperature regulation and fresh air without air conditioning",
          "Off-grid camping without electricity possible",
        ],
      },
      {
        title: "Driving Comfort",
        items: [
          "Reversing camera for safe maneuvering", "Cruise control for relaxed long distances",
          "Power steering", "Electric windows",
        ],
      },
      {
        title: "Exterior",
        items: [
          "Awning tent – additional living space in any weather", "Awning with LED lighting",
          "Leveling wedges & cable reel", "Power connection for shore power", "Water canister",
        ],
      },
      {
        title: "Safety",
        items: [
          "Solar panels for independent power supply", "Auxiliary battery", "Hot water tank",
          "No ISOFIX mount available", "Fire extinguisher & fire blanket",
          "Smoke detector & carbon monoxide detector",
        ],
      },
    ],
  },

  // Gallery
  gallery: {
    label: "Gallery",
    title: "Your Camper in Pictures",
    subtitle: "See for yourself – this is what your home on four wheels looks like.",
    images: [
      { alt: "Motorhome exterior view – side view on green meadow", label: "Exterior" },
      { alt: "Motorhome with awning, camping chairs and table", label: "With Awning" },
      { alt: "Cozy bedroom in the motorhome with double bed", label: "Bedroom" },
      { alt: "Motorhome interior with kitchen and drop-down bed", label: "Kitchen & Bed" },
      { alt: "Kitchen area with sink and ladder to drop-down bed", label: "Kitchenette" },
      { alt: "Cozy seating area with table in the motorhome", label: "Seating Area" },
      { alt: "Bathroom with toilet and washbasin", label: "Bathroom" },
      { alt: "Large storage space at the rear of the motorhome", label: "Storage" },
    ],
  },

  // Beginner
  beginner: {
    label: "For Beginners",
    title: "Renting a camper for the first time?",
    subtitle: "Many of our renters in Berlin start without camper experience – and come back thrilled.",
    items: [
      { title: "Personal Introduction", text: "We show you everything at your own pace during handover." },
      { title: "Easy Operation", text: "All functions are intuitive – no prior knowledge needed." },
      { title: "Tutorial Videos", text: "Our videos explain every step on your smartphone." },
      { title: "Drive Off Relaxed", text: "Class B license, reversing camera, cruise control and sat nav." },
    ],
  },

  // Video
  video: {
    label: "Video Guides",
    title: "Tutorial Videos for Your First Trip",
    subtitle: "So you feel safe on the road – easily accessible on your smartphone.",
    topics: ["Fridge", "Awning", "Setting up camp", "Stove", "Heating", "Power & Water", "Grey water & Toilet", "Awning tent"],
    notice: "🎬 You'll receive the videos after your booking – before departure.",
    noticeSubtitle: "So you can prepare at your own pace and learn everything important beforehand.",
  },

  // FAQ
  faq: {
    label: "FAQ",
    title: "Frequently Asked Questions",
    items: [
      { q: "How much does it cost to rent a motorhome in Berlin Brandenburg?", a: "In the off-season (October – April) the camper costs €119 per day, in the peak season (May 1 – September 30) €129 per day. The price includes 150 free kilometers per day and fully comprehensive insurance. There are no hidden insurance costs." },
      { q: "How many kilometers are included per day?", a: "150 kilometers are included per rental day. You can comfortably plan day trips without worrying about additional costs." },
      { q: "What does each additional kilometer cost?", a: "Each kilometer beyond the free mileage allowance is charged at €0.35." },
      { q: "Is comprehensive insurance included?", a: "Yes, fully comprehensive insurance is included in the rental price. You don't need to take out additional insurance." },
      { q: "Who is allowed to drive the motorhome?", a: "The motorhome may be driven by persons aged 30 and over with a valid Class B driving license." },
      { q: "Is a regular car license sufficient?", a: "Yes, a Class B license is sufficient. The vehicle weighs under 3.5 tons and can therefore be driven with a regular car license." },
      { q: "How many people can travel and sleep?", a: "The motorhome has 4 seats with seatbelts and 4 sleeping spots. It is ideal for couples, small families or groups of friends." },
      { q: "Are pets allowed?", a: "Yes, pets are welcome. Your dog can accompany you on your trip." },
      { q: "Where is the pickup?", a: "Pickup is in Berlin. You start your road trip directly from Berlin." },
      { q: "Can I drive the motorhome abroad?", a: "Yes, trips abroad are allowed. You can explore all of Europe with the camper." },
      { q: "Are there additional costs?", a: "The rental price already includes fully comprehensive insurance and 150 free kilometers per day. Additional costs may apply for extra kilometers (€0.35/km), uncleaned return (€200) or optional extras like the gas grill (€40) or e-scooter (€75)." },
      { q: "What happens if the vehicle is returned uncleaned?", a: "If the vehicle is not returned cleaned inside and out, a cleaning fee of €200 applies. No additional costs arise if returned clean. Grey water and toilet must also be emptied." },
      { q: "Do grey water and toilet need to be emptied?", a: "Yes, grey water and toilet must be emptied upon return. This is part of the standard return process and is explained during the introduction." },
      { q: "What extras can I add?", a: "You can add a gas grill (one-time €40) and an e-scooter (one-time €75) – ideal for even more flexibility at the campsite." },
      { q: "Is bed linen included?", a: "No, bed linen is not included in the rental price. Please bring your own bed linen or sleeping bags." },
      { q: "Is the vehicle suitable for beginners?", a: "Absolutely. Many of our renters drive a motorhome for the first time. You'll receive a personal introduction and tutorial videos on all important functions – so you can drive off relaxed." },
      { q: "Is there help with using the vehicle?", a: "Yes, you'll get a thorough introduction during handover. Additionally, tutorial videos are available that you can access anytime on the road." },
      { q: "Are there videos explaining the individual functions?", a: "Yes, we provide tutorial videos on all important topics – from the awning to the stove to grey water disposal. So you can review everything at your own pace." },
      { q: "Are festivals allowed?", a: "No, trips to festivals are unfortunately not permitted." },
      { q: "Is smoking allowed in the vehicle?", a: "No, smoking in the vehicle is not permitted." },
    ],
  },

  // Contact
  contact: {
    label: "Contact",
    title: "Inquire About the Camper",
    subtitle: "Non-binding – fast and personal response.",
    directContact: "Contact directly",
    directContactSub: "Choose your preferred way",
    directSimple: "Direct and uncomplicated",
    fastResponse: "Fast response",
    sampleMessage: '"Hi, I\'m interested in the Camper Berlin Brandenburg. Is the motorhome available for my desired dates?"',
    rentalTimes: "📅 Rental Times",
    rentalTimesText: "Handover takes place between morning and evening. The exact time is arranged individually.",
    minRental: "Minimum rental period: 5 days",
    callBtn: "Call",
    formTitle: "Inquiry Form",
    formSubtitle: "Non-binding inquiry",
    name: "Name *",
    email: "Email *",
    phone: "Phone number *",
    startDate: "Start date *",
    endDate: "End date *",
    minDaysError: "The minimum rental period is 5 days.",
    dateBooked: "This day is already booked (marked in red).",
    calendarLoading: "Loading availability…",
    calendarError: "Could not load calendar.",
    destination: "Destination (e.g. city or region)",
    selectCountry: "Select country",
    countryBlocked: "Unfortunately we cannot rent the motorhome for this country as our insurance does not cover this destination.",
    kilometers: "Estimated kilometers *",
    persons: "Number of people",
    petNo: "Pet: No",
    petYes: "Pet: Yes",
    message: "Message (optional)",
    submit: "Send inquiry",
    toastMissing: "Required field missing",
    toastMissingDesc: "Please select start and end dates.",
    toastMinDays: "Minimum rental period",
    toastMinDaysDesc: "The minimum rental period is 5 days.",
    toastCountry: "Country not available",
    toastCountryDesc: "Unfortunately our insurance does not cover this country.",
    toastSuccess: "Inquiry sent!",
    toastSuccessDesc: "We'll get back to you as soon as possible.",
    extrasTitle: "Add extras (optional)",
    extrasSubtitle: "Prices per booking",
    extraBedding: "Bed linen",
    extraTowels: "Towels",
    extraGrill: "Gas grill",
    extraScooter: "E-scooter",
    extraScooterQty: "Quantity (max. 3)",
    extrasTotal: "Extras subtotal",
    summaryTitle: "Total amount",
    summaryRental: "Rental",
    summaryDays: "days",
    summaryExtras: "Extras",
    summaryNet: "Net amount",
    summaryVat: "VAT (19%)",
    summaryGross: "Total (incl. VAT)",
  },

  // Final CTA
  finalCta: {
    title: "Your Adventure Starts in Berlin",
    subtitle: "Rent a motorhome, hit the road, be free.",
    urgency: "Popular dates fill up fast – secure your preferred time.",
    cta: "Inquire now",
  },

  // Footer
  footer: {
    imprint: "Legal Notice",
    privacy: "Privacy Policy",
    rights: "All rights reserved.",
  },
};

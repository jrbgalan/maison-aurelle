// Analytics + chart content for the Home chronology section.
// Each stat carries a `summaryParts` line shown above the record bar,
// updated to the currently active stat as the user scrolls.
export const stats = [
  {
    id: "clients",
    label: "Clients Treated",
    value: 12400,
    suffix: "+",
    summaryParts: [
      { text: "12,400", bold: true },
      { text: " guests welcomed across two ateliers since 2014", bold: false },
    ],
  },
  {
    id: "specialists",
    label: "Specialists",
    value: 18,
    suffix: "",
    summaryParts: [
      { text: "18", bold: true },
      { text: " Specialists: ", bold: false },
      { text: "7", bold: true },
      { text: " Doctors, ", bold: false },
      { text: "6", bold: true },
      { text: " Aestheticians and ", bold: false },
      { text: "5", bold: true },
      { text: " Nurses", bold: false },
    ],
  },
  {
    id: "treatments",
    label: "Treatments Offered",
    value: 32,
    suffix: "",
    summaryParts: [
      { text: "32", bold: true },
      { text: " treatments across ", bold: false },
      { text: "6", bold: true },
      { text: " disciplines of care", bold: false },
    ],
  },
  {
    id: "years",
    label: "Years of Excellence",
    value: 12,
    suffix: "",
    summaryParts: [
      { text: "12", bold: true },
      { text: " years of quiet, science-led practice", bold: false },
    ],
  },
  {
    id: "satisfaction",
    label: "Satisfaction Rate",
    value: 98,
    suffix: "%",
    summaryParts: [
      { text: "98%", bold: true },
      { text: " of guests would return, or recommend us", bold: false },
    ],
  },
];

export const clientsByYear = [
  { year: "2014", clients: 320 },
  { year: "2016", clients: 1450 },
  { year: "2018", clients: 3100 },
  { year: "2020", clients: 5200 },
  { year: "2022", clients: 8400 },
  { year: "2024", clients: 10800 },
  { year: "2026", clients: 12400 },
];
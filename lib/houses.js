// House metadata: colours used to theme the UI, plus the start-screen cards.

export const HOUSE_COLORS = {
  Gryffindor: { primary: "#740001", secondary: "#d3a625", accent: "#eeba30" },
  Slytherin:  { primary: "#1a472a", secondary: "#aaaaaa", accent: "#2a623d" },
  Ravenclaw:  { primary: "#0e1a40", secondary: "#946b2d", accent: "#5d5d5d" },
  Hufflepuff: { primary: "#a6741a", secondary: "#372e29", accent: "#ecb939" }
};

export const HOUSES = [
  {
    key: "Gryffindor", cls: "gryffindor", traits: "Brave & daring",
    title: "Founded by Godric Gryffindor · Element: Fire · Ghost: Sir Nicholas (Nearly Headless Nick) · Tower entered past the Fat Lady"
  },
  {
    key: "Slytherin", cls: "slytherin", traits: "Cunning & ambitious",
    title: "Founded by Salazar Slytherin · Element: Water · Ghost: The Bloody Baron · Common room beneath the Black Lake"
  },
  {
    key: "Ravenclaw", cls: "ravenclaw", traits: "Wise & witty",
    title: "Founded by Rowena Ravenclaw · Element: Air · Ghost: The Grey Lady (Helena Ravenclaw) · Enter by answering a riddle"
  },
  {
    key: "Hufflepuff", cls: "hufflepuff", traits: "Loyal & kind",
    title: "Founded by Helga Hufflepuff · Element: Earth · Ghost: The Fat Friar · Common room beside the kitchens"
  }
];

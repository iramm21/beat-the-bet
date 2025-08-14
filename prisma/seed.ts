import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Upsert league
  const league = await prisma.league.upsert({
    where: { key: "NRL" },
    update: {},
    create: {
      key: "NRL",
      name: "National Rugby League",
    },
  });

  // Upsert teams
  const teams = [
    { code: "BRON", name: "Brisbane Broncos" },
    { code: "RAID", name: "Canberra Raiders" },
    { code: "BULL", name: "Canterbury-Bankstown Bulldogs" },
    { code: "SHAR", name: "Cronulla-Sutherland Sharks" },
    { code: "TITA", name: "Gold Coast Titans" },
    { code: "SEAE", name: "Manly Warringah Sea Eagles" },
    { code: "STOR", name: "Melbourne Storm" },
    { code: "KNIG", name: "Newcastle Knights" },
    { code: "WARR", name: "New Zealand Warriors" },
    { code: "COWB", name: "North Queensland Cowboys" },
    { code: "EELS", name: "Parramatta Eels" },
    { code: "PANT", name: "Penrith Panthers" },
    { code: "DRAG", name: "St George Illawarra Dragons" },
    { code: "RABB", name: "South Sydney Rabbitohs" },
    { code: "ROOS", name: "Sydney Roosters" },
    { code: "TIGE", name: "Wests Tigers" },
    { code: "DOLP", name: "Dolphins" },
  ];

  await prisma.$transaction(
    teams.map((team) =>
      prisma.team.upsert({
        where: { code: team.code },
        update: {},
        create: team,
      })
    )
  );

  // Determine upcoming season (next calendar year)
  const year = new Date().getUTCFullYear() + 1;

  const season = await prisma.season.upsert({
    where: { leagueId_year: { leagueId: league.id, year } },
    update: {},
    create: {
      leagueId: league.id,
      year,
    },
  });

  // Create rounds for the season
  const rounds = Array.from({ length: 27 }, (_, i) => ({
    seasonId: season.id,
    number: i + 1,
    name: `Round ${i + 1}`,
  }));

  await prisma.$transaction(
    rounds.map((round) =>
      prisma.round.upsert({
        where: {
          seasonId_number: { seasonId: season.id, number: round.number },
        },
        update: {},
        create: round,
      })
    )
  );

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

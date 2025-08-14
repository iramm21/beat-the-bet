-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "nrl";

-- CreateEnum
CREATE TYPE "nrl"."FixtureStatus" AS ENUM ('SCHEDULED', 'LIVE', 'FINISHED', 'CANCELED');

-- CreateEnum
CREATE TYPE "nrl"."MarketKey" AS ENUM ('MATCH_WINNER', 'LINE', 'TOTAL_POINTS');

-- CreateTable
CREATE TABLE "nrl"."League" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nrl"."Season" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nrl"."Round" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nrl"."Team" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "homeVenue" TEXT,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nrl"."Fixture" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "roundId" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "status" "nrl"."FixtureStatus" NOT NULL DEFAULT 'SCHEDULED',
    "homeTeamId" TEXT NOT NULL,
    "awayTeamId" TEXT NOT NULL,
    "venue" TEXT,

    CONSTRAINT "Fixture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nrl"."Result" (
    "id" TEXT NOT NULL,
    "fixtureId" TEXT NOT NULL,
    "homeScore" INTEGER NOT NULL,
    "awayScore" INTEGER NOT NULL,
    "winnerId" TEXT,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nrl"."Market" (
    "id" TEXT NOT NULL,
    "fixtureId" TEXT NOT NULL,
    "key" "nrl"."MarketKey" NOT NULL,
    "line" DOUBLE PRECISION,

    CONSTRAINT "Market_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nrl"."Bookmaker" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Bookmaker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nrl"."Odds" (
    "id" TEXT NOT NULL,
    "fixtureId" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,
    "bookmakerId" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "priceDecimal" DOUBLE PRECISION NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Odds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nrl"."ModelVersion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sha" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meta" JSONB,

    CONSTRAINT "ModelVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nrl"."Prediction" (
    "id" TEXT NOT NULL,
    "fixtureId" TEXT NOT NULL,
    "modelVersionId" TEXT NOT NULL,
    "marketKey" "nrl"."MarketKey" NOT NULL,
    "outcome" TEXT NOT NULL,
    "prob" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nrl"."RawOddsSnapshot" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT,
    "payload" JSONB NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawOddsSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "League_key_key" ON "nrl"."League"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Season_leagueId_year_key" ON "nrl"."Season"("leagueId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Round_seasonId_number_key" ON "nrl"."Round"("seasonId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Team_code_key" ON "nrl"."Team"("code");

-- CreateIndex
CREATE INDEX "Fixture_startsAt_idx" ON "nrl"."Fixture"("startsAt");

-- CreateIndex
CREATE UNIQUE INDEX "Fixture_seasonId_homeTeamId_awayTeamId_startsAt_key" ON "nrl"."Fixture"("seasonId", "homeTeamId", "awayTeamId", "startsAt");

-- CreateIndex
CREATE UNIQUE INDEX "Result_fixtureId_key" ON "nrl"."Result"("fixtureId");

-- CreateIndex
CREATE INDEX "Market_fixtureId_key_idx" ON "nrl"."Market"("fixtureId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmaker_key_key" ON "nrl"."Bookmaker"("key");

-- CreateIndex
CREATE INDEX "Odds_fixtureId_marketId_bookmakerId_fetchedAt_idx" ON "nrl"."Odds"("fixtureId", "marketId", "bookmakerId", "fetchedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ModelVersion_sha_key" ON "nrl"."ModelVersion"("sha");

-- CreateIndex
CREATE INDEX "Prediction_fixtureId_marketKey_outcome_idx" ON "nrl"."Prediction"("fixtureId", "marketKey", "outcome");

-- CreateIndex
CREATE INDEX "RawOddsSnapshot_source_fetchedAt_idx" ON "nrl"."RawOddsSnapshot"("source", "fetchedAt");

-- AddForeignKey
ALTER TABLE "nrl"."Season" ADD CONSTRAINT "Season_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "nrl"."League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nrl"."Round" ADD CONSTRAINT "Round_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "nrl"."Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nrl"."Fixture" ADD CONSTRAINT "Fixture_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "nrl"."Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nrl"."Fixture" ADD CONSTRAINT "Fixture_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "nrl"."Round"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nrl"."Fixture" ADD CONSTRAINT "Fixture_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "nrl"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nrl"."Fixture" ADD CONSTRAINT "Fixture_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "nrl"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nrl"."Result" ADD CONSTRAINT "Result_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "nrl"."Fixture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nrl"."Market" ADD CONSTRAINT "Market_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "nrl"."Fixture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nrl"."Odds" ADD CONSTRAINT "Odds_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "nrl"."Fixture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nrl"."Odds" ADD CONSTRAINT "Odds_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "nrl"."Market"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nrl"."Odds" ADD CONSTRAINT "Odds_bookmakerId_fkey" FOREIGN KEY ("bookmakerId") REFERENCES "nrl"."Bookmaker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nrl"."Prediction" ADD CONSTRAINT "Prediction_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "nrl"."Fixture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nrl"."Prediction" ADD CONSTRAINT "Prediction_modelVersionId_fkey" FOREIGN KEY ("modelVersionId") REFERENCES "nrl"."ModelVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

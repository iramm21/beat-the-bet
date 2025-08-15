import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const fixtures = await prisma.fixture.findMany({
      where: {
        startsAt: {
          gte: new Date(),
        },
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        odds: {
          include: {
            bookmaker: true,
            market: true,
          },
        },
      },
      orderBy: {
        startsAt: "asc",
      },
    });

    return NextResponse.json(fixtures);
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    return NextResponse.json(
      { error: "Failed to fetch fixtures" },
      { status: 500 }
    );
  }
}

from data.knowledge_base import KNOWLEDGE_BASE


def search_knowledge(
    crop: str,
    soil: str,
    climate: str,
    problem: str,
    country: str | None = None,
    region: str | None = None,
):
    crop = crop.lower()
    soil = soil.lower()
    climate = climate.lower()
    problem = problem.lower()

    results = []

    for item in KNOWLEDGE_BASE:
        score = 0

        if item["crop"].lower() == crop:
            score += 4

        if soil in [s.lower() for s in item["soil"]]:
            score += 2

        if climate in [c.lower() for c in item["climate"]]:
            score += 2

        if problem in [p.lower() for p in item["problem"]]:
            score += 3

        if country and item["country"].lower() == country.lower():
            score += 1

        if region and item["region"].lower() == region.lower():
            score += 1

        if score > 0:
            results.append(
                {
                    "id": item["practice_id"],
                    "country": item["country"],
                    "region": item["region"],
                    "crop": item["crop"],
                    "practice": item["practice"],
                    "target_problem": item["problem"][0],
                    "suitable_conditions": [
                        f"Soil: {', '.join(item['soil'])}",
                        f"Climate: {', '.join(item['climate'])}",
                    ],
                    "evidence": {
                        "source": item["source"],
                        "reference": item["practice"],
                    },
                    "applicability_score": round(
                        min(score / 13, 1.0),
                        2,
                    ),
                }
            )

    results.sort(
        key=lambda x: x["applicability_score"],
        reverse=True,
    )

    return results[:5]
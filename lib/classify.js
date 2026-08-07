export function classify(message, categories) {
    const normalizedMessage = message.toLowerCase();

    const scored = categories.map((category) => {
        let score = 0;
        for (const keyword of category.keywords) {
            const pattern = new RegExp(`\\b${keyword.toLowerCase()}\\b`);
            if (pattern.test(normalizedMessage)) {
                score++;
            }
        }
        return { category, score };
    });

    console.log(scored.map(s => ({ name: s.category.name, score: s.score, keywords: s.category.keywords })));


    scored.sort((a, b) => b.score - a.score);

    const best = scored[0];
    const secondBest = scored[1];

    if (!best || best.score === 0) {
        return { category: null, score: 0, escalate: true, reason: "no_match" };
    }

    if (secondBest && secondBest.score === best.score) {
        return { category: null, score: best.score, escalate: true, reason: "ambiguous" };
    }

    if (best.category.force_escalation) {
        return { category: best.category, score: best.score, escalate: true, reason: "sensitive_topic" };
    }

    return { category: best.category, score: best.score, escalate: false, reason: null };
}
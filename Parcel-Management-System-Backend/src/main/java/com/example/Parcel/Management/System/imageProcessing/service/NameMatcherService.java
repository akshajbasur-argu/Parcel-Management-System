package com.example.Parcel.Management.System.imageProcessing.service;
import com.example.Parcel.Management.System.imageProcessing.entity.UserInfo;
import org.apache.commons.text.similarity.JaroWinklerSimilarity;
import org.apache.commons.text.similarity.LevenshteinDistance;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class NameMatcherService {

    private static final Pattern ALPHA_SUBSTRINGS = Pattern.compile("[A-Za-z]{3,}"); // >=3 letters
    private static final JaroWinklerSimilarity jaro = new JaroWinklerSimilarity();
    private static final LevenshteinDistance levenshtein = new LevenshteinDistance();

    /**
     * Step A: Extract likely name tokens from noisy OCR text.
     * Returns distinct tokens ordered by length desc (longer more informative).
     */
    public List<String> extractLikelyNameTokens(String ocrText) {
        if (ocrText == null) return Collections.emptyList();
        Matcher m = ALPHA_SUBSTRINGS.matcher(ocrText);
        Set<String> set = new LinkedHashSet<>();
        while (m.find()) {
            String tok = m.group().trim();
            if (tok.length() >= 3) {
                set.add(normalize(tok));
            }
        }
        // order by length desc (longer tokens first)
        return set.stream()
                .sorted(Comparator.<String>comparingInt(String::length).reversed())
                .collect(Collectors.toList());
    }

    /**
     * Normalizes a name-like string: lowercase, remove non-alpha, single-space collapse.
     */
    public String normalize(String s) {
        if (s == null) return "";
        String cleaned = s.replaceAll("[^A-Za-z ]+", " ")
                .replaceAll("\\s+", " ")
                .trim()
                .toLowerCase(Locale.ROOT);
        return cleaned;
    }

    /**
     * Build candidate name phrases from OCR text:
     * - longest continuous alphabetic substring(s)
     * - contiguous windows of tokens (2-3 tokens) if available
     */
    public List<String> buildCandidatesFromOcr(String ocrText) {
        List<String> tokens = extractLikelyNameTokens(ocrText);
        List<String> candidates = new ArrayList<>();

        // Add top single tokens (up to 5)
        for (int i = 0; i < Math.min(5, tokens.size()); i++) candidates.add(tokens.get(i));

        // Build 2- and 3-token contiguous candidates from the original OCR (keeping order)
        String[] words = normalize(ocrText).split(" ");
        List<String> wordsList = Arrays.stream(words).filter(w -> w.length() >= 2).collect(Collectors.toList());
        for (int n = 2; n <= 3; n++) {
            for (int i = 0; i + n <= wordsList.size(); i++) {
                String join = String.join(" ", wordsList.subList(i, i + n));
                if (join.length() > 3) candidates.add(join);
            }
        }

        // Add the full cleaned OCR as a fallback
        candidates.add(normalize(ocrText));

        // dedupe and keep order
        return candidates.stream().filter(s -> !s.isBlank()).distinct().collect(Collectors.toList());
    }

    /**
     * Trigram set for character-level Dice similarity (robust to insertions).
     */
    private Set<String> trigrams(String s) {
        s = s.replaceAll("\\s+", " ");
        String padded = "__" + s + "__"; // padding to capture edges
        Set<String> set = new HashSet<>();
        for (int i = 0; i + 3 <= padded.length(); i++) {
            set.add(padded.substring(i, i + 3));
        }
        return set;
    }

    private double trigramDice(String a, String b) {
        if (a.isBlank() || b.isBlank()) return 0.0;
        Set<String> sa = trigrams(a);
        Set<String> sb = trigrams(b);
        int inter = 0;
        for (String t : sa) if (sb.contains(t)) inter++;
        return (2.0 * inter) / (sa.size() + sb.size());
    }

    /**
     * Token set overlap (Jaccard on tokens) — helps with multi-word names and token reordering.
     */
    private double tokenSetOverlap(String a, String b) {
        Set<String> sa = Arrays.stream(a.split("\\s+")).collect(Collectors.toSet());
        Set<String> sb = Arrays.stream(b.split("\\s+")).collect(Collectors.toSet());
        if (sa.isEmpty() || sb.isEmpty()) return 0.0;
        Set<String> inter = new HashSet<>(sa);
        inter.retainAll(sb);
        Set<String> union = new HashSet<>(sa);
        union.addAll(sb);
        return (double) inter.size() / (double) union.size();
    }

    /**
     * Combined similarity score between extractedCandidate and a DB candidate string.
     * Weighted combination: Jaro (short-string robust) + trigramDice (robust to noise) + token overlap.
     */
    public double combinedScore(String extractedCandidate, String dbName) {
        if (extractedCandidate == null || dbName == null) return 0.0;
        String a = normalize(extractedCandidate);
        String b = normalize(dbName);
        if (a.isEmpty() || b.isEmpty()) return 0.0;

        double j = jaro.apply(a, b);                 // 0..1
        double t = trigramDice(a, b);                // 0..1
        double tok = tokenSetOverlap(a, b);          // 0..1

        // small length penalty using Levenshtein normalized
        int lev = levenshtein.apply(a, b);
        double levNorm = 1.0 - ( (double) lev / (double) Math.max(1, Math.max(a.length(), b.length())) );
        if (levNorm < 0) levNorm = 0;

        // weights tuned for OCR-noise cases
        double score = (0.45 * j) + (0.30 * t) + (0.15 * tok) + (0.10 * levNorm);
        return Math.max(0.0, Math.min(1.0, score));
    }

    /**
     * Main API: find top matches from DB names.
     *
     * @param ocrText  raw OCR text
     * @param dbNames  list of candidate names from DB (id,name) could be mapped as strings
     * @param topN     how many top results to return
     * @param threshold minimal score (0..1) to accept a match
     */
    public List<MatchResult> findTopMatches(String ocrText, List<UserInfo> dbNames, int topN, double threshold) {
        List<String> candidates = buildCandidatesFromOcr(ocrText);

        // Map DB name -> best score across candidates
        Map<String, Double> bestScores = new HashMap<>();
        for (UserInfo dbName : dbNames) bestScores.put(dbName.getEmail(), 0.0);

        for (String cand : candidates) {
            for (UserInfo dbName : dbNames) {
                double s = combinedScore(cand, dbName.getFirstName());
                bestScores.compute(dbName.getEmail(), (k, cur) -> Math.max(cur, s));
            }
        }

        // create sorted list of results above threshold
        return bestScores.entrySet().stream()
                .map(e -> new MatchResult(e.getKey(), e.getValue()))
                .filter(r -> r.score >= threshold)
                .sorted(Comparator.comparingDouble((MatchResult r) -> r.score).reversed())
                .limit(topN)
                .collect(Collectors.toList());
    }

    public static class MatchResult {
        public final String name;
        public final double score;
        public MatchResult(String name, double score) {
            this.name = name;
            this.score = score;
        }
        @Override public String toString() { return name + " (" + String.format("%.3f", score) + ")"; }
    }
}


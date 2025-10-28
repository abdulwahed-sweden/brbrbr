/// AI Text Detection Module
///
/// This module implements a heuristic-based approach to detect AI-generated text.
/// It analyzes various patterns common in AI-generated content vs human writing.

use std::collections::HashSet;

pub struct TextAnalyzer;

impl TextAnalyzer {
    /// Analyze text and return AI probability score (0-100)
    pub fn analyze(text: &str) -> f32 {
        if text.trim().is_empty() {
            return 50.0;
        }

        let mut ai_score = 0.0;
        let mut total_weight = 0.0;

        // Factor 1: Sentence length uniformity (weight: 25%)
        let uniformity_score = Self::analyze_sentence_uniformity(text);
        ai_score += uniformity_score * 0.25;
        total_weight += 0.25;

        // Factor 2: Vocabulary diversity (weight: 20%)
        let diversity_score = Self::analyze_vocabulary_diversity(text);
        ai_score += diversity_score * 0.20;
        total_weight += 0.20;

        // Factor 3: AI-common phrases (weight: 30%)
        let phrase_score = Self::detect_ai_phrases(text);
        ai_score += phrase_score * 0.30;
        total_weight += 0.30;

        // Factor 4: Punctuation patterns (weight: 15%)
        let punctuation_score = Self::analyze_punctuation(text);
        ai_score += punctuation_score * 0.15;
        total_weight += 0.15;

        // Factor 5: Text length and structure (weight: 10%)
        let structure_score = Self::analyze_structure(text);
        ai_score += structure_score * 0.10;
        total_weight += 0.10;

        // Normalize to 0-100 range
        (ai_score / total_weight).clamp(0.0, 100.0)
    }

    /// Analyze sentence length uniformity
    /// AI text often has more uniform sentence lengths
    fn analyze_sentence_uniformity(text: &str) -> f32 {
        let sentences: Vec<&str> = text.split(&['.', '!', '?'][..])
            .filter(|s| !s.trim().is_empty())
            .collect();

        if sentences.len() < 3 {
            return 50.0;
        }

        let lengths: Vec<usize> = sentences.iter().map(|s| s.len()).collect();
        let avg_length: f32 = lengths.iter().sum::<usize>() as f32 / lengths.len() as f32;

        let variance: f32 = lengths.iter()
            .map(|&len| {
                let diff = len as f32 - avg_length;
                diff * diff
            })
            .sum::<f32>() / lengths.len() as f32;

        // Low variance = more uniform = more AI-like
        // Threshold: variance < 200 is considered uniform
        if variance < 200.0 {
            70.0 // High AI probability
        } else if variance < 500.0 {
            40.0 // Medium
        } else {
            20.0 // Low AI probability (natural variation)
        }
    }

    /// Analyze vocabulary diversity
    /// AI text sometimes has lower unique word ratio
    fn analyze_vocabulary_diversity(text: &str) -> f32 {
        let words: Vec<&str> = text.split_whitespace().collect();
        if words.len() < 10 {
            return 50.0;
        }

        let unique_words: HashSet<String> = words.iter()
            .map(|w| w.to_lowercase().trim_matches(|c: char| !c.is_alphanumeric()).to_string())
            .filter(|w| !w.is_empty())
            .collect();

        let diversity_ratio = unique_words.len() as f32 / words.len() as f32;

        // Higher diversity = more human-like
        if diversity_ratio > 0.7 {
            20.0 // Low AI probability
        } else if diversity_ratio > 0.5 {
            40.0
        } else {
            70.0 // High AI probability
        }
    }

    /// Detect common AI phrases
    fn detect_ai_phrases(text: &str) -> f32 {
        let text_lower = text.to_lowercase();

        let ai_phrases = [
            "as an ai",
            "i don't have personal",
            "i cannot",
            "i'm sorry, but",
            "it's important to note",
            "it is worth noting",
            "furthermore",
            "in conclusion",
            "to summarize",
            "delve into",
            "multifaceted",
            "paradigm shift",
            "cutting-edge",
            "state-of-the-art",
            "best practices",
            "leverage",
            "utilize",
            "facilitate",
            "comprehensive understanding",
        ];

        let mut matches = 0;
        for phrase in ai_phrases.iter() {
            if text_lower.contains(phrase) {
                matches += 1;
            }
        }

        // More AI phrases = higher AI probability
        if matches >= 3 {
            85.0
        } else if matches == 2 {
            70.0
        } else if matches == 1 {
            55.0
        } else {
            30.0
        }
    }

    /// Analyze punctuation patterns
    fn analyze_punctuation(text: &str) -> f32 {
        let total_chars = text.len() as f32;
        if total_chars == 0.0 {
            return 50.0;
        }

        let exclamation_count = text.matches('!').count() as f32;
        let _question_count = text.matches('?').count() as f32;
        let comma_count = text.matches(',').count() as f32;

        let exclamation_ratio = exclamation_count / total_chars * 100.0;
        let comma_ratio = comma_count / total_chars * 100.0;

        // AI text often has:
        // - Fewer exclamation marks (more formal)
        // - More consistent comma usage

        let mut score: f32 = 50.0;

        if exclamation_ratio < 0.5 {
            score += 15.0; // Less emotional = more AI-like
        }

        if comma_ratio > 2.0 && comma_ratio < 4.0 {
            score += 10.0; // Consistent comma usage
        }

        score.clamp(0.0, 100.0)
    }

    /// Analyze overall text structure
    fn analyze_structure(text: &str) -> f32 {
        let word_count = text.split_whitespace().count();
        let paragraph_count = text.split("\n\n").filter(|p| !p.trim().is_empty()).count();

        // AI text often has well-structured paragraphs
        if paragraph_count > 1 && word_count / paragraph_count > 50 && word_count / paragraph_count < 150 {
            60.0 // Structured = slightly more AI-like
        } else {
            40.0
        }
    }

    /// Determine verdict based on AI score
    pub fn get_verdict(ai_percentage: f32) -> String {
        if ai_percentage >= 60.0 {
            "AI Generated".to_string()
        } else if ai_percentage <= 40.0 {
            "Human Written".to_string()
        } else {
            "Uncertain".to_string()
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_analyze_empty_text() {
        let score = TextAnalyzer::analyze("");
        assert_eq!(score, 50.0);
    }

    #[test]
    fn test_analyze_with_ai_phrases() {
        let text = "As an AI, I cannot provide personal opinions. It's important to note that...";
        let score = TextAnalyzer::analyze(text);
        assert!(score > 50.0);
    }
}

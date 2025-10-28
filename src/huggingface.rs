/// Hugging Face API Integration Module
///
/// This module provides integration with Hugging Face's AI text detection models.
/// Uses the roberta-base-openai-detector model for high-accuracy AI detection.

use serde::{Deserialize, Serialize};
use std::env;

/// Request payload for Hugging Face inference API
#[derive(Serialize)]
struct HfRequest {
    inputs: String,
}

/// Response from Hugging Face API
/// The model returns an array of label/score pairs
#[derive(Deserialize, Debug)]
struct HfResponse {
    label: String,
    score: f32,
}

/// Error types for Hugging Face API calls
#[derive(Debug)]
pub enum HfError {
    ApiError(String),
    NetworkError(String),
    ParseError(String),
    ConfigError(String),
}

impl std::fmt::Display for HfError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            HfError::ApiError(msg) => write!(f, "API Error: {}", msg),
            HfError::NetworkError(msg) => write!(f, "Network Error: {}", msg),
            HfError::ParseError(msg) => write!(f, "Parse Error: {}", msg),
            HfError::ConfigError(msg) => write!(f, "Config Error: {}", msg),
        }
    }
}

impl std::error::Error for HfError {}

/// Main function to analyze text using Hugging Face API
///
/// # Arguments
/// * `text` - The text to analyze
///
/// # Returns
/// * `Result<f32, HfError>` - AI probability score (0-100) or error
pub async fn analyze_with_huggingface(text: &str) -> Result<f32, HfError> {
    // Get API token from environment variable
    let api_token = env::var("HF_API_TOKEN")
        .map_err(|_| HfError::ConfigError("HF_API_TOKEN not set in environment".to_string()))?;

    // Hugging Face model endpoint
    // Using Hello-SimpleAI/chatgpt-detector-roberta for AI detection
    let model_url = "https://api-inference.huggingface.co/models/Hello-SimpleAI/chatgpt-detector-roberta";

    // Create HTTP client
    let client = reqwest::Client::new();

    // Prepare request payload
    let request_body = HfRequest {
        inputs: text.to_string(),
    };

    // Make API request
    let response = client
        .post(model_url)
        .header("Authorization", format!("Bearer {}", api_token))
        .header("Content-Type", "application/json")
        .json(&request_body)
        .send()
        .await
        .map_err(|e| HfError::NetworkError(e.to_string()))?;

    // Check response status
    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
        return Err(HfError::ApiError(format!("API returned error: {}", error_text)));
    }

    // Parse response
    let hf_results: Vec<Vec<HfResponse>> = response
        .json()
        .await
        .map_err(|e| HfError::ParseError(e.to_string()))?;

    // Extract AI probability from results
    // The model returns [{"label": "Human", "score": 0.1}, {"label": "ChatGPT", "score": 0.9}]
    // We want the "ChatGPT" (AI-generated) score
    let ai_score = extract_ai_score(&hf_results)?;

    Ok(ai_score * 100.0) // Convert to percentage
}

/// Extract AI probability score from Hugging Face response
fn extract_ai_score(results: &[Vec<HfResponse>]) -> Result<f32, HfError> {
    if results.is_empty() || results[0].is_empty() {
        return Err(HfError::ParseError("Empty response from API".to_string()));
    }

    // Get the first result (we only send one input)
    let scores = &results[0];

    // Find the "ChatGPT" label (AI-generated text)
    for item in scores {
        if item.label.to_lowercase().contains("chatgpt")
            || item.label.to_lowercase().contains("ai")
            || item.label.to_lowercase().contains("fake") {
            return Ok(item.score);
        }
    }

    // If "ChatGPT" not found, try "LABEL_1" (some models use this)
    for item in scores {
        if item.label == "LABEL_1" {
            return Ok(item.score);
        }
    }

    // Fallback: assume first label is AI if it has highest score
    if scores.len() >= 2 {
        if scores[0].score > scores[1].score {
            return Ok(scores[0].score);
        } else {
            return Ok(scores[1].score);
        }
    }

    Err(HfError::ParseError("Could not find AI score in response".to_string()))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_extract_ai_score() {
        let mock_response = vec![vec![
            HfResponse {
                label: "Real".to_string(),
                score: 0.85,
            },
            HfResponse {
                label: "Fake".to_string(),
                score: 0.15,
            },
        ]];

        let result = extract_ai_score(&mock_response).unwrap();
        assert_eq!(result, 0.15);
    }
}

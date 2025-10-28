mod analyzer;

use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use actix_cors::Cors;
use actix_files::{Files, NamedFile};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use analyzer::TextAnalyzer;

#[derive(Deserialize)]
struct AnalyzeRequest {
    text: String,
}

#[derive(Serialize)]
struct AnalyzeResponse {
    human_percentage: f32,
    ai_percentage: f32,
    verdict: String,
}

async fn health_check() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "ok",
        "service": "brbrbr"
    }))
}

async fn analyze_text(req: web::Json<AnalyzeRequest>) -> impl Responder {
    let text = &req.text;

    // Perform AI detection analysis
    let ai_percentage = TextAnalyzer::analyze(text);
    let human_percentage = 100.0 - ai_percentage;
    let verdict = TextAnalyzer::get_verdict(ai_percentage);

    let response = AnalyzeResponse {
        human_percentage,
        ai_percentage,
        verdict,
    };

    HttpResponse::Ok().json(response)
}

async fn index() -> actix_web::Result<NamedFile> {
    let path: PathBuf = "./static/index.html".parse().unwrap();
    Ok(NamedFile::open(path)?)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("🚀 Starting brbrbr server on http://localhost:8080");

    HttpServer::new(|| {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();

        App::new()
            .wrap(cors)
            .route("/health", web::get().to(health_check))
            .route("/api/analyze", web::post().to(analyze_text))
            .service(Files::new("/assets", "./static/assets"))
            .route("/", web::get().to(index))
            .default_service(web::get().to(index))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

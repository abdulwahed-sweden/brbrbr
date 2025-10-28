use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use actix_cors::Cors;
use serde::{Deserialize, Serialize};

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
    // Dummy response: 50/50 for now
    let response = AnalyzeResponse {
        human_percentage: 50.0,
        ai_percentage: 50.0,
        verdict: "Uncertain".to_string(),
    };

    HttpResponse::Ok().json(response)
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
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

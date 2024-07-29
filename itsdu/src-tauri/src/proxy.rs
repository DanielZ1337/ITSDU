use actix_cors::Cors;
use actix_web::{http::header, web, App, HttpRequest, HttpResponse, HttpServer, Result};
use awc::Client;
use serde::Deserialize;
use std::sync::Arc;
use url::form_urlencoded;

#[derive(Deserialize)]
struct QueryParams {
    #[serde(flatten)]
    params: std::collections::HashMap<String, String>,
}

async fn proxy(
    req: HttpRequest,
    body: web::Bytes,
    query: web::Query<QueryParams>,
) -> Result<HttpResponse> {
    let client = Client::default();
    let mut url = format!("{}{}", itslearning_url(), req.uri().path());

    if !query.params.is_empty() {
        let query_string: String = form_urlencoded::Serializer::new(String::new())
            .extend_pairs(query.params.iter())
            .finish();
        url = format!("{}?{}", url, query_string);
    }

    println!("Sending Request to the Target: {} {}", req.method(), url);

    let mut client_req = client.request(req.method().clone(), url);

    for (key, value) in req.headers().iter() {
        client_req = client_req.insert_header((key.clone(), value.clone()));
    }

    let mut client_response = client_req
        .send_body(body)
        .await
        .map_err(actix_web::error::ErrorInternalServerError)?;
    let response_status = client_response.status();
    let response_headers = client_response.headers().clone();
    let body = client_response
        .body()
        .await
        .map_err(actix_web::error::ErrorInternalServerError)?;

    let mut response = HttpResponse::build(response_status);
    for (key, value) in response_headers.iter() {
        if key != header::CONTENT_ENCODING {
            response.insert_header((key.clone(), value.clone()));
        }
    }

    Ok(response.body(body))
}

fn itslearning_url() -> String {
    "https://sdu.itslearning.com".to_string()
}

pub async fn start_proxy_server() -> std::io::Result<()> {
    let server = HttpServer::new(|| {
        App::new()
            .wrap(Cors::permissive()) // Enable CORS
            .default_service(web::route().to(proxy))
    })
    .bind("127.0.0.1:9090")?
    .run();

    // Ensure the server future is Send
    tokio::spawn(async move { server.await }).await?
}

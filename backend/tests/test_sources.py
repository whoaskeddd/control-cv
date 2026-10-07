from fastapi.testclient import TestClient


def create_payload(**overrides: object) -> dict[str, object]:
    return {
        "name": "Конвейер №1",
        "url": "rtsp://192.168.1.21/stream",
        "location": "Цех 3",
        "enabled": True,
        **overrides,
    }


def test_source_lifecycle_and_search(client: TestClient) -> None:
    created = client.post("/sources", json=create_payload())

    assert created.status_code == 201
    source = created.json()
    assert source["id"] == 1
    assert source["enabled"] is True
    assert source["created_at"] == source["updated_at"]

    listed = client.get("/sources", params={"search": "192.168.1.21"})
    assert listed.status_code == 200
    assert [item["id"] for item in listed.json()] == [source["id"]]

    read = client.get(f"/sources/{source['id']}")
    assert read.status_code == 200
    assert read.json()["name"] == "Конвейер №1"

    updated = client.patch(f"/sources/{source['id']}", json={"enabled": False, "location": "Цех 4"})
    assert updated.status_code == 200
    assert updated.json()["enabled"] is False
    assert updated.json()["location"] == "Цех 4"
    assert updated.json()["updated_at"] != source["updated_at"]

    deleted = client.delete(f"/sources/{source['id']}")
    assert deleted.status_code == 204
    assert deleted.content == b""
    assert client.get(f"/sources/{source['id']}").status_code == 404


def test_rejects_invalid_payloads_and_missing_sources(client: TestClient) -> None:
    invalid_url = client.post("/sources", json=create_payload(url="ftp://camera.example/stream"))
    assert invalid_url.status_code == 422

    empty_name = client.post("/sources", json=create_payload(name="   "))
    assert empty_name.status_code == 422

    empty_patch = client.patch("/sources/404", json={})
    assert empty_patch.status_code == 422

    missing = client.delete("/sources/404")
    assert missing.status_code == 404


def test_health_endpoint(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

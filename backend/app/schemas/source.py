from datetime import datetime
from typing import Annotated
from urllib.parse import urlparse

from pydantic import BaseModel, ConfigDict, StringConstraints, field_validator, model_validator

RequiredText = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)]
OptionalText = Annotated[str | None, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)]


def validate_stream_url(value: str) -> str:
    normalized = value.strip()
    parsed = urlparse(normalized)
    if parsed.scheme not in {"rtsp", "http", "https"} or not parsed.netloc:
        raise ValueError("URL must use rtsp, http, or https and include a host")
    return normalized


class SourceCreate(BaseModel):
    name: RequiredText
    url: RequiredText
    location: RequiredText
    enabled: bool = True

    @field_validator("url")
    @classmethod
    def stream_url_is_supported(cls, value: str) -> str:
        return validate_stream_url(value)


class SourceUpdate(BaseModel):
    name: OptionalText = None
    url: OptionalText = None
    location: OptionalText = None
    enabled: bool | None = None

    @field_validator("url")
    @classmethod
    def stream_url_is_supported(cls, value: str | None) -> str | None:
        return validate_stream_url(value) if value is not None else value

    @model_validator(mode="after")
    def contains_a_change(self) -> "SourceUpdate":
        if not self.model_fields_set:
            raise ValueError("At least one field must be supplied")
        return self


class SourceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    url: str
    location: str
    enabled: bool
    created_at: datetime
    updated_at: datetime

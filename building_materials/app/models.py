from piccolo.table import Table
from piccolo.columns import (
    Varchar,
)
from enum import Enum


class UserRole(str, Enum):
    ADMIN = "admin"
    PURCHASER = "purchaser"
    SELLER = "seller"


class Users(Table):
    username = Varchar(length=255, unique=True)
    password_hash = Varchar(length=255)
    full_name = Varchar(length=255)
    role = Varchar(length=20)
